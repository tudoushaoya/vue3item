<script setup>
defineOptions({ name: 'dictionaryManagePage' })
import {
  getDictionary,
  delDictionary,
  addDictionary,
  editDictionary,
  deriveDictionary
} from '@/api/dictionary.js'
import { onMounted, ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const rows = ref([])
const params = ref({
  page: 1,
  size: 10
})
const createTime = ref([])

const formData = ref({
  dictName: '',
  dictType: '',
  status: null,
  beginTime: '',
  endTime: ''
})
//添加
const add = () => {
  dialogVisible.value = true
  isAdd.value = true
  formAdd.value = {}
}
const formAdd = ref({
  dictName: '',
  dictType: '',
  status: null,
  remark: ''
})
//编辑
const Editor = ref([])
const edit = async (id) => {
  console.log(id)
  dialogVisible.value = true
  isAdd.value = false
  rows.value.forEach((item) => {
    if (item.dictId === id) {
      Editor.value = item
      formAdd.value.dictName = Editor.value.dictName
      formAdd.value.dictType = Editor.value.dictType
      formAdd.value.status = Editor.value.status
      formAdd.value.remark = Editor.value.remark
      formAdd.value.dictId = Editor.value.dictId
    }
  })
}
//开关
const isAdd = ref(false)
const verify = async () => {
  await resForm.value?.validate()
  dialogVisible.value = false
  if (isAdd.value) {
    const res = await addDictionary(formAdd.value)
    console.log(res)
    ElMessage({
      showClose: true,
      message: res.msg || '添加成功',
      type: res.msg ? 'error' : 'success'
    })
  } else {
    console.log(Editor.value)
    const res = await editDictionary(formAdd.value)
    console.log(res)
    ElMessage({
      showClose: true,
      message: res.msg || '修改成功',
      type: res.msg ? 'error' : 'success'
    })
  }
  await resForm.value?.resetFields()
  getDictionaryAPI()
}
//表单校验
const resForm = ref(null)
const rules = reactive({
  dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  dictType: [{ required: true, message: '请输入字典类型', trigger: 'blur' }]
})
//洞洞
const multipleTableRef = ref(null)
const multipleSelection = ref([])
const multipleSelection111 = ref({})
const handleSelectionChange = (val) => {
  // multipleSelection.value = val
  multipleSelection.value = val
  multipleSelection111.value = multipleSelection.value.map((item) => item.dictId)
  console.log(multipleSelection111.value)
  // val.forEach((e) => {
  //   multipleSelection.value.push(e.dictId)
  //   console.log(e.dictId)
  //   multipleSelection.value = e.dictId
  // })
  // console.log(multipleSelection.value)
}
//批量删除

const delAny = async () => {
  const res1 = multipleSelection111.value.join(',')
  const res = await delDictionary({ dictId: res1 })
  ElMessage({
    type: res.msg ? 'info' : 'success',
    message: res.msg || '删除成功'
  })
  await resForm.value?.resetFields()
  getDictionaryAPI()
}
//获取列表
const total = ref(null)
const getDictionaryAPI = async () => {
  const res = await getDictionary(params.value)
  console.log(res)
  rows.value = res.data.records
  total.value = res.data.total
  console.log(rows.value)
}
onMounted(() => {
  getDictionaryAPI()
})
//搜索
const inquire = async () => {
  params.value.beginTime = createTime.value[0]
  params.value.endTime = createTime.value[1]
  params.value.dictName = formData.value.dictName
  params.value.dictType = formData.value.dictType
  params.value.status = formData.value.status
  params.value.createTime = formData.value.createTime
  console.log(params.value)
  getDictionaryAPI()
}
//重置
const reset = () => {
  formData.value.dictName = null
  formData.value.dictType = null
  formData.value.status = null
  createTime.value = ''
  delete params.value.dictName
  delete params.value.dictType
  delete params.value.status
  delete params.value.beginTime
  delete params.value.endTime
  delete params.value.createTime
  getDictionaryAPI()
}
//分页
const handleSizeChange = (val) => {
  console.log(val)
  params.value.size = val
  getDictionaryAPI()
}
const handleCurrentChange = (val) => {
  params.value.page = val
  getDictionaryAPI()
}
//删除
const open = async (id) => {
  ElMessageBox.confirm(`是否确认删除字典编码为${id}的数据项?`, '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      console.log('成功')
      const res = await delDictionary({ dictId: id })
      console.log(res)
      getDictionaryAPI()
      ElMessage({
        type: res.msg ? 'info' : 'success',
        message: res.msg || '删除成功'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除失败'
      })
    })
  await resForm.value?.resetFields()
  getDictionaryAPI()
}
//dialogVisible对话框
const dialogVisible = ref(false)
const refForm = ref(null)
//导出
const derive = async () => {
  const res = await deriveDictionary()
  console.log(res)
  window.open(res.data)
}
</script>
<template>
  <div>
    <el-form inline="true" :model="formData">
      <el-form-item label="字典名称:" prop="dictName">
        <el-input
          placeholder="请输入字典名称"
          style="width: 220px"
          v-model="formData.dictName"
        ></el-input>
      </el-form-item>
      <el-form-item label="字典类型:" prop="dictType">
        <el-input
          placeholder="请输入字典类型"
          style="width: 220px"
          v-model="formData.dictType"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-select placeholder="字典状态" v-model="formData.status">
          <el-option :value="0" label="正常"></el-option>
          <el-option :value="1" label="停用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间:" prop="createTime">
        <div class="block">
          <el-date-picker
            v-model="createTime"
            type="datetimerange"
            range-separator="To"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="text" @click="inquire">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="width: 100%; text-align: right">
      <div style="text-align: left">已选0项</div>
      <el-space>
        <el-button @click="add" type="primary"
          ><el-icon><Plus /></el-icon>新增</el-button
        >
        <el-button :disabled="multipleSelection.length !== 1"
          ><el-icon><InfoFilled /></el-icon>修改</el-button
        >

        <el-button :disabled="multipleSelection.length === 0" @click="delAny"
          ><el-icon><Delete /></el-icon>删除</el-button
        >
        <el-button @click="derive">
          <el-icon><Download /></el-icon>导出</el-button
        >
        <el-button
          ><el-icon><Refresh /></el-icon>清理缓存</el-button
        >
      </el-space>
    </div>
    <el-table
      :data="rows"
      ref="multipleTableRef"
      @selection-change="handleSelectionChange"
      align="center"
    >
      <el-table-column type="selection" width="80"></el-table-column>
      <el-table-column label="字典编号" width="145" prop="dictId"></el-table-column>
      <el-table-column label="字典名称" width="145" prop="dictName"></el-table-column>
      <el-table-column label="字典类型" width="145" prop="dictType"></el-table-column>
      <el-table-column label="状态" width="145">
        <template #default="scope">
          {{ scope.row.status === '0' ? '正常' : '停用' }}
        </template>
      </el-table-column>
      <el-table-column label="备注" width="120" prop="remark"></el-table-column>
      <el-table-column label="创建时间" width="145" prop="createTime"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button @click="edit(scope.row.dictId)"
            ><el-icon><EditPen /></el-icon>修改</el-button
          >

          <el-button plain @click="open(scope.row.dictId)"
            ><el-icon><Delete /></el-icon>删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="demo-pagination-block" style="display: flex; justify-content: flex-end">
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
    <el-dialog width="50%" v-model="dialogVisible" ref="refForm">
      <template #header>
        <sapn>{{ isAdd ? '添加字典类型' : '修改字典类型' }}</sapn>
      </template>
      <el-form :rules="rules" ref="resForm" :model="formAdd">
        <el-form-item label="字典名称" prop="dictName">
          <el-input placeholder="请输入字典名称" v-model="formAdd.dictName"></el-input>
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input placeholder="请输入字典类型" v-model="formAdd.dictType"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formAdd.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input placeholder="请输入内容" type="textarea" v-model="formAdd.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <span style="text-align: right; width: 100%">
            <el-button type="primary" @click="verify">确认</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
