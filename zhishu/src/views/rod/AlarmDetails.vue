<script setup>
import { useRouter, useRoute } from 'vue-router'
import { getAlarm } from '@/api/records.js'
import { onMounted, ref } from 'vue'
const router = useRouter()
const route = useRoute()
const detailParams = ref({})
// const DisposalStatus(handleStatus) {
//     switch(handleStatus) {
//         case 0:
//             return '未派单';
//         case 1:
//             return '已派单';
//         case 2:
//             return '已接单';
//         case 3:
//             return '已完成';
//     }
// }
const DisposalStatus = (handleStatus) => {
  switch (handleStatus) {
    case 0:
      return '未派单'
    case 1:
      return '已派单'
    case 2:
      return '已接单'
    case 3:
      return '已完成'
  }
}
defineOptions({ name: 'alarmDetailsPage' })
const goBack = () => {
  router.go(-1)
}
const getAlarmAPI = async () => {
  const res = await getAlarm(route.params.id)
  console.log(res)
  detailParams.value = res.data
  console.log(detailParams.value.handleStatus)
}
onMounted(() => {
  getAlarmAPI()
})
</script>
<template>
  <div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240); background-color: #fff"
      title="返回"
      sub-title="| 告警详情"
      @back="goBack"
    >
      <template #extra>
        <h3>黑马程序员</h3>
      </template>
    </a-page-header>

    <a-card title="告警详情" style="width: 1100px; margin: 20px auto" bordered="false">
      <a-row type="flex">
        <a-col flex="auto">告警时间:&emsp;{{ detailParams.warningTime }}</a-col>
        <a-col flex="auto">一体杆名称:&emsp;{{ detailParams.poleName }}</a-col>
      </a-row>
      <a-row type="flex" style="margin: 30px auto">
        <a-col flex="auto">告警区域:&emsp;{{ detailParams.areaName }}</a-col>
        <a-col flex="auto">一体杆编号:&emsp;{{ detailParams.poleNumber }}</a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="auto">故障类型:&emsp;{{ detailParams.errorType }}</a-col>
        <a-col flex="auto">处置状态:&emsp;{{ DisposalStatus(detailParams.handleStatus) }}</a-col>
      </a-row>
    </a-card>
    <br />
    <a-card title="告警记录" style="width: 1100px; margin: 0 auto">
      <a-row type="flex" style="margin-bottom: 30px">
        <a-col flex="auto">处理人:&emsp;{{ detailParams.handleUser }}</a-col>
        <a-col flex="auto">联系人:&emsp;{{ detailParams.phonenumber }}</a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="auto">处理结果:&emsp;{{ detailParams.handleResult }}</a-col>
        <a-col flex="auto">完成时间:&emsp;{{ detailParams.handleTime }}</a-col>
      </a-row>
    </a-card>
  </div>
</template>
<style>
body {
  background-color: #f3f6f8;
}
</style>
