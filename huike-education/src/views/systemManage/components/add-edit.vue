<script setup>
import { reactive, ref } from 'vue'
import { addPost, editPost } from '@/api/post.js'
import { ElMessage } from 'element-plus'
const props = defineProps({
  dialogVisible: Boolean,
  formAdd: Object,
  isAdd: Boolean
})
//表单校验
const rules = reactive({
  postName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
  postCode: [{ required: true, message: '请输入岗位编码', trigger: 'blur' }]
})
const emit = defineEmits(['update:dialogVisible', 'addSucces'])
const resForm = ref(null)
// 取消
const handleClose = async () => {
  emit('update:dialogVisible', false)
  await resForm.value?.resetFields()
}
//编辑
// const editValue = ref({
//   postName: '',
//   status: '',
//   remark: '',
//   postId: null,
//   postSort: null,
//   postCode: ''
// })

//确认按钮
const handlerConfirm = async () => {
  await resForm.value?.validate()
  emit('update:dialogVisible', false)
  //添加
  if (props.isAdd) {
    props.formAdd.postSort = +props.formAdd.postSort
    const res = await addPost(props.formAdd)
    console.log(res)
    ElMessage({
      showClose: true,
      message: res.msg || '添加成功',
      type: res.msg ? 'success' : 'error'
    })
  }
  //编辑
  else {
    console.log(props.formAdd)
    const res = await editPost(props.formAdd)
    console.log(res)
    ElMessage({
      showClose: true,
      message: res.msg || '编辑成功',
      type: res.msg ? 'success' : 'error'
    })
  }
  await resForm.value?.resetFields()
  emit('addSucces')
}
</script>
<template>
  <el-dialog v-model="props.dialogVisible" width="50%" :before-close="handleClose">
    <template #header>
      <span>{{ props.isAdd ? '添加岗位' : '编辑岗位' }}</span>
    </template>
    <el-form :model="formAdd" ref="resForm" inline="true" :rules="rules">
      <el-form-item label="岗位名称" prop="postName">
        <el-input placeholder="请输入岗位名称" v-model="formAdd.postName"></el-input>
      </el-form-item>
      <el-form-item label="岗位编码" prop="postCode">
        <el-input placeholder="请输入岗位编码" v-model="formAdd.postCode"></el-input>
      </el-form-item>
      <el-form-item label="岗位顺序" prop="postSort">
        <el-input placeholder="请输入岗位顺序" v-model="formAdd.postSort"></el-input>
      </el-form-item>
      <el-form-item prop="status">
        <el-radio-group v-model="formAdd.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input
          placeholder="请输入"
          maxlength="50"
          type="textarea"
          show-word-limit
          autosize="true"
          v-model="formAdd.remark"
        ></el-input>
      </el-form-item>
      <span>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handlerConfirm">确认</el-button>
      </span>
    </el-form>
  </el-dialog>
</template>
