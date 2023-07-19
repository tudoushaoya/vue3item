<script setup>
defineOptions({ name: 'businessPage' })
import { ref, onMounted } from 'vue'
import {
  getBusinessList,
  getBusinessStatus,
  addBusiness,
  getBusinessDict,
  getAreaList,
  assignBusiness,
  getDeptUserList,
  getBusinessDeptAndUser
} from '@/api/business'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import useAreaListData from '@/stores/PiniaStore.js'
const areaListData = useAreaListData()
const dialogFormVisibleOne = ref(false)
const dialogFormVisibleTwo = ref(false)
const router = useRouter()
const flag = ref(1)
const businessLists = ref([])
const nicheStatus = ref([])
const deptList = ref([])
// const getDeptAndUserAPI = async () => {
//   const res = await getDeptAndUser()
//   deptList.value = res.data
// }
const employeeids = ref(null)
const allocation = (id) => {
  console.log(id)
  employeeids.value = id
  assignEmployee.value.ids = [+id]
  dialogFormVisibleTwo.value = true
}
const getBusinessDeptAndUserAPI = async () => {
  const res = await getBusinessDeptAndUser()
  console.log(res.data.records)
  deptList.value = res.data.records
}
const assignEmployee = ref({
  deptId: '',
  employeeId: '',
  ids: []
})
const employeeList = ref([])
const deptChange = async (val) => {
  assignEmployee.value.deptId = val
  const res = await getDeptUserList(val)
  console.log(res.data)
  employeeList.value = res.data
}
const assignBusinessAPI = async () => {
  const res = await assignBusiness(assignEmployee.value)
  console.log(res)
  dialogFormVisibleTwo.value = false
  dialogFormVisibleThree.value = false
  getBusinessListAPI()
}
const employeeTotal = ref(0)
const handleSelectionChange = (val) => {
  console.log(val)
  assignEmployee.value.ids = val.map((item) => {
    return item.clientId
  })
  employeeTotal.value = val.length
}

