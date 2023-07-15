<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>智慧园区-登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <el-form ref="loginForm" :model="loginForm" :rules="loginFormRules">
          <el-form-item label="账号" prop="username">
            <el-input v-model="loginForm.username" type="text" placeholder="请输入账号" size="small" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" :type="open?'text':'password'" placeholder="请输入密码" size="small">
              <template #suffix>
                <svg-icon :icon-class="open?'eye-open':'eye'" style="cursor: pointer;user-select: none;" @click="open=!open" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="isChecked">
            <el-checkbox v-model="loginForm.isChecked">记住我</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" style="background-color: #4770ff;" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Login',
  data() {
    return {
      open: false,
      loginForm: {
        username: process.env.NODE_ENV === 'development' ? 'demo' : '',
        password: process.env.NODE_ENV === 'development' ? 'zh@hm#23' : '',
        isChecked: false
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        isChecked: [
          { validator: (rule, value, callback) => {
            value ? callback() : callback(new Error('必须勾选协议'))
          }, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async login() {
      try {
        await this.$refs.loginForm.validate()
        const obj = { ...this.loginForm }// 浅拷贝
        delete obj.isChecked
        await this.$store.dispatch('user/login', obj)
        this.$router.push('/')
        this.$message.success('登录成功')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/login-bg.svg)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      margin-bottom: 76px;
      font-size: 24px;
      font-weight: 400;
    }
    .el-input{
      width: 350px
    }
    .el-checkbox {
      color:#606266;
    }
    .el-button{
      width: 350px
    }
  }
}
</style>
