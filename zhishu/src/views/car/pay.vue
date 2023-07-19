<script setup>
import { ref, onBeforeMount } from 'vue'
import { getParkingListApi } from '../../api/car'
defineOptions({ name: 'payPage' })

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    customRender: ({ index }) => {
      return index + 1 + (pageParams.value.page - 1) * pageParams.value.pageSize
    }
  },
  {
    title: '车牌号码',
    dataIndex: 'carNumber',
    key: 'carNumber'
  },
  {
    title: '收费类型',
    dataIndex: 'chargeType',
    key: 'chargeType',
    customRender: ({ record }) => {
      return record.chargeType === 'temp' ? '临时停车' : '月卡'
    }
  },
  {
    title: '停车总时长',
    dataIndex: 'parkingTime',
    key: 'parkingTime'
  },
  {
    title: '缴纳费用',
    key: 'actualCharge',
    dataIndex: 'actualCharge'
  },
  {
    title: '缴纳状态',
    key: 'paymentStatus',
    dataIndex: 'paymentStatus',
    customRender: ({ record }) => {
      return record.paymentStatus === 1 ? '已缴纳' : '未缴纳'
    }
  },
  {
    title: '缴纳方式',
    key: 'paymentMethod',
    dataIndex: 'paymentMethod',
    customRender: ({ record }) => {
      return record.paymentMethod === 'Alipay' ? '支付宝' : '--'
    }
  },
  {
    title: '缴纳时间',
    key: 'paymentTime',
    dataIndex: 'paymentTime'
  }
]

const data = ref([])
const total = ref('')
const loading = ref(false)
const getTableData = async (params) => {
  loading.value = true
  const res = await getParkingListApi(params)
  data.value = res.data.rows
  total.value = res.data.total
  loading.value = false
}

onBeforeMount(() => {
  getTableData()
})

const searchParams = ref({
  carNumber: '',
  paymentStatus: ''
})

const pageParams = ref({
  page: 1,
  pageSize: 10
})
const options = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '已缴纳',
    value: 1
  },
  {
    label: '未缴纳',
    value: 0
  }
]

const pagination = ref({
  page: pageParams.value.page,
  pageSize: pageParams.value.pageSize,
  total,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条`,
  onChange: (page, pageSize) => {
    pageParams.value.page = page
    pageParams.value.pageSize = pageSize
    getTableData({ ...searchParams.value, ...pageParams.value })
  }
})
</script>
<template>
  <div class="app-container">
    <a-card :bordered="false">
      <template #title>
        <a-space style="font-size: 14px">
          <span>车牌号码:</span>
          <a-input
            v-model:value="searchParams.carNumber"
            placeholder="请输入车牌号码"
            style="width: 200px"
          ></a-input>

          <span style="margin-left: 18px">缴纳状态:</span>
          <a-select
            v-model:value="searchParams.paymentStatus"
            ref="select"
            style="width: 200px"
            placeholder="未选择"
            :options="options"
          >
          </a-select>
          <a-button type="primary" @click="getTableData({ ...searchParams, ...pageParams })"
            >查询</a-button
          >
        </a-space>
      </template>
      <a-table :pagination="pagination" :columns="columns" :data-source="data" :loading="loading">
      </a-table>
    </a-card>
  </div>
</template>

<style></style>
