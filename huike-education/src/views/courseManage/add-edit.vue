<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { addCourse, updateCourse } from '@/api/course'
const props = defineProps({
  dialogFormVisible: Boolean,
  isAdd: Boolean,
  formAdd: Object,
  formAddId: Number
})
const rules = reactive({
  subject: [{ required: true, message: '请选择课程学科', trigger: 'change' }],
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  applicablePerson: [{ required: true, message: '请选择适用人群', trigger: 'change' }],
  price: [{ required: true, message: '请输入课程价格', trigger: 'blur' }]
})
const emit = defineEmits(['update:dialogFormVisible', 'address'])
const handleClose = async () => {
  emit('update:dialogFormVisible', false)
  await resForm.value?.resetFields()
}
const resForm = ref(null)
const handlerConfirm = async () => {
  await resForm.value?.validate()
  emit('update:dialogFormVisible', false)
  if (props.isAdd) {
    const res = await addCourse(props.formAdd)
    console.log(res)
    ElMessage({
      showClose: true,
      message: res.data.msg || '添加成功',
      type: res.data.msg ? 'error' : 'success'
    })
  } else {
    const res = await updateCourse(props.formAdd)
    console.log(res)
    ElMessage({
      showClose: true,
      message: res.data.msg || '修改成功',
      type: res.data.msg ? 'error' : 'success'
    })
  }
  await resForm.value?.resetFields()
  emit('address')
}
</script>
<template>
  <el-dialog v-model="props.dialogFormVisible" width="35%" :before-close="handleClose">
    <template #header>
      <span class="dialog-header">{{ props.isAdd ? '添加课程' : '编辑课程' }}</span>
    </template>
    <el-form label-width="100px" :model="formAdd" ref="resForm" :rules="rules">
      <el-form-item label="课程信息" />
      <el-form-item label="课程学科" prop="subject">
        <el-select style="width: 100%" v-model="formAdd.subject">
          <el-option :value="1" label="Java" />
          <el-option :value="2" label="前端" />
          <el-option :value="3" label="人工智能" />
          <el-option :value="4" label="大数据" />
          <el-option :value="5" label="Python" />
          <el-option :value="6" label="测试" />
          <el-option :value="7" label="新媒体" />
          <el-option :value="8" label="产品经理" />
          <el-option :value="9" label="UI设计" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程名称" prop="name">
        <el-input style="width: 100%" v-model="formAdd.name"></el-input>
      </el-form-item>
      <el-form-item label="适用人群" prop="applicablePerson">
        <el-select style="width: 100%" v-model="formAdd.applicablePerson">
          <el-option :value="1" label="小白学院" />
          <el-option :value="2" label="中级程序员" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程价格" prop="price">
        <el-input style="width: 100%" v-model="formAdd.price"></el-input>
      </el-form-item>
      <el-form-item label="备课程介"></el-form-item>
      <el-form-item prop="info">
        <el-input
          type="textarea"
          :rows="5"
          style="width: 100%"
          placeholder="请输入"
          v-model="formAdd.info"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">返回</el-button>
        <el-button type="primary" @click="handlerConfirm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
