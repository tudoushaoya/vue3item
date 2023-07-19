<script setup>
import { getRecords, delRecords } from '@/api/records.js'
import { Modal } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
defineOptions({ name: 'warnListPage' })
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: '一体杆名称',
    dataIndex: 'poleName',
    key: 'poleName'
  },
  {
    title: '一体杆编号',
    dataIndex: 'poleNumber',
    key: 'poleNumber'
  },
  {
    title: '故障类型',
    dataIndex: 'errorType',
    key: 'errorType'
  },
  {
    title: '处置状态',
    dataIndex: 'handleStatus',
    key: 'handleStatus'
  },
  {
    title: '告警时间',
    dataIndex: 'warningTime',
    key: 'warningTime'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate'
  }
]
const list = ref([])
// const inquireRef = ref('')
// const currentId = ref(null)
const formData = ref({
  page: '1',
  pageSize: '10',
  poleName: '', //名称
  poleNumber: '', //编号
  handleStatus: null //状态
})
const params = ref({
  page: '1',
  pageSize: '10',
  poleName: '', //名称
  poleNumber: '', //编号
  handleStatus: '' //状态
})
//获取告警记录列表
const Giveanalarm = async () => {
  const res = await getRecords(params.value)
  console.log(res)
  list.value = res.data.rows
  list.value.forEach((item, index) => {
    item.index = index + 1
  })
}
//删除告警记录
const showConfirm = async (id) => {
  Modal.confirm({
    title: '是否确认删除当前告警记录?',
    cancelText: '取消',
    okText: '确认',
    async onOk() {
      await delRecords(id)
      Giveanalarm()
    },
    onCancel() {
      console.log('Cancel')
    }
  })
}
// const inquire = async () => {
//   params.value.poleName = inquireRef.value
//   params.value.poleNumber = inquireRef.value
//   params.value.handleStatus = inquireRef.value
//   gaojingAPI()
// }
const inquire = async () => {
  params.value.poleName = formData.value.poleName
  params.value.poleNumber = formData.value.poleNumber
  console.log(params.value.poleNumber)
  params.value.handleStatus = formData.value.handleStatus
  console.log(params.value.handleStatus)
  if (params.value.handleStatus === 5) {
    delete params.value.handleStatus
  }
  Giveanalarm()
}
// const delGaojing = async (id) => {
//   console.log(1111)
//   console.log(id)
//   await delRecords(id)
//   message.success('删除成功')
//   gaojingAPI()
// }

onMounted(() => {
  //首次渲染

  Giveanalarm()
})
</script>
<template>
  <div class="app-container">
    <a-card>
      <a-form style="display: flex">
        <a-space>
          <a-form-item label="一体杆名称:">
            <a-input placeholder="请输入一体杆名称" v-model:value="formData.poleName"></a-input>
          </a-form-item>
          <a-form-item label="一体杆编号:">
            <a-input placeholder="请输入一体杆编号" v-model:value="formData.poleNumber"></a-input>
          </a-form-item>
          <a-form-item label="处置状态:">
            <a-select
              style="width: 200px"
              placeholder="请选择处置状态"
              v-model:value="formData.handleStatus"
            >
              <a-select-option :value="5">全部</a-select-option>
              <a-select-option :value="0">未派单</a-select-option>
              <a-select-option :value="1">已派单</a-select-option>
              <a-select-option :value="2">以接单</a-select-option>
              <a-select-option :value="3">已完成</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="inquire">查询</a-button>
          </a-form-item>
        </a-space>
      </a-form>
      <a-table
        :dataSource="list"
        :columns="columns"
        :pagination="{
          total: list.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共${total}条`
        }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'handleStatus'">
            <a-span v-if="record.handleStatus === 0">未派单</a-span>
            <a-span v-if="record.handleStatus === 1">已派单</a-span>
            <a-span v-if="record.handleStatus === 2">已接单</a-span>
            <a-span v-if="record.handleStatus === 3">已完成</a-span>
          </template>
          <!-- 判断是不是操作列 -->
          <template v-if="column.dataIndex === 'operate'">
            <a-space>
              <a-button type="link" :disabled="record.handleStatus === 0 ? false : true"
                >派单</a-button
              >
              <a-button type="link" @click="router.push(`/warn/detail/${record.id}`)"
                >详情</a-button
              >
              <a-button
                type="link"
                :disabled="record.handleStatus === 3 ? false : true"
                @click="showConfirm(record.id)"
                >删除</a-button
              >
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style></style>
