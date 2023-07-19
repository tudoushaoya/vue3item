<script setup>
import { ref, onMounted } from 'vue'
import {
  getEnterpriseList,
  getEnterpriseExpandList,
  deleteEnterprise,
  quitRent,
  deleteContract
} from '@/api/enterprise'
import { Modal } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import addDialog from './components/add-dialog.vue'
defineOptions({ name: 'enterprisePage' })
const params = ref({
  name: '',
  page: 1,
  pageSize: 5
})
const totalCount = ref(0)
const value1 = ref('') //搜索框
// 企业列表
const enterpriseRows = ref([])
// 企业子列表
const enterpriseChildRows = ref([])
const loading = ref(true)
// 表格列
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 100
  },
  {
    title: '企业名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true
  },
  {
    title: '联系人',
    dataIndex: 'contact',
    key: 'contact',
    width: 200
  },
  {
    title: '联系人电话',
    dataIndex: 'contactNumber',
    key: 'contactNumber',
    width: 200
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate'
  }
]
// 嵌套表格列
const innerColumns = [
  {
    title: '租赁楼宇',
    dataIndex: 'buildingName',
    key: 'buildingName'
  },
  {
    title: '租赁起止时间',
    dataIndex: 'startTime',
    key: 'startTime'
  },
  {
    title: '合同状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '操作',
    dataIndex: 'active',
    key: 'active'
  }
]
// 添加合同弹窗
const showDialog = ref(false)
//控制添加或编辑
const isEdit = ref(false)
// 获取企业列表
const getEnterpriseListData = async () => {
  const res = await getEnterpriseList(params.value)
  enterpriseRows.value = res.data.rows
  totalCount.value = res.data.total
  loading.value = false
}

//搜索
const search = () => {
  params.value.name = value1.value.trim()
  getEnterpriseListData()
}
const currentId = ref(null) //定义当前编辑的用户id
// 展开行事件
const handleExpand = async (expanded, record) => {
  currentId.value = record.id
  const res = await getEnterpriseExpandList(record.id)
  enterpriseChildRows.value = res.data
  enterpriseRows.value.forEach((item) => {
    if (item.id === record.id) {
      item.child = enterpriseChildRows.value
    }
  })
}
//展开行变化
const handleExpandChange = async () => {
  const res = await getEnterpriseExpandList(currentId.value)
  const newChildRows = res.data

  enterpriseRows.value.forEach((item) => {
    if (item.id === currentId.value.id) {
      item.child = newChildRows
    }
  })
}
// 分页
const changePage = (page, pageSize) => {
  params.value.page = page
  params.value.pageSize = pageSize
  loading.value = true
  getEnterpriseListData()
}
// 页码总数
const showTotal = () => {
  return `共${totalCount.value}条`
}

//删除企业
const showConfirm = (id) => {
  Modal.confirm({
    title: '是否确认删除当前企业?',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      const res = await deleteEnterprise(id)
      if (res.code === 50000) message.error(res.msg)
      if (res.code === 10000) message.success(res.msg)
      getEnterpriseListData()
    },
    onCancel() {
      // console.log('Cancel')
    }
  })
}
//退租
const retreatHome = (id) => {
  Modal.confirm({
    title: '退租不可撤回，是否确认退租当前楼宇?',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      const res = await quitRent(id)
      console.log(res)
      message.success('退租成功')
      await handleExpandChange()
    },
    onCancel() {
      console.log('Cancel')
    }
  })
}
//添加合同
const addContract = (id) => {
  currentId.value = id
  showDialog.value = true
}
// const renewData = ref(null)
//续租合同
const editRef = ref(null)
const renewContract = (record) => {
  // renewData.value = record
  editRef.value.handleEdit(record)
  showDialog.value = true
  isEdit.value = true
}
//删除合同
const retreatContract = async (id) => {
  Modal.confirm({
    title: '是否确认删除当前合同?',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      const res = await deleteContract(id)
      console.log(res)
      message.success('删除成功')
      handleExpandChange()
    },
    onCancel() {
      console.log('Cancel')
    }
  })
}
//编辑企业
const editEnterprise = (id) => {
  router.push({
    path: `/park/enterprise/add/${id}`
  })
}
//查看企业
const checkDetail = (id) => {
  router.push({
    path: `/park/enterprise/detail/${id}`
  })
}

onMounted(() => {
  getEnterpriseListData()
})
</script>
<template>
  <div class="app-container">
    <a-card :bordered="false">
      <!-- 查询 -->
      <template #title>
        <a-form layout="inline">
          <a-form-item label="企业名称">
            <a-input v-model:value="value1" placeholder="请输入企业名称" style="width: 300px" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="search">查询</a-button>
          </a-form-item>
        </a-form>
      </template>
      <a-button
        type="primary"
        style="margin-bottom: 20px"
        @click="router.push('/park/enterprise/add')"
        >添加企业</a-button
      >
      <!-- 表格 -->
      <a-spin :spinning="loading">
        <a-table
          :columns="columns"
          :dataSource="enterpriseRows"
          :row-key="(record) => record.id"
          @expand="handleExpand"
          @expandedRowsChange="handleExpandChange"
          :pagination="{
            total: totalCount,
            'show-total': showTotal,
            current: params.page,
            pageSize: params.pageSize,
            onChange: changePage,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20']
          }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'index'">
              {{ enterpriseRows.indexOf(record) + 1 + (params.page - 1) * params.pageSize }}
            </template>
            <template v-if="column.dataIndex === 'operate'">
              <a-space>
                <a-button type="link" @click="addContract(record.id)">添加合同</a-button>
                <a-button type="link" @click="checkDetail(record.id)">查看</a-button>
                <a-button type="link" @click="editEnterprise(record.id)">编辑</a-button>
                <a-button
                  type="link"
                  :disabled="record.existContractFlag === 1"
                  @click="showConfirm(record.id)"
                  >删除</a-button
                >
              </a-space>
            </template>
          </template>
          <!-- 嵌套表格 -->
          <template #expandedRowRender="{ record }">
            <a-table :columns="innerColumns" :dataSource="record.child" :pagination="false">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'active'">
                  <a-space>
                    <a-button
                      type="link"
                      :disabled="record.renewFlag === 0"
                      @click="renewContract(record)"
                      >续租</a-button
                    >
                    <a-button
                      type="link"
                      :disabled="record.exitFlag === 0"
                      @click="retreatHome(record.id)"
                      >退租</a-button
                    >
                    <a-button
                      type="link"
                      :disabled="record.exitFlag === 1"
                      @click="retreatContract(record.id)"
                      >删除</a-button
                    >
                  </a-space>
                </template>
                <template v-if="column.dataIndex === 'startTime'">
                  {{ record.startTime + '至' + record.endTime }}
                </template>
                <template v-if="column.dataIndex === 'status'">
                  <a-tag v-if="record.status === 0" color="green">待生效</a-tag>
                  <a-tag v-if="record.status === 1" color="pink">生效中</a-tag>
                  <a-tag v-if="record.status === 2" color="red">已到期</a-tag>
                  <a-tag v-if="record.status === 3" color="default">已退租</a-tag>
                </template>
              </template>
            </a-table>
          </template>
        </a-table>
      </a-spin>
    </a-card>
    <!-- 添加合同 -->
    <add-dialog
      :currentId="currentId"
      v-model:showDialog="showDialog"
      @addSuccess="getEnterpriseListData"
      :renewData="renewData"
      :isEdit="isEdit"
      ref="editRef"
    ></add-dialog>
  </div>
</template>

<style scoped></style>
