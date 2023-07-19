<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { getRoleList, addEmployee, updateEmployee } from '@/api/employee'
import { message } from 'ant-design-vue'
watch(
  () => props.showDialog,
  (newVal) => {
    if (newVal) {
      dataEcho()
    }
  }
)
onMounted(async () => {
  const res = await getRoleList()
  console.log(res)
  tenantList.push(...res.data)
})
// 角色列表
const tenantList = reactive([])

const formData = reactive({
  id: null, // 员工id
  roleId: null, // 角色id
  name: '', // 员工姓名
  userName: '', // 登录账号
  status: null, // 状态
  phonenumber: '' // 联系方式
})
//接收父组件传递的参数
const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },
  formitem: {
    type: Object
  }
})
const formRef = ref(null)
const emit = defineEmits(['update:showDialog', 'addSuccess'])
const btnCancel = () => {
  formRef.value.resetFields() // 重置表单
  emit('update:showDialog', false)
  emit('addSuccess')
}
// 数据回显
const dataEcho = () => {
  if (props.formitem) {
    console.log(props.formitem)
    const allstatus = props.formitem.status === '启用' ? 1 : 0
    formData.id = props.formitem.id
    formData.roleId = props.formitem.roleId
    formData.name = props.formitem.name
    formData.userName = props.formitem.userName
    formData.status = allstatus
    formData.phonenumber = props.formitem.phonenumber
    console.log(formData)
  }
}
const onFinish = async (values) => {
  console.log(values)
  if (formData.id) {
    // 编辑
    values.id = formData.id
    const res = await updateEmployee(values)
    console.log(res)
    message.success('编辑成功')
  } else {
    // 添加
    const res = await addEmployee(values)
    console.log(res)
    message.success('添加成功')
  }
  emit('addSuccess')
  btnCancel()
}
const showTitle = computed(() => (formData.id ? '编辑员工' : '添加员工'))
</script>
<template>
  <a-modal :title="showTitle" :visible="props.showDialog" :footer="null" @cancel="btnCancel">
    <a-form :model="formData" :label-col="{ span: 6 }" ref="formRef" @finish="onFinish">
      <a-form-item
        label="员工姓名"
        name="name"
        :rules="[{ required: true, message: '员工姓名不能为空', trigger: 'blur' }]"
      >
        <a-input v-model:value="formData.name" placeholder="请输入员工姓名"></a-input>
      </a-form-item>
      <a-form-item
        label="登录帐号"
        name="userName"
        :rules="[{ required: true, message: '登录帐号不能为空', trigger: 'blur' }]"
      >
        <a-input v-model:value="formData.userName" placeholder="请输入登录帐号"></a-input>
      </a-form-item>
      <a-form-item
        label="联系方式"
        name="phonenumber"
        :rules="[
          { required: true, message: '联系方式不能为空', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]"
      >
        <a-input v-model:value="formData.phonenumber" placeholder="请填写联系方式"></a-input>
      </a-form-item>
      <a-form-item v-if="!formData.id">
        <a-span style="margin-left: 50px"> 默认密码:123456</a-span>
      </a-form-item>
      <a-form-item
        label="分配角色"
        name="roleId"
        :rules="[{ required: true, message: '租户不能为空', trigger: 'blur' }]"
      >
        <a-select
          v-model:value="formData.roleId"
          placeholder="请选择分配角色"
          :options="tenantList"
          :field-names="{ label: 'roleName', value: 'roleId' }"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="员工状态" name="status">
        <a-radio-group v-model:value="formData.status">
          <a-radio :value="0">禁用</a-radio>
          <a-radio :value="1">启用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item>
        <a-row justify="center" style="margin-top: 10px">
          <a-space>
            <a-button type="primary" html-type="submit">确定</a-button>
            <a-button @click="btnCancel">取消</a-button>
          </a-space>
        </a-row>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
