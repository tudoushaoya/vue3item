<script setup>
defineOptions({ name: 'monthCardPage' })
import { ref, onMounted } from 'vue'
import { getList, getRate, deleteCard } from '@/api/card.js'
import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
const router = useRouter()
// table 表头信息
const columns = [
  {
    title: '序号',
    dataIndex: 'id'
  },
  {
    title: '车主姓名',
    dataIndex: 'personName'
  },
  {
    title: '联系方式',
    dataIndex: 'phoneNumber'
  },
  {
    title: '车牌号码',
    dataIndex: 'carNumber'
  },
  {
    title: '车辆品牌',
    dataIndex: 'carBrand'
  },
  {
    title: '剩余有效天数',
    dataIndex: 'totalEffectiveDate'
  },
  {
    title: '状态',
    dataIndex: 'cardStatus'
  },
  {
    title: '操作',
    dataIndex: 'action'
  }
]
// 获取表格数据
const list = ref([])

// 定义表格的页数和每页显示的条数
const params = ref({
  page: 1,
  pageSize: 10,
  id: null,
  personName: '',
  carNumber: '',
  cardStatus: null
})

// 获取表格数据
const newList = async () => {
  const {
    data: { rows, total }
  } = await getList(params.value)

  list.value = rows
  totals.value = total
}
const totals = ref([0])
// 分页旁边显示总条数
const showTotal = () => {
  return `共${totals.value}条`
}
// 点击模糊搜索
const look = async () => {
  const res = await getList({
    page: 1,
    pageSize: totals.value
  })
  console.log(res)
  newList()
  params.value.personName = ''
  params.value.carNumber = ''
  params.value.cardStatus = null
}

const rate = ref({
  cardCount: 0,
  proportion: 0,
  spaceNumber: 0
})
// 获取月卡占有率
const newGetRate = async () => {
  const {
    data: { cardCount, proportion, spaceNumber }
  } = await getRate()
  rate.value.cardCount = cardCount
  rate.value.proportion = proportion
  rate.value.spaceNumber = spaceNumber
}

const ids = ref([])
// 全选反选
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    ids.value = selectedRowKeys.join(',')
    console.log(ids.value)
  }
}
// 批量删除
const selectAll = () => {
  console.log(rowSelection.selectedRowKeys)
  Modal.confirm({
    title: '是否确认删除当前选中的一体杆?',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      const res = await deleteCard(ids.value)
      console.log(res)
      message.success('删除成功')
      newList()
    },
    onCancel() {
      console.log('Cancel')
    }
  })
}
// 删除
const del = async (id) => {
  await deleteCard(id)
  message.success('删除成功')
  newList()
}
// 添加月卡
const addCard = () => {
  router.push({
    path: '/car/card'
  })
}

// 续费
const renew = (value) => {
  router.push({
    path: `/car/renewMonthCard/${value.id}`
  })
}
// 查看
const looks = (id) => {
  console.log(id)
  router.push({
    path: `/car/viewMonthCard/${id}`
  })
}
// 编辑
const edit = (id) => {
  router.push({
    path: `/car/editMonthCard/${id}`
  })
}
onMounted(() => {
  newList(), newGetRate()
})
</script>
<template>
  <div class="app-container">
    <!-- 输入框 -->
    <a-layout>
      <a-layout-header>
        <a-space :size="50">
          <a-form-item label="车牌号码">
            <a-input v-model:value="params.carNumber" placeholder="请输入车牌号码" size="large" />
          </a-form-item>
          <a-form-item label="车主姓名">
            <a-input v-model:value="params.personName" placeholder="请输入车主姓名" size="large" />
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              v-model:value="params.cardStatus"
              size="large"
              style="width: 208px"
              placeholder="未选择"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="0">可用</a-select-option>
              <a-select-option value="1">已过期</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="look" size="large">查询</a-button>
          </a-form-item>
        </a-space>
      </a-layout-header>
    </a-layout>

    <div class="btn-box">
      <a-space>
        <!-- 按钮 -->
        <a-button type="primary" size="middle" @click="addCard">添加月卡</a-button>
        <a-button type="primary" size="middle" @click="selectAll">批量删除</a-button>
      </a-space>
      <!-- 警告框 -->
      <a-alert
        :message="`本园区共计 ${rate.cardCount} 个车位，月卡用户 ${rate.spaceNumber} 人，车位占有率 ${rate.proportion}`"
        banner
      />
    </div>
    <a-table
      rowKey="id"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="list"
      :pagination="{
        current: params.page,
        pageSize: params.pageSize,
        total: totals,
        'show-total': showTotal,
        onChange: onChangePage,
        showSizeChanger: true, // 显示可改变每页数量
        showQuickJumper: true // 显示快速跳转
      }"
    >
      <!-- 表单数据操作 -->
      <template #bodyCell="{ column, record }">
        <!--运行状态  -->
        <template v-if="column.dataIndex === 'cardStatus'">
          {{ record.cardStatus === 0 ? '可用' : ' 已过期' }}
        </template>
        <!-- index排序 -->
        <template v-if="column.dataIndex === 'id'">
          {{ list.indexOf(record) + 1 + (params.page - 1) * params.pageSize }}
        </template>
        <!-- 操作按钮 -->
        <template v-if="column.dataIndex === 'action'">
          <a-space>
            <a-button
              style="border: none !important ; color: #4770ff"
              type="text"
              @click="renew(record)"
            >
              续费 </a-button
            ><a-button
              style="border: none !important ; color: #4770ff"
              type="text"
              @click="looks(record.id)"
              >查看</a-button
            >
            <a-button
              style="border: none !important; color: #4770ff"
              type="text"
              @click="edit(record.id)"
              >编辑</a-button
            >
            <a-button
              style="border: none !important ; color: #4770ff"
              type="text"
              @click="del(record.id)"
              >删除</a-button
            >
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style lang="less" scoped>
.app-container {
  padding: 20px;
  .ant-layout-header {
    height: 80px !important;
    background: #fff !important;
    border-bottom: 1px solid #e8e8e8 !important;
    padding-left: 0px !important;
  }
}
.btn-box {
  display: flex;
  justify-content: space-between;
  margin: 18px 0;
}
</style>
