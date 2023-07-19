<script setup>
import { onMounted, ref } from 'vue'
import { addUser, editUserId, editUser } from '@/api/user'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'add_edit_User'
})

const props = defineProps({
  dialogVisible: {
    type: Boolean
  },
  flag: {
    type: Boolean
  }
})
const btnClose = () => {
  formRef.value.resetFields()
  emit('close', false)
}
// 通知父组件
const emit = defineEmits(['close', 'add'])

const formDate = ref({
  id: null,
  phone: '',
  password: '123456',
  name: '',
  username: '',
  departmentId: null,
  rank: '',
  roleAssignment: ''
})

const formRef = ref(null)
const submitForm = async () => {
  await formRef.value.validate()

  try {
    if (!props.flag) {
      await editUser(formDate.value)
      ElMessage.success('修改成功')
      emit('add')
    } else {
      await addUser(formDate.value)
      ElMessage.success('添加成功')
      emit('add')
    }
  } catch (e) {
    console.log(e)
  }
  emit('close', false)
}

const close = () => {
  emit('close', false)
}
const getUserDetail = async (id) => {
  formDate.value.id = id
  const {
    data: { department, phone, name, rank, roleAssignment, userName }
  } = await editUserId(id)
  formDate.value.phone = phone
  formDate.value.departmentId = department
  formDate.value.name = name
  formDate.value.rank = rank
  formDate.value.roleAssignment = roleAssignment
  formDate.value.username = userName
}
defineExpose({
  getUserDetail
})
onMounted(() => {})
</script>

<template>
  <el-dialog
    v-model="props.dialogVisible"
    :title="!props.flag ? '编辑用户' : '添加用户'"
    :before-close="btnClose"
  >
    <el-form :model="formDate" label-width="200" ref="formRef">
      <el-form-item
        label="手机号"
        prop="phone"
        :rules="[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { mix: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
        ]"
      >
        <el-input placeholder="请输入" v-model="formDate.phone" style="width: 380px"></el-input>
      </el-form-item>
      <el-form-item label="默认密码" prop="password">
        <el-input
          placeholder="请输入"
          v-model="formDate.password"
          style="width: 380px"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item
        label="真实姓名"
        prop="name"
        :rules="[
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { mix: 2, max: 4, message: '请输入2-4字符真实姓名', trigger: 'blur' }
        ]"
      >
        <el-input placeholder="请输入" v-model="formDate.name" style="width: 380px"></el-input>
      </el-form-item>
      <el-form-item
        label="账号"
        prop="username"
        :rules="[
          { required: true, message: '请输入账号', trigger: 'blur' },
          { mix: 2, max: 20, message: '最少2-20字符账号', trigger: 'blur' }
        ]"
      >
        <el-input placeholder="请输入" v-model="formDate.username" style="width: 380px"></el-input>
      </el-form-item>
      <el-form-item label="组织结构" prop="departmentId">
        <el-select v-model="formDate.departmentId" placeholder="请选择" style="width: 380px">
          <el-option label="市场部" value="100"></el-option>
          <el-option label="北京总公司" value="101"></el-option>
          <el-option label="研发部门" value="103"></el-option>
          <el-option label="销售部门" value="214"></el-option>
          <el-option label="销售部" value="216"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职级" prop="rank">
        <el-select v-model="formDate.rank" placeholder="请选择" style="width: 380px">
          <el-option label="董事长" :value="1"></el-option>
          <el-option label="项目经理" :value="2"></el-option>
          <el-option label="人力资源" :value="3"></el-option>
          <el-option label="普通员工" :value="4"></el-option>
          <el-option label="销售部主管" :value="12"></el-option>
          <el-option label="新员工" :value="13"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="角色分配"
        prop="roleAssignment"
        :rules="[{ required: true, message: '请选择角色分配', trigger: 'blur' }]"
      >
        <div class="mb-2 flex items-center text-sm">
          <el-radio-group v-model="formDate.roleAssignment">
            <el-radio :label="1">超级管理员</el-radio>
            <el-radio :label="2">销售主管</el-radio>
            <el-radio :label="3">销售专员 </el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-dialog__footer {
  text-align: center !important;
}
</style>
