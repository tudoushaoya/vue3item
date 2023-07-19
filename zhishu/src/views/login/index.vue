<script setup>
import { ref } from 'vue'
import { login } from '@/api/user.js'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import useToken from '@/stores/token.js'
const router = useRouter()
const { setToken } = useToken()
const loginForm = ref({
  username: 'demo',
  password: 'zh@hm#23',
  checked: false
})
const validator = (_, values) => {
  return values ? Promise.resolve() : Promise.reject('请勾选')
}
const onFinish = async (value) => {
  delete value.checked
  const res = await login(value)
  setToken(res.data.token) //将token存入vuex
  message.success('登录成功')
  router.push('/')
}
</script>

<template>
  <a-row type="flex" justify="space-between" align="middle">
    <a-col :span="14">
      <div class="logo" />
    </a-col>
    <a-col :span="10" align-item="center">
      <div class="form">
        <h2>智慧园区-登录</h2>
        <a-form :model="loginForm" @finish="onFinish" hideRequiredMark>
          <a-form-item
            label="账号"
            name="username"
            :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]"
          >
            <a-input v-model:value="loginForm.username" placeholder="请输入账号" />
          </a-form-item>
          <a-form-item
            label="密码"
            name="password"
            :rules="[{ required: true, message: '密码不能为空', trigger: 'blur' }]"
          >
            <a-input-password
              type="text"
              v-model:value="loginForm.password"
              placeholder="请输入密码"
            >
            </a-input-password>
          </a-form-item>
          <a-form-item name="checked" :rules="[{ validator, trigger: 'blur' }]">
            <a-checkbox v-model:checked="loginForm.checked">记住我</a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" block html-type="submit">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-col>
  </a-row>
</template>

<style>
.logo {
  height: 100vh;
  background: rgba(38, 72, 176) url(../../assets/login-bg.svg) no-repeat center / cover;
  border-top-right-radius: 60px;
}

.form {
  width: 250px;
  margin-left: 150px;
}

h2 {
  margin-bottom: 80px;
}
</style>
