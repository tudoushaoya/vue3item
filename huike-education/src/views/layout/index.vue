<script setup>
defineOptions({ name: 'layoutPage' })
import sideBar from './components/sideBar.vue'
import navBar from './components/navBar.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useToken from '@/stores/token.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const { removeToken } = useToken()
const circleUrl = 'https://avatars.githubusercontent.com/u/8186664?v=4'

const loginOut = () => {
  ElMessageBox.confirm('确认退出吗', '退出', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      removeToken()
      router.push('/login')
      ElMessage({
        type: 'success',
        message: '退出登录'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消退出'
      })
    })
}
</script>
<template>
  <!-- <div class="common-layout"> -->
  <el-container class="container">
    <el-aside class="aside-layout" style="width: 207px">
      <div class="logo1">
        <img src="../../assets/login/crmmp@2x.png" alt="" />
        <h3>汇课教育</h3>
      </div>
      <side-bar></side-bar>
      <div class="sidebar-footer">
        <el-avatar :size="50" :src="circleUrl" class="avatar-img" />
        <span v-if="collapsed">admin</span>
        <span style="margin: 0 10px">|</span>
        <!-- <el-icon><HomeFilled /></el-icon> -->
        <img
          src="../../assets/btn_quite_hover.png"
          alt=""
          @click="loginOut"
          style="margin-left: 30px"
        />
      </div>
    </el-aside>
    <el-container>
      <el-header class="headerBar">
        <nav-bar></nav-bar>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  <!-- </div> -->
</template>

<style lang="scss" scoped>
.aside-layout {
  position: relative;
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100vh;
  color: #fff;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  align-items: center;
  background-color: #2b303c;
  // background-color: pink;
  width: 200px;
  height: 100vh;
  z-index: 3;
  .logo1 {
    padding-top: 40px;
    text-align: center;
    img {
      width: 41px;
      height: 46px;
    }
  }
  .sidebar-footer {
    // position: fixed;
    // bottom: 0;
    height: 100px;
    width: 100%;
    display: flex;
    align-items: center;
    .avatar-img {
      margin: 0 10px 0 15px;
    }
  }
}
.headerBar {
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  // position: fixed;
  top: 0;
  z-index: 9;
  margin-left: 210px;
}
/* :deep(.el-avatar) {
  height: 35px;
} */
.container {
  position: relative;
  height: 100vh;
  width: 100vw;
  .el-main {
    padding: 20px;
    background-color: #f7f7f7;
  }
}
.main {
  padding: 20px;
  background-color: #f7f7f7;
  margin-left: 200px;
}
</style>
