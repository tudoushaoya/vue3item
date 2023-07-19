<script setup>
defineOptions({ name: 'propetyPage' })
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { ref, onMounted, createVNode } from 'vue'
import { getPropertyList, deleteProperty, getPropertyDetail } from '@/api/propety'
import { Modal, message } from 'ant-design-vue'
import AddEdit from './components/add-edit.vue'
import moment from 'moment'
onMounted(() => {
  getRegionAPI()
})

const value2 = ref(null) // 开始时间和结束时间

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: '账单编号',
    dataIndex: 'billNumber',
    key: 'billNumber'
  },
  {
    title: '企业名称',
    dataIndex: 'enterpriseName',
    key: 'enterpriseName'
  },
  {
    title: '租货楼宇',
    dataIndex: 'buildingName',
    key: 'buildingName'
  },
  {
    title: '物业费(元/㎡)',
    dataIndex: 'propertyFeePrice',
    key: 'propertyFeePrice'
  },
  {
    title: '账单金额(元)',
    dataIndex: 'paymentAmount',
    key: 'paymentAmount'
  },
  {
    title: '缴费时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate'
  }
]
const list = ref([])
// 显示添加编辑弹窗
const showDialog = ref(false)
// 显示查看弹窗
const isShow = ref(false)
const params = ref({
  enterpriseName: '', // 企业名称
  start: '', // 开始时间
  end: '', // 结束时间
  page: 1, // 页码
  pageSize: 1000 // 每页条数
})
const loding = ref(true)
// 获取区域列表
const getRegionAPI = async () => {
  console.log(params.value)
  const res = await getPropertyList(params.value)
  console.log(res)
  list.value = res.data.rows
  list.value.forEach((item, index) => {
    item.index = index + 1
  })

  loding.value = false
}
// 查询
// 使用moment转换时间格式
const search = () => {
  console.log(value2.value)
  if (value2.value === null) {
    delete params.value.start
    delete params.value.end
    // console.log(params)
    loding.value = true
    getRegionAPI(params.value)
  } else {
    params.value.start = moment(moment(value2.value[0].$d).toDate()).format('YYYY-MM-DD')
    params.value.end = moment(moment(value2.value[1].$d).toDate()).format('YYYY-MM-DD')
    loding.value = true
    getRegionAPI()
  }
}
const restrer = ref({})
// 查看账单
const editUser = async (id) => {
  isShow.value = true
  console.log(id)
  const res = await getPropertyDetail(id)
  console.log(res)
  restrer.value = res.data
  console.log(restrer.value)
}
const btnCancel = () => {
  // loding.value = true
  isShow.value = false
}
// 删除账单
const showDeleteConfirm = (id) => {
  const delRegionAPI = async () => {
    const res = await deleteProperty(id)
    console.log(res)
    message.success(res.msg)
    loding.value = true
    getRegionAPI()
  }
  Modal.confirm({
    title: '是否删除当前区域?',
    icon: createVNode(ExclamationCircleOutlined),
    okText: '确定',
    okType: 'primary',
    cancelText: '取消',
    onOk() {
      delRegionAPI()
    },
    onCancel() {
      console.log('Cancel')
    }
  })
}
// 添加账单
const formitem = ref([])
const add = () => {
  showDialog.value = true
}
</script>
<template>
  <div class="app-container">
    <div class="header">
      <a-form layout="inline">
        <a-form-item label="企业名称" name="enterpriseName">
          <a-input placeholder="请输入企业名称" v-model:value="params.enterpriseName" />
        </a-form-item>
        <a-form-item label="缴费时间" name="username">
          <a-space direction="vertical" :size="12">
            <a-range-picker v-model:value="value2" />
          </a-space>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-button type="primary" @click="add">添加账单</a-button>
    <div class="table">
      <a-table
        :loading="loding"
        :columns="columns"
        :dataSource="list"
        :pagination="{
          total: list.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} items`
        }"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <!-- 判断是不是操作列 -->
          <template v-if="column.dataIndex === 'operate'">
            <a-space>
              <a-button type="link" @click="editUser(record.id)">查看账单</a-button>

              <a-button type="link" @click="showDeleteConfirm(record.id)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <AddEdit :formitem="formitem" v-model:showDialog="showDialog" @addSuccess="getRegionAPI" />
  <a-modal title="查看账单" :visible="isShow" :footer="null" @cancel="btnCancel">
    <a-form :label-col="{ span: 8 }">
      <a-form-item style="text-align: center">
        <a-p style="color: #909399; font-size: 16px">租户名称:</a-p>
        <a-span style="margin-left: 5px; font-size: 16px">{{ restrer.enterpriseName }}</a-span>
      </a-form-item>
      <a-form-item style="text-align: center">
        <a-p style="color: #909399; font-size: 16px">租户楼宇:</a-p>
        <a-span style="margin-left: 5px; font-size: 16px">{{ restrer.buildingName }}</a-span>
      </a-form-item>
      <a-form-item style="text-align: center">
        <a-p style="color: #909399; font-size: 16px">缴费周期:</a-p>
        <a-span style="margin-left: 5px; font-size: 16px"
          >{{ restrer.startTime }}至{{ restrer.endTime }}</a-span
        >
      </a-form-item>
      <a-form-item style="text-align: center">
        <a-p style="color: #909399; font-size: 16px">物业费(元/m²):</a-p>
        <a-span style="margin-left: 5px; font-size: 16px">{{ restrer.propertyFeePrice }}</a-span>
      </a-form-item>
      <a-form-item style="text-align: center">
        <a-p style="color: #909399; font-size: 16px">账单金额(元):</a-p>
        <a-span style="margin-left: 5px; font-size: 16px">{{ restrer.paymentAmount }}</a-span>
      </a-form-item>
      <a-form-item style="text-align: center">
        <a-p style="color: #909399; font-size: 16px">支付方式:</a-p>
        <a-span style="margin-left: 5px; font-size: 16px">{{ restrer.paymentMethodValue }}</a-span>
      </a-form-item>
      <a-form-item style="text-align: center">
        <a-p style="color: #909399; font-size: 16px">缴费时间:</a-p>
        <a-span style="margin-left: 5px; font-size: 16px">{{ restrer.createTime }}</a-span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
.app-container {
  padding: 20px;
}
.header input {
  width: 260px !important;
}
.header {
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.table {
  margin-top: 20px;
}
</style>
