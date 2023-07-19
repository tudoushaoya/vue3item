<script setup>
defineOptions({ name: 'sideBar' })
import { useRouter } from 'vue-router'
import { computed } from 'vue'
const router = useRouter()
// console.log(router.options.routes)
const filterRoutes = computed(() => {
  return router.options.routes.filter((item) => !item.hidden)
})
</script>
<template>
  <el-menu :router="true" background-color="#2b303c" text-color="#fff" default-active="1">
    <template v-for="item in filterRoutes" :key="item.meta.id">
      <!-- 一级菜单 有children -->
      <el-sub-menu v-if="item.meta.isTitle" :index="item.meta.id">
        <template #title>
          <el-icon>
            <component :is="item.meta?.icon" />
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>

        <!-- 二级菜单 -->
        <template v-for="second in item.children" :key="second.meta.id">
          <el-sub-menu v-if="second.meta.isTitle" :index="second.meta.id">
            <template #title>
              <el-icon style="margin-left: 15px">
                <component :is="second.meta?.icon" />
              </el-icon>
              <span>{{ second.meta.title }}</span>
            </template>

            <!-- 三级菜单 -->
            <template v-for="third in second.children" :key="third.meta.id">
              <el-menu-item :index="third.path">
                <span>{{ third.meta.title }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>

          <!-- 二级菜单 无children -->
          <el-menu-item v-else :index="second.path">
            <el-icon style="margin-left: 15px">
              <component :is="second.meta?.icon" />
            </el-icon>
            <span>{{ second.meta.title }}</span>
          </el-menu-item>
        </template>
      </el-sub-menu>

      <!-- 一级菜单 无children -->
      <el-menu-item v-else :index="item.path">
        <el-icon>
          <component :is="item.meta?.icon" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style lang="scss" scoped>
.el-menu {
  width: 100%;
  height: 100%;
  border-right: none;
}
span {
  margin-left: 10px;
}
</style>