const dialogFormVisibleThree = ref(false)
const getBusinessStatusAPI = async () => {
  const res = await getBusinessStatus()
  nicheStatus.value = res.data.listVO.sys_niche_state
  businessLists.value = res.data?.listVO.sys_niche_affiliation
  console.log(res)
}
const resAddForm = ref(null)
const areaList = ref([])
const getAreaListAPI = async () => {
  const res = await getAreaList()
  areaList.value = res.data
  areaListData.setAreaList = res.data
}
const subjectList = ref([])
const getBusinessDictAPI = async () => {
  const res = await getBusinessDict()
  subjectList.value = res.data.listVO.course_subject[0]
  areaListData.setSubjectList = subjectList.value
}
const follow = (id) => {
  flag.value = 1
  router.push({
    name: 'businessDetail',
    params: {
      id,
      flag: flag.value
    }
  })
}
const look = (id) => {
  flag.value = 0
  router.push({
    name: 'businessDetail',
    params: {
      id,
      flag: flag.value
    }
  })
}
const searchForm = ref({
  clientId: '',
  phone: '',
  customerName: '',
  nicheStatus: '',
  createTime: null,
  begin: '',
  end: '',
  page: 1,
  size: 10
})
const searchConfirm = () => {
  if (searchForm.value.createTime) {
    searchForm.value.begin = searchForm.value.createTime[0]
    searchForm.value.end = searchForm.value.createTime[1]
  }
  delete searchForm.value.createTime
  params.value = searchForm.value
  getBusinessListAPI()
  params.value = {
    page: 1,
    size: 10
  }
}
const addForm = ref({
  customerName: '',
  phone: '',
  sex: 1,
  weChatNum: '',
  qqNum: '',
  age: ' ',
  province: '',
  city: '',
  subjectDicId: null,
  channeDicld: '',
  remark: ''
})
const addBusinessAPI = async () => {
  await addBusiness(addForm.value)
  getBusinessListAPI()
}
const addBusinessSubmit = async () => {
  await resAddForm.value.validate()
  addBusinessAPI()
  ElMessage.success('添加成功')
  dialogFormVisibleOne.value = false
  resAddForm.value.resetFields()
}
const rules = ref({
  customerName: [
    { required: true, message: '请输入客户姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: '手机号格式不正确',
      trigger: 'blur'
    }
  ],
  subjectDicId: [{ required: true, message: '请选择学科', trigger: 'change' }]
})
const params = ref({
  page: 1,
  size: 10
})
const businessList = ref([])
const total = ref(0)
const getBusinessListAPI = async () => {
  const res = await getBusinessList(params.value)
  businessList.value = res.records
  businessList.value.forEach((item) => {
    item.createdTime = item.createdTime.replace('T', ' ')
  })
  total.value = res.total
}
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
const resSearchForm = ref(null)
const resForm = () => {
  resSearchForm.value.resetFields()
  getBusinessListAPI()
}
const back = () => {
  resAddForm.value.resetFields()
  dialogFormVisibleOne.value = false
}
const handleSizeChange = (val) => {
  params.value.size = val
  getBusinessListAPI()
}
const handleCurrentChange = (val) => {
  params.value.page = val
  getBusinessListAPI()
}
const lists = ref([])
onMounted(() => {
  getBusinessListAPI()
  getBusinessStatusAPI()
  getBusinessDictAPI()
  getAreaListAPI()
  // getDeptAndUserAPI()
  getBusinessDeptAndUserAPI()
})
const activeName = ref('first')
</script>
<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="商机" name="first">
      <el-card class="box-card" shadow="never">
        <template #header> 高级搜索 </template>
        <el-form
          label-width="120px"
          :inline="true"
          width="100%"
          :model="searchForm"
          ref="resSearchForm"
        >
          <div style="display: flex; justify-content: space-between">
            <el-form-item label="客户ID：" prop="clientId">
              <el-input
                placeholder="请输入"
                class="inputWidth"
                v-model="searchForm.clientId"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="phone">
              <el-input
                placeholder="请输入"
                class="inputWidth"
                v-model="searchForm.phone"
              ></el-input>
            </el-form-item>
            <el-form-item label="客户姓名：" prop="customerName">
              <el-input
                placeholder="请输入"
                class="inputWidth"
                v-model="searchForm.customerName"
              ></el-input>
            </el-form-item>
          </div>
          <div style="display: flex; justify-content: space-between">
            <el-form-item label="商机归属：" prop="employeeId">
              <el-select
                placeholder="请输入商机名称"
                class="inputWidth"
                v-model="searchForm.employeeId"
              >
                <el-option
                  v-for="item in businessLists"
                  :label="item?.nickName"
                  :value="item?.userId"
                  :key="item?.userId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商机状态：" prop="nicheStatus">
              <el-select
                placeholder="请输入商机状态"
                class="inputWidth"
                v-model="searchForm.nicheStatus"
              >
                <el-option
                  v-for="(item, index) in nicheStatus"
                  :label="item"
                  :key="index"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              <el-date-picker
                style="width: 13.6vw"
                type="daterange"
                range-separator="到"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                v-model="searchForm.createTime"
              />
            </el-form-item>
          </div>

          <div style="width: 100%; display: flex; justify-content: end">
            <el-form-item>
              <el-button size="large" @click="resForm">重置</el-button>
              <el-button type="primary" size="large" @click="searchConfirm">搜索</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
      <div style="width: 100%; display: flex; justify-content: space-between; margin: 20px 0">
        <el-button type="primary" size="large" @click="dialogFormVisibleOne = true"
          >+ &nbsp;新建商机</el-button
        >
        <el-button type="primary" size="large" @click="dialogFormVisibleThree = true"
          >+ &nbsp;批量分配</el-button
        >
      </div>

      <el-table
        ref="multipleTableRef"
        :data="businessList"
        style="width: 100%"
        :header-cell-style="headerRowStyle"
        :cell-style="cellStyle"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="clientId" label="客户ID" width="190" />
        <el-table-column property="customerName" label="姓名" />
        <el-table-column property="phone" label="手机号" width="120" />
        <el-table-column property="subject" label="意向学科" />
        <el-table-column property="employee" label="归属人" width="120" />
        <el-table-column property="createdTime" label="创建时间" sortable width="170" />
        <el-table-column
          property="nicheStatus"
          label="商机状态"
          width="120"
          :filters="[
            { text: 'Home', value: 'Home' },
            { text: 'Office', value: 'Office' }
          ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="text" size="small" @click="look(scope.row.clientId)">查看</el-button>
            <el-button type="text" size="small" @click="follow(scope.row.clientId)">跟进</el-button>
            <el-button type="text" size="small" @click="allocation(scope.row.clientId)"
              >分配</el-button
            >
          </template>
        </el-table-column>
        <template #empty>
          <el-empty image="https://rzzt-1317097641.cos.ap-chengdu.myqcloud.com/empty.png" />
        </template>
      </el-table>
      <div style="width: 100%; display: flex; justify-content: end">
        <el-pagination
          v-model:current-page="currentPage4"
          v-model:page-size="pageSize4"
          :page-sizes="[100, 200, 300, 400]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-dialog v-model="dialogFormVisibleOne" title="新建商机" width="35%" :before-close="back">
        <template #header>
          <span class="dialog-header"> 新建商机 </span>
        </template>
        <el-form label-width="90px" :model="addForm" :rules="rules" ref="resAddForm">
          <el-form-item label="基本信息"> </el-form-item>
          <el-form-item label="姓名" prop="customerName">
            <el-input placeholder="请输入" v-model="addForm.customerName" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input placeholder="请输入" v-model="addForm.phone" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="addForm.sex" class="ml-4">
              <el-radio :label="1" size="large">男</el-radio>
              <el-radio :label="2" size="large">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="微信" prop="weChatNum">
            <el-input placeholder="请输入" v-model="addForm.weChatNum" />
          </el-form-item>
          <el-form-item label="QQ" prop="qqNum">
            <el-input placeholder="请输入" v-model="addForm.qqNum" />
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input-number
              style="width: 100%"
              v-model="addForm.age"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="地区" prop="city">
            <el-tree-select
              :data="areaList"
              :props="{ label: 'name', value: 'pid', children: 'cityList' }"
              style="width: 100%"
              v-model="addForm.city"
            />
          </el-form-item>
          <el-form-item label="意向学科" prop="subjectDicId">
            <el-select style="width: 100%" v-model="addForm.subjectDicId">
              <el-option
                v-for="item in subjectList"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictSort"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="渠道来源" prop="channeDicld">
            <el-select style="width: 100%" v-model="addForm.channeDicld"></el-select>
          </el-form-item>
          <el-form-item label="备注"></el-form-item>
          <el-form-item prop="remark">
            <el-input type="textarea" :rows="5" v-model="addForm.remark" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="back">返回</el-button>
            <el-button type="primary" @click="addBusinessSubmit"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="公海池" name="second">
      <el-card class="box-card" shadow="never">
        <template #header> 高级搜索 </template>
        <el-form label-width="120px" :inline="true" width="100%">
          <div style="display: flex; justify-content: space-between">
            <el-form-item label="客户姓名：">
              <el-input placeholder="请输入商机名称" class="inputWidth"></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input placeholder="请输入商机名称" class="inputWidth"></el-input>
            </el-form-item>
            <el-form-item label="客户ID：">
              <el-input placeholder="请输入商机名称" class="inputWidth"></el-input>
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item label="意向学科：">
              <el-select placeholder="请输入" class="inputWidth"></el-select>
            </el-form-item>
            <el-form-item label="创建时间：">
              <el-select placeholder="请输入" class="inputWidth"></el-select>
            </el-form-item>
          </div>
          <div style="width: 100%; display: flex; justify-content: end">
            <el-form-item>
              <el-button size="large">重置</el-button>
              <el-button type="primary" size="large">搜索</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
      <div style="width: 100%; margin-top: 20px">
        <el-button type="primary" size="large" @click="dialogFormVisibleOne = true"
          >+ &nbsp;批量捞取</el-button
        >
        <el-button type="primary" size="large" @click="dialogFormVisibleTwo = true"
          >+ &nbsp;批量分配</el-button
        >
      </div>

      <el-table
        ref="multipleTableRef"
        :data="lists"
        style="width: 100%"
        :header-cell-style="headerRowStyle"
        :cell-style="cellStyle"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="id" label="客户ID" width="120" />
        <el-table-column property="name" label="姓名" width="120" />
        <el-table-column property="address" label="手机号" />
        <el-table-column property="address" label="意向学科" />
        <el-table-column property="address" label="创建时间" sortable />
        <el-table-column property="address" label="操作" width="200">
          <template #default>
            <el-button type="text" size="small">捞取</el-button>
            <el-button type="text" size="small">分配</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty image="https://rzzt-1317097641.cos.ap-chengdu.myqcloud.com/empty.png" />
        </template>
      </el-table>
      <div style="width: 100%; display: flex; justify-content: end">
        <el-pagination
          v-model:current-page="currentPage4"
          v-model:page-size="pageSize4"
          :page-sizes="[100, 200, 300, 400]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-tab-pane>
  </el-tabs>
  <el-dialog v-model="dialogFormVisibleTwo" width="35%">
    <template #header>
      <span class="dialog-header"> 分配索引 </span>
    </template>
    <el-form label-width="100px">
      <el-form-item label="您"> </el-form-item>
      <el-form-item label="请选择部门：">
        <el-select style="width: 100%" v-model="assignEmployee.deptId" @change="deptChange">
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="请选择人员：">
        <el-select style="width: 100%" v-model="assignEmployee.employeeId">
          <el-option
            v-for="item in employeeList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisibleTwo = false">返回</el-button>
        <el-button type="primary" @click="assignBusinessAPI"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogFormVisibleThree" width="35%">
    <template #header>
      <span class="dialog-header"> 分配索引 </span>
    </template>
    <el-form label-width="100px">
      <span
        >您选择了<span style="color: #1890ff">&nbsp;{{ employeeTotal }}&nbsp;</span
        >个商机，请选择人员进行分配</span
      >
      <el-form-item label="请选择部门：" style="margin-top: 20px">
        <el-select style="width: 100%" v-model="assignEmployee.deptId" @change="deptChange">
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="请选择人员：">
        <el-select style="width: 100%" v-model="assignEmployee.employeeId">
          <el-option
            v-for="item in employeeList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisibleThree = false">返回</el-button>
        <el-button type="primary" @click="assignBusinessAPI"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-card__header) {
  background: #f2f2f2 !important;
}

.inputWidth {
  width: 15vw;
}
</style>
