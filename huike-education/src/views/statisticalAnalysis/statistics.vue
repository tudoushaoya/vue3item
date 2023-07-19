<script setup>
import { ref } from 'vue'
import CustomerStatistics from './components/CustomerStatistics.vue'
import SalesStatistics from './components/SalesStatistics.vue'
import ClueStatistics from './components/ClueStatistics.vue'
import ChannelStatistics from './components/ChannelStatistics.vue'
defineOptions({ name: 'statisticsPage' })

const activeName = ref('first')
</script>
<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane label="客户统计" name="first">
      <CustomerStatistics />
    </el-tab-pane>
    <el-tab-pane label="销售统计" name="second">
      <SalesStatistics />
    </el-tab-pane>
    <el-tab-pane label="线索统计" name="third">
      <ClueStatistics />
    </el-tab-pane>
    <el-tab-pane label="渠道统计" name="fourth">
      <ChannelStatistics />
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped></style>
