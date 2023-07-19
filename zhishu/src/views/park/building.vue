<script setup>
import { getBuilding, delBuilding } from '@/api/building.js'
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import AddBuilding from './components/add-building.vue'

defineOptions({ name: 'buildingPage' })
//定义数据
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: '楼宇名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '层数',
    dataIndex: 'floors',
    key: 'floors'
  },
  {
    title: '在管面积(m²)',
    dataIndex: 'area',
    key: 'area'
  },
  {
    title: '物业费(m²)',
    dataIndex: 'propertyFeePrice',
    key: 'propertyFeePrice'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate'
  }
]
const search = ref('')
const inquire = async () => {
  // const res = await getBuilding({
  //   page: '1',
  //   pageSize: '10',
  //   name: chaxun.value
  // })
  params.value.name = search.value
  getBuildingAPI()
}
const list = ref([])
// const addBuilRef = ref(null)
// const currentId = ref(null)//定义传值的id
const showDialog = ref(false)
// const currentId = ref(null) //定义传值的id
// const inquire = ref('') //查询
// 搜索功能
// const search = async () => {
//   const res = await getBuilding({})
//   list.value = res.data.rows
//   console.log(list.value)
//   getBuildingAPI()
// }
const params = ref({
  name: '',
  page: '1',
  pageSize: '1000'
})
//切换页面的方法
// const handlePageChange = (page, pageSize) => {
//   //更新分页的值
//   fenye.value = {
//     page: page.toString(),
//     pageSize: pageSize.toString()
//   }
//   //调用列表重新刷新页面
//   getBuildingAPI()
// }
const getBuildingAPI = async () => {
  // list.value = await getBuilding()
  const res = await getBuilding(params.value)
  console.log(res)
  list.value = res.data.rows
  list.value.forEach((item, index) => {
    item.index = index + 1
  })
  //将每个对象赋值给list
}

//删除楼宇
const delBuildingAPI = async (id) => {
  await delBuilding(id)
  message.success('删除成功')
  getBuildingAPI()
}
//编辑
const Editor = ref([])
const editBuil = async (id) => {
  showDialog.value = true
  list.value.forEach((item) => {
    if (item.id === id) {
      Editor.value = item
      console.log(Editor)
    }
  })
  // 添加

  // currentId.value = id
  // console.log(id)
  // const res = await getBuilDetailById(id)
  // bianjiList.value = res.data
  // console.log(bianjiList.value)
}
//添加
const add = () => {
  Editor.value = {}
  showDialog.value = true
}
onMounted(() => {
  //首次渲染
  getBuildingAPI()
})
</script>
<template>
  <a-card style="margin: 20px">
    <a-form>
      <a-form-item label="楼宇名称:">
        <a-space>
          <a-input
            style="width: 300px"
            placeholder="请输入楼宇名称"
            v-model:value="search"
          ></a-input>
          <a-button type="primary" @click="inquire">查询</a-button>
        </a-space>
      </a-form-item>
      <a-divider />
      <a-form-item>
        <a-button type="primary" @click="add">添加楼宇</a-button>
      </a-form-item>
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
        <!-- 判断是不是操作列 -->
        <template v-if="column.dataIndex === 'operate'">
          <a-space>
            <a-button type="link" @click="editBuil(record.id)">编辑</a-button>
            <a-popconfirm
              title="确认删除?"
              @confirm="delBuildingAPI(record.id)"
              :disabled="record.status === 1 ? true : false"
            >
              <a-button type="link" :disabled="record.status === 1 ? true : false">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'status'">
          {{ record.status === 0 ? '空置中' : '租赁中' }}
        </template>
      </template>
    </a-table>
    <!-- <a-pagination
      style="margin-top: 10px"
      :current="fenye.page"
      :total="100"
      :page-size="fenye.pageSize"
      @change="handlePageChange"
    ></a-pagination> -->
  </a-card>
  <add-building
    v-model:showDialog="showDialog"
    @addSucces="getBuildingAPI"
    :Editor="Editor"
  ></add-building>
</template>

<style></style>
