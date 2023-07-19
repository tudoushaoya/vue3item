<script setup>
import { ref, onMounted } from 'vue'
defineOptions({ name: 'coursePage' })
import { ElMessage } from 'element-plus'
import AddEdit from './add-edit.vue'
import { getCourseList, deleteCourse, getCourse } from '@/api/course'
const dialogFormVisible = ref(false)
const resForm = ref(null)
const total = ref(0)
const res = async () => {
  await resForm.value?.resetFields()
  getCourseListAPI()
}
const searchForm = ref({
  code: '',
  name: '',
  applicablePerson: null,
  createTime: null,
  subject: null
})
const search = async () => {
  searchForm.value.page = 1
  searchForm.value.pageSize = 10
  delete searchForm.value.info
  if (searchForm.value.name === '') {
    delete searchForm.value.name
  }
  if (searchForm.value.code === '') {
    delete searchForm.value.code
  }
  const res = await getCourseList(searchForm.value)
  await resForm.value?.resetFields()
  courseList.value = res.data.records
  total.value = res.data.total
}
const courseList = ref([])
const params = ref({
  page: 1,
  pageSize: 10
})
const delParams = ref({
  id: null
})
const getCourseListAPI = async () => {
  const res = await getCourseList(params.value)
  courseList.value = res.data.records
  total.value = res.data.total
  courseList.value.forEach((item) => {
    item.createTime = item.createTime.replace('T', ' ')
  })
}
const dialogDel = ref(false)
const dialogCode = ref(null)
const del = (id, code) => {
  dialogDel.value = true
  dialogCode.value = code
  delParams.value.id = id
}
const delConfirm = async () => {
  await deleteCourse(delParams.value)
  dialogDel.value = false
  ElMessage({
    showClose: true,
    message: '删除成功',
    type: 'success'
  })
  getCourseListAPI()
}
const formAdd = ref({
  applicablePerson: null,
  info: '',
  name: '',
  price: null,
  subject: null,
  createTime: null
})
const headerRowStyle = {
  backgroundColor: '#e6f0ec',
  fontSize: '13px',
  color: '#666666',
  textAlign: 'center'
}
const cellStyle = {
  fontSize: '13px',
  color: '#333333',
  textAlign: 'center'
}
const isAdd = ref(false)
const getCourseAPI = async (id) => {
  const {
    data: { data }
  } = await getCourse(id)
  formAdd.value.applicablePerson = +data.applicablePerson
  formAdd.value.info = data.info
  formAdd.value.name = data.name
  formAdd.value.price = data.price
  formAdd.value.subject = +data.subject
  formAdd.value.id = data.id
}
const edit = (id) => {
  dialogFormVisible.value = true
  isAdd.value = false
  getCourseAPI(id)
}
const add = () => {
  dialogFormVisible.value = true
  isAdd.value = true
}
const handleSizeChange = (val) => {
  params.value.pageSize = val
  getCourseListAPI()
}
const handleCurrentChange = (val) => {
  params.value.page = val
  getCourseListAPI()
}
const delAllParams = ref({
  id: null
})
const delTotal = ref(0)
const handleSelectionChange = (val) => {
  delAllParams.value.id = val.map((item) => item.id)
  delTotal.value = delAllParams.value.id.length
}
const dialogDelAll = ref(false)
const delAllList = ref({
  id: []
})
const delAllConfirm = async () => {
  dialogDelAll.value = false
  delAllList.value.id = delAllParams.value.id.join(',')
  await deleteCourse(delAllList.value)
  ElMessage({
    showClose: true,
    message: '删除成功',
    type: 'success'
  })
  getCourseListAPI()
}
const delAll = () => {
  if (delTotal.value === 0) {
    ElMessage({
      showClose: true,
      message: '请选择要删除的课程',
      type: 'warning'
    })
    return
  }
  dialogDelAll.value = true
}
onMounted(() => {
  getCourseListAPI()
})
</script>
<template>
  <el-card class="box-card" shadow="never">
    <template #header> 高级搜索 </template>
    <el-form label-width="120px" ref="resForm" :inline="true" width="100%" :model="searchForm">
      <div style="display: flex; justify-content: space-between">
        <el-form-item label="课程编号：" prop="code">
          <el-input
            placeholder="请输入课程编号"
            class="inputWidth"
            v-model="searchForm.code"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程名称：" prop="name">
          <el-input
            placeholder="请输入课程名称"
            class="inputWidth"
            v-model="searchForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="适应人群：" prop="applicablePerson">
          <el-select
            placeholder="请选择适应人群"
            class="inputWidth"
            v-model="searchForm.applicablePerson"
          >
            <el-option :value="1" label="小白学院" />
            <el-option :value="2" label="中级程序员" />
          </el-select>
        </el-form-item>
      </div>
      <div style="display: flex">
        <el-form-item label="创建时间：" prop="createTime">
          <el-date-picker
            v-model="searchForm.createTime"
            type="date"
            style="width: 15vw"
            placeholder="请选择日期"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="课程学科：" prop="subject">
          <el-select placeholder="请输入" class="inputWidth" v-model="searchForm.subject">
            <el-option :value="1" label="Java" />
            <el-option :value="2" label="前端" />
            <el-option :value="3" label="人工智能" />
            <el-option :value="4" label="大数据" />
            <el-option :value="5" label="Python" />
            <el-option :value="6" label="测试" />
            <el-option :value="7" label="新媒体" />
            <el-option :value="8" label="产品经理" />
            <el-option :value="9" label="UI设计" />
          </el-select>
        </el-form-item>
      </div>
      <div style="width: 100%; display: flex; justify-content: end">
        <el-form-item>
          <el-button size="large" @click="res">重置</el-button>
          <el-button type="primary" size="large" @click="search">搜索</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-card>
  <div style="display: flex; justify-content: space-between">
    <el-button type="primary" @click="add" style="margin: 20px 0">+ 添加课程</el-button>
    <el-button type="primary" @click="delAll" style="margin: 20px 0">+ 批量删除</el-button>
  </div>
  <el-table
    ref="multipleTableRef"
    :data="courseList"
    style="width: 100%"
    :header-cell-style="headerRowStyle"
    :cell-style="cellStyle"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column property="code" label="课程编号" />
    <el-table-column property="subject" label="课程学科">
      <template #default="scope">
        <span v-if="scope.row.subject === '1'">Java</span>
        <span v-if="scope.row.subject === '2'">前端</span>
        <span v-if="scope.row.subject === '3'">人工智能</span>
        <span v-if="scope.row.subject === '4'">大数据</span>
        <span v-if="scope.row.subject === '5'">Python</span>
        <span v-if="scope.row.subject === '6'">测试</span>
        <span v-if="scope.row.subject === '7'">新媒体</span>
        <span v-if="scope.row.subject === '8'">产品经理</span>
        <span v-if="scope.row.subject === '9'">UI设计</span>
      </template>
    </el-table-column>
    <el-table-column property="name" label="课程名称" />
    <el-table-column property="price" label="价格（元）" />
    <el-table-column property="applicablePerson" label="适应人群">
      <template #default="scope">
        <span v-if="scope.row.applicablePerson === '1'">小白学员</span>
        <span v-if="scope.row.applicablePerson === '2'">中级程序员</span>
      </template>
    </el-table-column>
    <el-table-column property="info" label="课程介绍" />
    <el-table-column property="createTime" label="创建时间" sortable width="170" />
    <el-table-column property="address" label="操作" width="170">
      <template #default="scope">
        <el-button type="text" size="small" @click="edit(scope.row.id)">编辑</el-button>
        <el-button
          type="text"
          style="color: red"
          size="small"
          @click="del(scope.row.id, scope.row.code)"
          >删除</el-button
        >
      </template>
    </el-table-column>
    <template #empty>
      <el-empty image="https://rzzt-1317097641.cos.ap-chengdu.myqcloud.com/empty.png" />
    </template>
  </el-table>
  <div
    style="
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      font-size: 14px;
      color: #606266;
    "
  >
    <span>你已选择{{ delTotal }}条数据</span>
    <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 20, 30, 40]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog v-model="dialogDel" width="30%">
    <span>确认删除课程“{{ dialogCode }}” ？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogDel = false">返回</el-button>
        <el-button type="primary" @click="delConfirm" :plain="true"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogDelAll" width="30%">
    <span>你已选择{{ delTotal }}条数据，确认删除？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogDelAll = false">返回</el-button>
        <el-button type="primary" @click="delAllConfirm" :plain="true"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
  <add-edit
    v-model:dialogFormVisible="dialogFormVisible"
    :isAdd="isAdd"
    :formAdd="formAdd"
    @address="getCourseListAPI"
  ></add-edit>
</template>

<style lang="scss" scoped>
:deep(.el-card__header) {
  background: #f2f2f2 !important;
}
.inputWidth {
  width: 15vw;
}
</style>
