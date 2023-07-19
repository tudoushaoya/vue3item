<script setup>
defineOptions({ name: 'businessPage' })
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const activeIndex = ref('1')
router.push('/clue/clue/default')
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
  router.push(key)
}
</script>
<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="/clue/clue/default">线索</el-menu-item>

    <el-menu-item index="/clue/clue/pool">线索池</el-menu-item>
  </el-menu>
  <div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped></style>
