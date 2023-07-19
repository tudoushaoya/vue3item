<script setup>
// 获取当前所有的路由信息
import { useRouter } from 'vue-router'
import { computed } from 'vue'
const router = useRouter()
// 得到筛选的路由信息
const filterRoutes = computed(() => router.options.routes.filter((item) => !item.hidden))
const getTitle = (item) => {
  // 拿到的item是最外层的item
  if (item.children?.length && item.children?.length === 1) {
    // 说明有子节点
    return item.meta
  }
  return item.meta
}
</script>
<template>
  <a-menu class="side-bar" mode="inline">
    <!-- a-menu-item 每个菜单项 -->
    <!-- 存在多个子节点的情况 -->
    <template v-for="item in filterRoutes" :key="item.path">
      <a-sub-menu v-if="item.children?.length > 1" :key="item.path">
        <template #icon>
          <component :is="getTitle(item).icon"></component>
        </template>
        <template #title>{{ getTitle(item).title }}</template>
        <a-menu-item v-for="child in item.children" :key="child.path">
          <router-link :to="child.path">
            <span>{{ child.meta.title }}</span>
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      <!-- 只有一个子节点的情况 -->
      <template v-else>
        <a-menu-item :key="item.path">
          <router-link :to="item.path">
            <component :is="getTitle(item).icon"></component>
            <!-- component是动态组件 通过is属性 -->
            <!-- <CarOutlined></CarOutlined> -->
            <!-- {{ getTitle(item).icon }} -->
            <span>{{ getTitle(item).title }}</span>
          </router-link>
        </a-menu-item>
      </template>
    </template>
  </a-menu>
</template>

<style scoped lang="less"></style>
