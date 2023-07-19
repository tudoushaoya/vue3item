<script setup>
defineOptions({ name: 'managePage' })
import { ref, onMounted } from 'vue'
import { getList, itemDel } from '@/api/rod.js'
import { message, Modal } from 'ant-design-vue'
import AddEdit from './components/rod_add_edit.vue'

// table 表头信息
const columns = [
  {
    title: '序号',
    dataIndex: 'id'
  },
  {
    title: '一体杆名称',
    dataIndex: 'poleName'
  },
  {
    title: '一体杆编号',
    dataIndex: 'poleNumber'
  },
  {
    title: '安装区域',
    dataIndex: 'areaName'
  },
  {
    title: '安装区域ip',
    dataIndex: 'poleIp'
  },
  {
    title: '一体杆类型',
    dataIndex: 'poleType'
  },
  {
    title: '运行状态',
    dataIndex: 'poleStatus'
  },
  {
    title: '操作',
    dataIndex: 'action'
  }
]

// 获取表格数据
const list = ref([])
// 获取表格的页数和每页显示的条数

const params = ref({
  page: 1,
  pageSize: 10,
  poleName: '',
  poleNumber: '',
  poleStatus: null
})
// 获取表格的总条数
const totals = ref([0])

// 请求表单数据
const newList = async () => {
  const {
    data: { rows, total }
  } = await getList(params.value)
  list.value = rows
  totals.value = total
}

// 点击模糊搜索
const look = async () => {
  await getList({
    page: 1,
    pageSize: totals.value
  })
  // rows.filter((item) => {
  //   return item.poleName.includes(params.value.poleName.trim())
  // })
  newList()
  params.value.poleName = ''
  params.value.poleNumber = ''
  params.value.poleStatus = null
}
// 分页旁边显示总条数
const showTotal = () => {
  return `共${totals.value}条`
}
// 分页
const onChangePage = (page, pageSize) => {
  params.value.page = page
  params.value.pageSize = pageSize
  newList()
}
// 删除
const del = (id) => {
  console.log(id)
  Modal.confirm({
    title: '是否确认删除当前选中的一体杆?',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      const res = await itemDel(id)
      console.log(res)
      message.success('删除成功')
      newList()
    },
    onCancel() {
      console.log('Cancel')
    }
  })
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
      const res = await itemDel(ids.value)
      console.log(res)
      message.success('删除成功')
      newList()
    },
    onCancel() {
      console.log('Cancel')
    }
  })
}

// 控制添加的弹窗
const visible = ref(false)
// 子传父调用接口重新渲染列表
const add = () => {
  newList()
}
// 重置表单
const reset = () => {
  current.value = {}
  visible.value = true
}
const current = ref({})
// 编辑
const edit = (obj) => {
  visible.value = true
  current.value = obj
}

onMounted(() => {
  newList()
})
</script>
<template>
  <div class="app-container">
    <!-- 输入框 -->
    <a-layout>
      <a-layout-header>
        <a-space :size="50">
          <a-form-item label="一体杆名称">
            <a-input placeholder="请输入一体杆名称" size="large" v-model:value="params.poleName" />
          </a-form-item>
          <a-form-item label="描一体杆编号">
            <a-input
              v-model="description"
              placeholder="请输入一体杆编号"
              size="large"
              v-model:value="params.poleNumber"
            />
          </a-form-item>
          <a-form-item label="请选择运行状态">
            <a-select
              v-model:value="params.poleStatus"
              size="large"
              style="width: 208px"
              placeholder="请选择运行状态"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="0">正常</a-select-option>
              <a-select-option value="1">异常</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="look" size="large">查询</a-button>
          </a-form-item>
        </a-space>
      </a-layout-header>
    </a-layout>

    <!-- 添加与删除按钮 -->
    <a-space :size="50" class="btn">
      <a-button type="primary" size="large" @click="reset">添加一体杆</a-button>

      <a-button size="large" @click="selectAll">批量删除</a-button>
    </a-space>
    <!-- 表格 -->
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
        <!--一体杆类型  -->
        <template v-if="column.dataIndex === 'poleType'">
          {{ record.poleType === 'export' ? '出口' : '入口' }}
        </template>
        <!--运行状态  -->
        <template v-if="column.dataIndex === 'poleStatus'">
          {{ record.poleStatus === 1 ? '异常' : ' 正常' }}
        </template>
        <!-- index排序 -->
        <template v-if="column.dataIndex === 'id'">
          {{ list.indexOf(record) + 1 + (params.page - 1) * params.pageSize }}
        </template>
        <!-- 操作按钮 -->
        <template v-if="column.dataIndex === 'action'">
          <a-space>
            <a-button style="border: none !important" type="primary" @click="edit(record)"
              >编辑</a-button
            >
            <a-button style="border: none !important" type="primary" @click="del(record.id)"
              >删除</a-button
            >
          </a-space>
        </template>
      </template>
    </a-table>
    <AddEdit :list="list" v-model:visible="visible" @add="add" :current="current"></AddEdit>
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
  .btn {
    margin: 20px 0px;
  }
}
</style>
