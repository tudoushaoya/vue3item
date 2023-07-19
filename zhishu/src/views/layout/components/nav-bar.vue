<script setup>
import useToken from '@/stores/token.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  collapsed: Boolean
})
// 获取事件触发器
const emit = defineEmits(['update:collapsed'])
const changeCollapsed = () => {
  emit('update:collapsed', !props.collapsed) // 触发了一个事件- 传出了一个参数 子传父
  // v-model实际上是监听了 子组件触发的事件  update:modelValue
}

const logout = () => {
  const { removeToken } = useToken()
  removeToken() // 删除token
  router.push('/login')
}
</script>
<template>
  <!-- 点击图标时出发 -->
  <div @click="changeCollapsed">
    <MenuFoldOutlined v-if="props.collapsed" />
    <MenuFoldOutlined v-else />
  </div>
  <div class="nav-right">
    <a-button type="primary" ghost>可视化大屏</a-button>
    <a-popover placement="bottomRight" trigger="click">
      <h4 style="font-weight: bold">黑马管理员</h4>
      <template #content>
        <a-button type="text" @click="logout">退出登录</a-button>
      </template>
    </a-popover>
  </div>
</template>
<style scoped>
.nav-right {
  display: flex;
  align-items: center;
  .ant-btn {
    margin-right: 20px;
    border-radius: 5px;
  }
}
</style>
