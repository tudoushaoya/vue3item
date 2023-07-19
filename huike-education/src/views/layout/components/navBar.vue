<script setup>
defineOptions({ name: 'navBar' })
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const bread = ref('')
// const props = defineProps({
//   collapsed: Boolean
// })
// 获取事件触发器
// const emit = defineEmits(['update:collapsed'])
// const changeCollapsed = () => {
//   emit('update:collapsed', !props.collapsed) // 触发了一个事件- 传出了一个参数 子传父
//   // v-model实际上是监听了 子组件触发的事件  update:modelValue
// }
const breadTransition = ref(true)
// watch(bread, () => {
//   breadTransition.value = false
//   nextTick(() => {
//     breadTransition.value = true
//   })
// })
watch(route, (to) => {
  console.log(to)
  bread.value = to.meta.title
  breadTransition.value = false
  setTimeout(() => {
    breadTransition.value = true
  }, 300)
})
</script>
<template>
  <!-- <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">promotion management</a></el-breadcrumb-item>
  </el-breadcrumb> -->
  <!-- 点击图标时出发 -->
  <div class="boxer">
    <!-- <div @click="changeCollapsed" class="icon">
      <el-icon v-if="props.collapsed" size="20" font-weight="normal"><Fold /></el-icon>
      <el-icon v-else><Expand /></el-icon>
    </div> -->
    <transition name="fade" mode="out-in" appear>
      <div v-if="breadTransition" class="breadcrumb" :key="bread">
        <!-- 面包屑的内容 -->
        <el-breadcrumb separator="/" style="margin-left: 10px; line-height: 20px">
          <el-breadcrumb-item :to="{ path: '/home' }"
            ><span style="font-weight: 400; color: #aeb5c4">首页</span></el-breadcrumb-item
          >
          <el-breadcrumb-item class="breadto"
            ><span style="color: #05cc95">{{ bread }}</span></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  margin-top: 20px;
  display: flex;
  font-weight: normal;
}
:deep(.breadto) {
  color: #05cc95 !important;
}
.breadcrumb {
  display: flex;
  margin-top: 20px;
}
.boxer {
  display: flex;
}
.fade-enter-active,
.fade-leave-active {
  transition: transform 200ms, opacity 200ms;
}

.fade-enter,
.fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
