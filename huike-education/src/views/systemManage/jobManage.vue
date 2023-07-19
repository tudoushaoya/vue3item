<script setup>
defineOptions({ name: 'jobManagePage' })
import { onMounted, ref } from 'vue'
import { getPostList, delPost } from '@/api/post.js'
import { ElMessage } from 'element-plus'
import addEdit from './components/add-edit.vue'
//首次渲染
const total = ref(null)
const getList = async () => {
  const res = await getPostList(formData.value)
  total.value = res.data.total
  rows.value = res.data.records
  rows.value.forEach((item, index) => {
    item.index = index + 1
  })
}

onMounted(() => {
  getList()
})
const rows = ref([])
const formData = ref({
  page: '1',
  size: '10'
})
//搜索
const search = ref({
  postCode: '',
  postName: '',
  status: null
})
const inquire = async () => {
  formData.value.postCode = search.value.postCode
  formData.value.postName = search.value.postName
  formData.value.status = search.value.status
  getList()
  search.value.postCode = null
  search.value.postName = null
  search.value.status = null
}
//分页
// const fenye = async (val) => {

// }
//dialog对话框
const dialogVisible = ref(false)
//删除
const del = async (id) => {
  console.log(id)
  const res = await delPost(id)
  console.log(res)
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
  getList()
}
//添加
const add = () => {
  dialogVisible.value = true
  isAdd.value = true
  formAdd.value = {}
}
const formAdd = ref({
  postName: '',
  status: '',
  postCode: '',
  remark: '',
  postSort: null
})
//开关 判断是添加还是删除
const isAdd = ref(false)
//编辑
const Editor = ref([])
const edit = async (id) => {
  dialogVisible.value = true
  isAdd.value = false
  rows.value.forEach((item) => {
    if (item.postId === id) {
      Editor.value = item
      console.log(Editor.value)
      formAdd.value.postSort = Editor.value.postSort
      formAdd.value.postId = Editor.value.postId
      formAdd.value.postName = Editor.value.postName
      formAdd.value.status = Editor.value.status
      formAdd.value.remark = Editor.value.remark
      formAdd.value.postCode = Editor.value.postCode
    }
  })
  console.log(formAdd.value)
}

// 分页

const handleSizeChange = (val) => {
  console.log(val)
  formData.value.size = val
  getList()
}
const handleCurrentChange = (val) => {
  formData.value.page = val
  getList()
}
</script>
<template>
  <div>
    <el-form inline="true" :model="search">
      <el-form-item label="岗位编码:" prop="postCode">
        <el-input
          placeholder="请输入岗位编码"
          style="width: 220px"
          v-model="search.postCode"
        ></el-input>
      </el-form-item>
      <el-form-item label="岗位名称:" prop="postName">
        <el-input
          placeholder="请输入岗位名称"
          style="width: 220px"
          v-model="search.postName"
        ></el-input>
      </el-form-item>
      <el-form-item label="岗位状态:" prop="status">
        <el-select placeholder="选择状态" v-model="search.status">
          <el-option :value="0" label="正常"></el-option>
          <el-option :value="1" label="停用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="inquire">搜索</el-button>
      </el-form-item>
    </el-form>
    <div style="text-align: right; margin: 20px 0">
      <el-button type="primary" @click="add">添加岗位</el-button>
    </div>
    <el-table :data="rows" align="center">
      <el-table-column label="序号" width="100" type="index">
        <template #default="scope">
          {{ (formData.page - 1) * formData.size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="岗位编码" width="170" prop="postCode"></el-table-column>
      <el-table-column label="岗位名称" width="180" prop="postName"></el-table-column>
      <el-table-column label="岗位排序" width="170" prop="postSort"></el-table-column>
      <el-table-column label="状态" width="170">
        <template #default="scope">
          {{ scope.row.status === 0 ? '正常' : '停用' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="120" prop="createTime"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" type="primary" link @click="edit(scope.row.postId)"
            >修改</el-button
          >
          <el-popconfirm title="确认删除?" @confirm="del(scope.row.postId)">
            <template #reference>
              <el-button size="small" type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px; text-align: right">
      <el-pagination
        :page-sizes="[10, 20, 30, 40]"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <add-edit
      v-model:dialogVisible="dialogVisible"
      @addSucces="getList"
      :formAdd="formAdd"
      :isAdd="isAdd"
    ></add-edit>
  </div>
</template>

<style lang="scss" scoped></style>
