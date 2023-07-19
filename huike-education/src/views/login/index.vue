<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCode, getLogin } from '@/api/login.js'
import { useRouter } from 'vue-router'
import useToken from '@/stores/token'
import { ElMessage } from 'element-plus'
const router = useRouter()
defineOptions({ name: 'loginPage' })
const loginForm = ref({
  number: '17608209899',
  password: '123456',
  code: ''
})
// 表单验证
const loginRules = reactive({
  number: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 11, max: 11, message: '请输入正确的用户名！', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 6, message: '请输入正确的密码！', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '请输入正确的验证码！', trigger: 'blur' }
  ]
})

const imgUrl = ref('')
// 获取验证码
const getCodeAPI = async () => {
  const res = await getCode()
  // const myTypedArray = new Uint8Array(res)
  // const str = String.fromCharCode(...myTypedArray)
  const arrayBufferToBase64Img = (buffer) => {
    const str = String.fromCharCode(...new Uint8Array(buffer))
    return `data:image/jpeg;base64,${window.btoa(str)}`
  }
  imgUrl.value = arrayBufferToBase64Img(res)
}
//验证码刷新
const refreshCode = () => {
  imgUrl.value = ''
  getCodeAPI()
}
// 登录
const login1 = async () => {
  try {
    const res = await getLogin(loginForm.value)
    if (res.code === 200) {
      ElMessage.success('登录成功')
      const { setToken } = useToken()
      setToken(res.data.token)
      router.push('/home')
    }
    if (res.code === 0) {
      ElMessage.error(res.msg)
    }
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  getCodeAPI()
})
</script>
<template>
  <div class="login-container">
    <div class="logo"></div>
    <div class="form">
      <div class="title">
        <img src="../../assets/login/crmmp@2x.png" alt="" />
        <h3>汇客教育</h3>
      </div>
      <el-form class="login-form" :model="loginForm" :rules="loginRules">
        <el-form-item prop="number">
          <el-input placeholder="请输入用户名" v-model="loginForm.number">
            <template #prefix>
              <img class="img-form" src="../../assets/login/形状 2@2x.png" alt="" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model="loginForm.password">
            <template #prefix>
              <img class="img-form" src="../../assets/login/LockOutline@2x.png" alt="" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input placeholder="验证码" v-model="loginForm.code" @keyup.enter="login1">
            <template #prefix>
              <el-icon><Discount /></el-icon>
            </template>
            <template #suffix>
              <img
                :src="imgUrl"
                alt=""
                style="width: 85px; height: 35px; border: 1px solid pink"
                @click="refreshCode"
              />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round size="large" @click="login1">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 2;
    background: #05cd95 url(../../assets/login/矩形@2x.png) no-repeat center / cover;
  }
  .form {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 80px;
    .title {
      display: flex;
      padding-left: 30px;
      font-size: 20px;
      margin-bottom: 30px;
      img {
        width: 33px;
        height: 36px;
        margin: 20px 10px 0 0;
      }
    }
    .el-form {
      width: 320px;
      border: none;
      padding: 0;
      .el-input {
        height: 50px;
      }
      .el-button {
        margin-top: 20px;
        width: 100%;
      }
      .img-form {
        width: 15px;
        height: 15px;
      }
    }
  }
  /* .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 50px;
    .ant-card {
      width: 320px;
      border: none;
      padding: 0;
    }
    h3 {
      padding-left: 30px;
      font-size: 24px;
    }
  } */
}
</style>
