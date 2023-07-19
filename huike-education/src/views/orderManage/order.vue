<script setup>
import { reactive, ref, onMounted } from 'vue'
import {
  getOrderList,
  getOrderDetail,
  getDepartments,
  getEmployees,
  assignOrder
} from '@/api/order.js'
import { transListToTree } from '@/utils/index.js'
import { ElMessage } from 'element-plus'
defineOptions({ name: 'orderPage' })
const searchFormRef = ref(null)

// 搜索表单数据
const searchForm = reactive({
  timeDate: [],
  startTime: '',
  endTime: ''
})
// 搜索表单验证规则
const searchRules = reactive({
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  timeDate: [{ required: true, message: '请选择日期', trigger: 'blur' }]
})
//参数
const params = ref({
  page: 1,
  size: 10,
  username: '',
  phone: '',
  startTime: '',
  endTime: ''
})
// 获取部门列表
const DepartmentParams = ref({
  page: 1,
  size: 10
})
// 工单表格数据
const orderForm = ref([])

//获取工单数据
const total = ref(0)
const getOrderListAPI = async () => {
  const res = await getOrderList(params.value)

  orderForm.value = res.records
  orderForm.value.forEach((item) => {
    item.createTime = item.createTime.replace('T', ' ')
  })
  total.value = res.total
}
//搜索
const searchOrder = () => {
  params.value.username = searchForm.username
  params.value.phone = searchForm.phone
  params.value.startTime = searchForm.timeDate[0]
  params.value.endTime = searchForm.timeDate[1]
  getOrderListAPI()
}
// 重置搜索表单
const reset = async () => {
  // await searchFormRef.value.resetFields()
  params.value.username = ''
  params.value.phone = ''
  params.value.startTime = ''
  params.value.endTime = ''
  getOrderListAPI()
}
//弹出框
const isShow = ref(false)

//弹框表单
const dialogForm = ref({})

//详情开关
const isDetail = ref(false)

//详情  处理
const departments = ref([])
const handleDetail = async (id, e) => {
  isShow.value = true
  const res = await getOrderDetail(id)
  console.log(res.data)
  dialogForm.value = res.data
  dialogForm.value.allotBranch = res.data.allotBranch
  dialogForm.value.allotStaff = res.data.allotStaff
  //部门
  const depparts = await getDepartments(DepartmentParams.value)
  departments.value = transListToTree(depparts.data.records, 0)

  if (e.target.innerText === '处理') {
    isDetail.value = false
  } else {
    isDetail.value = true
  }
}

//根据部门渲染人员
const employees = ref([])
const CurrentChange = async (val) => {
  const employeesAll = await getEmployees(val.deptId)
  employees.value = employeesAll.data
}

//关闭弹窗
const handleClose = () => {
  isShow.value = false
}

//分页
const handleSizeChange = (val) => {
  params.value.size = val
  getOrderListAPI()
}
const handleCurrentChange = (val) => {
  params.value.page = val
  getOrderListAPI()
}

//计算序号
const getIndex = (index) => {
  return (params.value.page - 1) * params.value.size + index + 1
}
const handleColor = {
  backgroundColor: '#f5f7fa'
}

//取消
const dialogFormRef = ref(null)
const btnCancel = () => {
  dialogFormRef.value.resetFields()
  isShow.value = false
}
// 确认
const btnConfirm = async () => {
  delete dialogForm.value.updateTime
  delete dialogForm.value.createTime
  const res = await assignOrder(dialogForm.value)
  console.log(res)
  // dialogForm.value = res.data
  ElMessage({
    message: '操作成功',
    type: 'success'
  })
  isShow.value = false
}
onMounted(() => {
  getOrderListAPI()
})
</script>
<template>
  <el-card>
    <template #header>
      <span>高级搜索</span>
    </template>
    <el-form :model="searchForm" :rules="searchRules" ref="searchFormRef">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="searchForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="searchForm.username" placeholder="请输入用户名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建日期" prop="timeDate">
            <el-date-picker
              clearable
              v-model="searchForm.timeDate"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex; justify-content: end">
        <el-form-item>
          <el-button @click="reset"> 重置 </el-button>
          <el-button type="primary" @click="searchOrder"> 搜索 </el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-card>
  <el-table :data="orderForm" style="width: 100%" :header-cell-style="handleColor">
    <template #empty v-if="!orderForm.length">
      <el-empty
        image="https://rzzt-1317097641.cos.ap-chengdu.myqcloud.com/empty.png"
        description="暂无数据"
      ></el-empty>
    </template>
    <el-table-column type="index" :index="getIndex" label="序号" width="55"></el-table-column>
    <el-table-column prop="username" label="用户名称"></el-table-column>
    <el-table-column prop="clue" label="线索数量"></el-table-column>
    <el-table-column prop="niche" label="商机数量"></el-table-column>
    <el-table-column prop="status" label="状态"></el-table-column>
    <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
    <el-table-column prop="phone" label="手机号码"></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" link @click="handleDetail(scope.row.id, $event)">处理</el-button>
        <el-button type="primary" link @click="handleDetail(scope.row.id, $event)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="paginationFoot">
    <el-pagination
      :page-sizes="[10, 20, 30, 50]"
      layout="total,  prev, pager, sizes,next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <!-- 处理弹窗 -->
  <el-dialog
    v-model="isShow"
    :title="isDetail ? '详情' : '处理'"
    width="40%"
    :before-close="handleClose"
  >
    <div>
      <el-form :model="dialogForm" ref="dialogFormRef">
        <el-form-item label="类型">
          <span>{{ dialogForm.type }}</span>
        </el-form-item>
        <el-form-item label="编号">
          <span>{{ dialogForm.code }}</span>
        </el-form-item>
        <el-form-item label="创建日期">
          <span>{{ dialogForm.createTime }}</span>
        </el-form-item>
        <el-form-item label="用户编号">
          <span>{{ dialogForm.code }}</span>
        </el-form-item>
        <el-form-item label="减员姓名">
          <span>{{ dialogForm.dismissalName }}</span>
        </el-form-item>
        <el-form-item label="详情">
          <span>{{ dialogForm.particulars }}</span>
        </el-form-item>
        <el-form-item :label="isDetail ? '分配部门' : '请选择部门'">
          <el-tree-select
            v-if="!isDetail"
            v-model="dialogForm.allotBranch"
            :data="departments"
            check-strictly
            @current-change="CurrentChange"
            :props="{ label: 'deptName', value: 'deptName', children: 'children' }"
            :render-after-expand="false"
          />
          <span v-else>{{ dialogForm.allotBranch }}</span>
        </el-form-item>
        <el-form-item :label="isDetail ? '分配人员' : '请选择人员'">
          <el-select v-if="!isDetail" v-model="dialogForm.allotStaff">
            <el-option
              v-for="item in employees"
              :key="item.userId"
              :label="item.userName"
              :value="item.userName"
            ></el-option>
          </el-select>
          <span v-else>{{ dialogForm.allotStaff }}</span>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer" v-if="!isDetail">
        <el-button @click="btnCancel">取消</el-button>
        <el-button type="primary" @click="btnConfirm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.paginationFoot {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}
.el-dialog__body {
  .el-form {
    padding-left: 60px;
  }
}
.el-table {
  margin-top: 20px;
}
</style>
