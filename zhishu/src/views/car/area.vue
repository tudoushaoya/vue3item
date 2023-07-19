<script setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import AddUser from './components/add-user.vue'
import { ref, onMounted, createVNode } from 'vue'
import { getRegionList, deleteRegion } from '@/api/region'
defineOptions({ name: 'areaPage' })
onMounted(() => {
  getRegionAPI()
})
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: '区域名称',
    dataIndex: 'areaName',
    key: 'areaName'
  },
  {
    title: '车位数(个)',
    dataIndex: 'spaceNumber',
    key: 'spaceNumber'
  },
  {
    title: '面积(㎡)',
    dataIndex: 'areaProportion',
    key: 'areaProportion'
  },
  {
    title: '计费规则',
    dataIndex: 'ruleName',
    key: 'ruleName'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate'
  }
]

const list = ref([])
const currentId = ref(null)
// 显示添加编辑弹窗
const showDialog = ref(false)
// 发送请求参数
const params = {
  page: 1,
  pageSize: 1000
}
const loding = ref(true)
// 获取区域列表
const getRegionAPI = async () => {
  console.log(params)

  const res = await getRegionList(params)
  console.log(res)
  list.value = res.data.rows
  list.value.forEach((item, index) => {
    item.index = index + 1
  })
  if (res.data.rows.length > 0) {
    loding.value = false
  }
}
// 删除区域
const showDeleteConfirm = (id) => {
  const delRegionAPI = async () => {
    const res = await deleteRegion(id)
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
const add = () => {
  // currentId.value = null
  formitem.value = []
  showDialog.value = true
}
// 编辑区域
const formitem = ref([])
const editUser = (id) => {
  showDialog.value = true
  currentId.value = id
  // 获取每一项
  list.value.forEach((item) => {
    if (item.id === id) {
      formitem.value = item
      console.log(formitem.value)
    }
  })
}
</script>
<template>
  <div class="app-container">
    <a-button type="primary" @click="add">添加区域</a-button>
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
      <!-- , record  -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'ruleName'">
          <a-tooltip>
            <template #title>{{ record.hoverRuleName }}</template>
            {{ record.ruleName }}
          </a-tooltip>
        </template>
        <!-- 判断是不是操作列 -->
        <template v-if="column.dataIndex === 'operate'">
          <a-space>
            <a-button type="link" @click="editUser(record.id)">编辑</a-button>

            <a-button type="link" @click="showDeleteConfirm(record.id)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
  <add-user
    v-model:showDialog="showDialog"
    :formitem="formitem"
    @addSuccess="getRegionAPI"
  ></add-user>
</template>

<style>
.app-container {
  padding: 20px;
}
</style>
