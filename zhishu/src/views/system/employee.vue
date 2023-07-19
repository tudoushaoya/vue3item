<script setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { defineOptions, ref, onMounted, createVNode } from 'vue'
import { getEmployeeSimple, delEmployee, resetPassword } from '@/api/employee'
import { message, Modal } from 'ant-design-vue'
import AddEdits from './components/add-edits.vue'
defineOptions({ name: 'employeePage' })
onMounted(() => {
  getEmployeeList()
})
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: '员工姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '登录帐号',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '联系方式',
    dataIndex: 'phonenumber',
    key: 'phonenumber'
  },
  {
    title: '角色',
    dataIndex: 'roleName',
    key: 'roleName'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '添加时间',
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
// 用户列表请求参数
const params = ref({
  name: '',
  page: 1,
  pageSize: 1000
})
//查询input的 value
const formData = ref()
// 查询
const search = () => {
  params.value.name = formData.value
  console.log(params.value.name)
  loding.value = true
  getEmployeeList()
}
const loding = ref(true)
//获取用户列表
const getEmployeeList = async () => {
  const res = await getEmployeeSimple(params.value)
  console.log(res)
  list.value = res.data.rows
  list.value.forEach((item, index) => {
    item.index = index + 1
    item.status = item.status === 0 ? '禁用' : '启用'
  })
  if (res.data.rows.length > 0) {
    loding.value = false
  }
}
// 添加编辑弹窗
const showDialog = ref(false)
//添加
const add = () => {
  //  重置表单
  formitem.value = {}
  console.log('添加')
  showDialog.value = true
}
// 编辑
const formitem = ref([])
const editUser = (id) => {
  console.log(id)
  showDialog.value = true
  list.value.forEach((item) => {
    if (item.id === id) {
      formitem.value = item
      console.log(formitem.value)
    }
  })
  loding.value = true
}
// 删除
const showDeleteConfirm = async (id) => {
  const delRegionAPI = async () => {
    const res = await delEmployee(id)
    console.log(res)
    message.success(res.msg)
    loding.value = true
    getEmployeeList()
  }
  Modal.confirm({
    title: '是否删除当前用户?',
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
// 重置密码
const reset = (id) => {
  const delRegionAPI = async () => {
    const res = await resetPassword({ id: id })
    console.log(res)
    message.success(res.msg)
    loding.value = true
    getEmployeeList()
  }
  Modal.confirm({
    title: '确定将密码重置为“123456”？',
    icon: createVNode(ExclamationCircleOutlined),
    okText: '确定',
    okType: 'primary',
    cancelText: '取消',
    onOk() {
      delRegionAPI()
    },
    onCancel() {
      console.log('Cancel')
      delRegionAPI()
    }
  })
}
</script>
<template>
  <div class="app-container">
    <div class="header">
      <a-form layout="inline">
        <!-- name="enterpriseName" -->
        <a-form-item label="员工姓名" name="formData">
          <!-- v-model:value="params.enterpriseName" -->
          <a-input placeholder="请输入员工姓名" v-model:value="formData" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-button type="primary" @click="add">添加员工</a-button>
    <div class="table">
      <!--   -->
      <a-table
        :columns="columns"
        :dataSource="list"
        size="small"
        :loading="loding"
        :pagination="{
          total: list.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} items`
        }"
      >
        <template #bodyCell="{ column, record }">
          <!-- 判断是不是操作列 -->
          <template v-if="column.dataIndex === 'operate'">
            <a-space>
              <a-button type="link" @click="editUser(record.id)">编辑</a-button>
              <a-button type="link" @click="showDeleteConfirm(record.id)">删除</a-button>
              <a-button type="link" @click="reset(record.id)">重置密码</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <add-edits
    v-model:showDialog="showDialog"
    @addSuccess="getEmployeeList"
    :formitem="formitem"
  ></add-edits>
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
