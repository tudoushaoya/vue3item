<script setup>
import { ref } from 'vue'
import sideBar from './components/side-bar.vue'
import NavBar from './components/nav-bar.vue'

const collapsed = ref(false)
</script>
<template>
  <a-layout class="app-layout">
    <a-layout-sider
      :collapsed="collapsed"
      collapsible
      :trigger="null"
      width="220"
      style="background-color: #fff"
    >
      <div class="logo1">
        <img
          :src="
            collapsed
              ? 'https://rzzt-1317097641.cos.ap-chengdu.myqcloud.com/logo12png.png'
              : ' https://rzzt-1317097641.cos.ap-chengdu.myqcloud.com/hmzs-logo.png '
          "
        />
      </div>
      <!-- <div v-show="collapsed === true" class="logo1">
        <img src="@/assets/logo12png.png" alt="" />
      </div>
      <div v-show="collapsed === false" class="logo1">
        <img src="@/assets/hmzs-logo.png" alt="" />
      </div> -->
      <sideBar />
    </a-layout-sider>
    <a-layout class="right-layout">
      <a-layout-header style="background-color: #f4f6f8">
        <nav-bar v-model:collapsed="collapsed"></nav-bar>
      </a-layout-header>
      <a-layout-content style="background-color: #f4f6f8">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less">
.app-layout {
  min-height: 100vh;
  display: flex;
  .ant-layout-sider {
    overflow: auto;
    height: 100vh;
    .logo1 {
      height: 60px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .right-layout {
    flex: 1;
    height: 100vh;
    overflow-y: auto;
  }
  .ant-layout-header {
    background-color: #fff;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .anticon {
      font-size: 20px;
      cursor: pointer;
    }
  }
}

.my-avatar {
  color: #f56a00;
  background-color: #fde3cf;
  cursor: pointer;
}
.my-select {
  margin: -5px -16px;
  .item {
    padding: 5px 20px;
    margin-bottom: 0 !important;
    color: #666;
    &:hover {
      background-color: #fafafa;
      cursor: pointer;
    }
  }
}
</style>
