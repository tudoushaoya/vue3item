<script setup>
defineOptions({ name: 'departmentManagePage' })
import { transListToTree } from '@/utils/index.js'
import { getSection, delSection, editSection, addSection } from '@/api/section.js'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

const formData = ref([])
const params = ref({
  page: '1',
  size: '10'
})
const getSectionAPI = async () => {
  const res = await getSection(params.value)
  console.log(res)
  const treeData = transListToTree(res.data.records, 0)
  formData.value = treeData
  console.log(formData.value)
}
//搜索
const searchRef = ref({
  deptName: '',
  status: null
})
const search = async () => {
  params.value.deptName = searchRef.value.deptName
  params.value.status = searchRef.value.status
  getSectionAPI()
  searchRef.value.deptName = null
  searchRef.value.status = null
}
//删除
const del = async (id) => {
  console.log(id)
  const res = await delSection(id)
  console.log(res)
  ElMessage({
    type: res.msg ? 'info' : 'success',
    message: res.msg || '删除成功'
  })
}
//添加编辑
const formAdd = ref({
  parentId: null,
  deptName: '',
  orderNum: null,
  status: null
})
//开关
const isShow = ref(false)
const add = () => {
  dialogVisible.value = true
  isShow.value = true
  formAdd.value = {}
}
const Editor = ref([])
const edit = async (id) => {
  console.log(id)
  dialogVisible.value = true
  isShow.value = false
  formData.value.forEach((item) => {
    if (item.deptId === id) {
      Editor.value = item
      formAdd.value.parentId = Editor.value.parentId
      formAdd.value.deptName = Editor.value.deptName
      formAdd.value.orderNum = Editor.value.orderNum
      formAdd.value.status = Editor.value.status
    }
  })
}
const resForm = ref(null)
const refForm = ref(null)
const verify = async () => {
  await resForm.value?.validate()
  dialogVisible.value = false
  if (isShow.value) {
    formAdd.value.parentId = +formAdd.value.parentId
    const res = await addSection(formAdd.value)
    console.log(res)
    ElMessage({
      showClose: true,
      message: res.msg || '添加成功',
      type: res.msg ? 'error' : 'success'
    })
  } else {
    const res = await editSection(formAdd.value)
    console.log(res)
    ElMessage({
      showClose: true,
      message: res.msg || '编辑成功',
      type: res.msg ? 'error' : 'success'
    })
  }
}
//树状
// const selectName = ref([])

onMounted(() => {
  getSectionAPI()
})
//对话框
const dialogVisible = ref(false)
</script>
<template>
  <div>
    <el-card>
      <el-form inline="true" :model="searchRef">
        <el-form-item label="部门名称:" prop="deptName">
          <el-input
            placeholder="请输入部门名称"
            style="width: 220px"
            v-model="searchRef.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门状态:" prop="status">
          <el-select placeholder="选择部门状态" v-model="searchRef.status">
            <el-option :value="0" label="正常"></el-option>
            <el-option :value="1" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div style="text-align: right; margin: 20px 0">
      <el-button type="primary" @click="add">添加部门</el-button>
    </div>
    <el-table
      :data="formData"
      row-key="deptId"
      default-expand-all
      align="center"
      style="width: 100%"
    >
      <el-table-column label="部门名称" prop="deptName"></el-table-column>
      <el-table-column label="排序" prop="orderNum"></el-table-column>
      <el-table-column label="状态 ">
        <template #default="scope">
          {{ scope.row.status === 1 ? '停用' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" type="primary" link @click="edit(scope.row.deptId)"
            >修改</el-button
          >
          <el-popconfirm title="确认删除?" @confirm="del(scope.row.deptId)">
            <template #reference>
              <el-button size="small" link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" ref="refForm">
      <template #header>
        <span>{{ isShow ? '添加部门' : '编辑部门' }}</span>
      </template>
      <el-form :inline="true" ref="resForm" :model="formAdd">
        <el-form-item label="上级部门" prop="parentId">
          <el-select placeholder="请输入部门名称" v-model="formAdd.parentId">
            <el-option value="100" label="客达管家"></el-option>
            <el-option value="101" label="北京总公司"></el-option>
            <el-option value="103" label="研发部门"></el-option>
            <el-option value="214" label="销售部门"></el-option>
            <el-option value="215" label="市场部（线索）"></el-option>
            <el-option value="216" label="销售部（商机）"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="formAdd.deptName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number
            v-model="formAdd.orderNum"
            :min="0"
            :max="10"
            controls-position="right"
            size="large"
            @change="handleChange"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-radio-group v-model="formAdd.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <span style="width: 100%; text-align: right">
            <el-button type="primary" @click="verify">确认</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
