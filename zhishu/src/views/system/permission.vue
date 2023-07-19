<script setup>
import {
  getRoleList,
  getFunctionTree,
  getRoleDetail,
  getRoleUserList,
  deleteRole
} from '@/api/role'
import { defineOptions, onMounted, ref, watch, createVNode } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
defineOptions({ name: 'permissionPage' })
const activeKey = ref('1')
const roleList = ref([])
const functionTree = ref([])
const checkedKeys = ref([])
const selectedKeys = ref([])
const total = ref()
const columns = ref([
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
    title: '登陆账号',
    dataIndex: 'userName',
    key: 'userName'
  }
])
const userData = ref([])
const params = ref({
  page: 1,
  pageSize: 10
})
const router = useRouter()
const showDeleteConfirm = (id) => {
  console.log('id', id)
  Modal.confirm({
    title: '删除后该角色下的用户权限失效，是否删除？',
    icon: createVNode(ExclamationCircleOutlined),
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      console.log('OK')
      await deleteRole(id).then((res) => {
        console.log(res)
        if (res.code === 10000) {
          message.success(res.msg)
          getRoleListAPI()
        } else {
          message.error(res.msg)
        }
      })
    },
    onCancel() {
      console.log('Cancel')
    }
  })
}
const edit = (id) => {
  console.log('id', id)
  router.push(`/system/role/edit/${id}`)
}
watch(checkedKeys, (val) => {
  console.log('checkedKeys', val)
})
const handleClick = async (menuInfo) => {
  checkedKeys.value = []
  getFunctionTreeAPI()
  const { data } = await getRoleDetail(menuInfo.key)
  const res = await getRoleUserList(menuInfo.key)
  userData.value = res.data.rows
  console.log(userData.value)
  const itemsToRemove = [
    2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014
  ]
  data.perms.forEach((item) => {
    checkedKeys.value.push(...item)
  })
  for (const item of itemsToRemove) {
    if (checkedKeys.value.includes(item)) {
      checkedKeys.value.splice(checkedKeys.value.indexOf(item), 1)
    }
  }
  total.value = data.userTotal
}
const getRoleListAPI = async () => {
  const { data } = await getRoleList()
  roleList.value = data
  selectedKeys.value = [roleList.value[0].roleId]
  handleClick({ key: roleList.value[0].roleId })
}
const fieldNames = ref({
  key: 'id'
})
const getFunctionTreeAPI = async () => {
  const { data } = await getFunctionTree()
  functionTree.value = data
}
onMounted(() => {
  getRoleListAPI()
})
</script>
<template>
  <div class="app-container box">
    <div class="box-left">
      <a-menu v-model:selectedKeys="selectedKeys" @click="handleClick">
        <a-menu-item v-for="item in roleList" :key="item.roleId">
          <span style="display: flex; justify-content: space-between; line-height: 44px">
            <a-tooltip placement="top">
              <template #title>
                <span>{{ item.remark }}</span>
              </template>
              <span>
                <TeamOutlined></TeamOutlined>&nbsp;
                {{ item.roleName }}
              </span>
            </a-tooltip>
            <a-popover placement="bottom" trigger="focus">
              <template #content>
                <p @click="edit(item.roleId)" style="cursor: pointer">编辑角色</p>
                <span style="color: red; cursor: pointer" @click="showDeleteConfirm(item.roleId)"
                  >删除</span
                >
              </template>
              <MoreOutlined style="line-height: 44px"></MoreOutlined>
            </a-popover>
          </span>
        </a-menu-item>
      </a-menu>
      <a-button size="large" style="width: 100%" @click="router.push('/system/role/add')"
        >添加角色</a-button
      >
    </div>
    <div class="box-right">
      <div>
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="功能权限">
            <a-row type="flex">
              <a-col flex="auto" v-for="item in functionTree" :key="item.id">
                <div>{{ item.title }}</div>
                <a-tree
                  checkable
                  :tree-data="item.children"
                  :key="item.id"
                  disabled
                  v-model:checked-keys="checkedKeys"
                  defaultExpandAll
                  :field-names="fieldNames"
                >
                  <template #title="{ title }">
                    <span>{{ title }}</span>
                  </template>
                </a-tree>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="'成员' + '(' + total + ')'" force-render>
            <a-table
              :dataSource="userData"
              :columns="columns"
              :pagination="{
                total: userData.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总共 ${total} 条`
              }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'index'">
                  <span>{{
                    (params.page - 1) * params.pageSize + 1 + userData.indexOf(record)
                  }}</span>
                </template>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.box {
  display: flex;
  justify-content: space-between;

  .box-left {
    width: 220px;
    height: 100%;
    background-color: #fff;
    padding: 2px;

    div {
      padding: 0 20px;
      height: 56px;
      line-height: 56px;
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      align-items: center;

      // 鼠标移上来显示小手
      &:hover {
        cursor: pointer;
      }
    }
  }

  .box-right {
    width: calc(100% - 220px);
    height: 100%;
    background-color: #fff;
    padding: 10px;
  }
}

li {
  list-style: none;
}
</style>
