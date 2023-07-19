<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import {
  getClueListApi,
  addClueApi,
  downloadExcelApi,
  getOwnerListApi,
  getDeptListApi,
  getPersonListApi,
  addClueExcelApi,
  checkExcelApi,
  distributeApi,
  getCheckResultApi,
  saveExcelApi
  // deleteExcelApi
} from '@/api/clue.js'
import { useRouter } from 'vue-router'
import * as dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
const router = useRouter()
const statusOption = ['待分配', '待跟进', '跟进中', '线索无效']
const channelOption = ['线下活动', '推荐介绍', '其他活动']

// 加载数据
const getClueList = async (params) => {
  const res = await getClueListApi(params)
  total.value = res.data.total
  tableData.value = res.data.records
}

onMounted(() => {
  getClueList({ page: 1, size: 10 })
})

// 查询
const searchClueFormRef = ref(null)
const formInline = ref({
  id: '',
  phone: '',
  belongPerson: '',
  createTime: '',
  status: '',
  channel: ''
})

// 归属人列表
const ownerOption = ref([])
const getClueOwner = async () => {
  const res = await getOwnerListApi()
  ownerOption.value = res.data
}

const resetSearchForm = (formInstance) => {
  if (formInstance) {
    formInstance.resetFields()
  }
}

const onSubmit = () => {
  const obj = Object.fromEntries(Object.entries(formInline.value).filter((item) => item[1] !== ''))
  if (obj.createTime) {
    obj.createTime = dayjs(obj.createTime).format('YYYY-MM-DD')
  }
  if (obj.id) {
    obj.id = tableData.value.filter((item) => item.clueName.includes(obj.id))[0].id
  }
  getClueList({ page: 1, size: 10, ...obj })
}
const tableData = ref([])

// 状态筛选
const filterStatus = (val, row) => row.status === val

// 多选操作,分配
const dispathVisible = ref(false)
const selection = ref([])
const handleSelectionChange = (val) => {
  selection.value = val.map((item) => item.id)
  console.log(selection.value)
}
const dispatchClue = () => {
  if (selection.value.length === 0) {
    return ElMessage.warning('请选择线索')
  }
  if (selection.value.length > 3) {
    return ElMessage.warning('批量分配不能超过3个线索')
  }
  dispathVisible.value = true
}

const submitDispatch = () => {
  dispatchFormRef.value.validate(async (valid) => {
    if (valid) {
      const res = await distributeApi({
        belongPerson: dispatchForm.value.userId,
        ids: selection.value
      })
      ElMessage.success(res.msg)
      if (res.code === 200) {
        resetDispatchForm(dispatchFormRef.value)
        getClueList({ page: 1, size: 10 })
      }
    }
  })
}

// 部门和人员
const dispatchFormRef = ref(null)
const dispatchForm = ref({
  userId: '',
  deptId: ''
})

const departmentOption = ref([])
const getDepartment = async () => {
  const res = await getDeptListApi()
  departmentOption.value = res.data
}

const personOption = ref([])
const getPerson = async (deptId) => {
  if (!deptId) {
    return
  }
  const res = await getPersonListApi(deptId)
  personOption.value = res.data
}

watch(
  () => dispatchForm.value.deptId,
  () => {
    dispatchForm.value.userId = ''
  }
)

const resetDispatchForm = (formInstance) => {
  if (formInstance) {
    formInstance.resetFields()
  }
  dispathVisible.value = false
}

// 跳转详情
const goClueDetail = (id) => {
  router.push('/clue/detail/' + id)
}
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

watch([page, pageSize], ([page, pageSize]) => {
  getClueList({ page, size: pageSize })
})

// 新增
const addClueFormRef = ref(null)
const newClueVisible = ref(false)
const addClueForm = ref({
  phone: '',
  channel: '',
  activityId: '',
  customerName: '',
  gender: '',
  age: '',
  weChat: '',
  qqNum: ''
})

const addRule = reactive({
  phone: [
    { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
  ],
  channel: [{ required: true, message: '请选择渠道', trigger: ['blur', 'change'] }]
})

const cancelAddCuleForm = () => {
  newClueVisible.value = false
  addClueFormRef.value.resetFields()
}

const onSubmitAddCuleForm = () => {
  addClueFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('submit!')
      await addClueApi(addClueForm.value)
      addClueFormRef.value.resetFields()
      newClueVisible.value = false
      ElMessage.success('添加成功')
      getClueList({ page: 1, size: 10 })
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

// 批量添加
const addClueVisible = ref(false)

// 下载模板
const getExcel = async () => {
  const res = await downloadExcelApi()
  const fileName = '线索导入模板.xlsx'
  const a = document.createElement('a')
  a.href = URL.createObjectURL(res)
  a.download = fileName
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
const formData = new FormData()
const fileList = ref([])
const sendFile = async () => {
  formData.append('file', fileList.value[0].raw)
}

const showResult = ref()

// 验证

const showIt = async () => {
  formData.append('file', fileList.value[0].raw)
  await addClueExcelApi(formData)
  const res2 = await checkExcelApi()
  res2.data ? (showResult.value = res2.data) : ElMessage.error('文件内容错误')
}

// 下载结果
const getExcelResult = async () => {
  const res = await getCheckResultApi()
  const fileName = '线索验证结果.xlsx'
  const a = document.createElement('a')
  a.href = URL.createObjectURL(res)
  a.download = fileName
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const finishAddExcel = async () => {
  addClueVisible.value = false
  fileList.value = []
  showResult.value = null
  await saveExcelApi()
  getClueList({ page: 1, size: 10 })
}

const clearFileList = () => {
  fileList.value = []
}
</script>

<template>
  <div class="container">
    <el-card class="box-card" style="width: 100%">
      <template #header>
        <div class="card-header">
          <h4>高级线索</h4>
        </div>
      </template>

      <!-- 查询表单 -->

      <el-form :inline="true" ref="searchClueFormRef" :model="formInline" class="demo-form-inline">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="线索ID:" label-width="72px" prop="id">
              <el-input v-model="formInline.id" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号:" label-width="72px" prop="phone">
              <el-input v-model="formInline.phone" placeholder="请输入" clearable /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="线索归属:" prop="belongPerson">
              <el-select
                @focus="getClueOwner"
                v-model="formInline.belongPerson"
                class="m-2"
                placeholder="我的线索"
                size="large"
              >
                <el-option v-for="item in ownerOption" :key="item" :label="item" :value="item" />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="创建日期:" prop="createTime">
              <el-date-picker
                v-model="formInline.createTime"
                type="date"
                placeholder="请选择"
                :size="size"
              /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="线索状态:" prop="status">
              <el-select
                v-model="formInline.status"
                class="m-2"
                placeholder="我的线索"
                size="large"
              >
                <el-option v-for="item in statusOption" :key="item" :label="item" :value="item" />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="渠道来源:" prop="channel">
              <el-select
                v-model="formInline.channel"
                class="m-2"
                placeholder="我的线索"
                size="large"
              >
                <el-option v-for="item in channelOption" :key="item" :label="item" :value="item" />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="4" :offset="20">
            <el-form-item>
              <el-button @click="resetSearchForm(searchClueFormRef)">重置</el-button>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
            </el-form-item></el-col
          >
        </el-row>
      </el-form>

      <el-row :gutter="120" style="border-top: 1px solid #ccc; padding-top: 2em">
        <el-col :span="2">
          <el-button type="primary" :icon="Plus" @click="newClueVisible = true">新建线索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" :icon="Plus" @click="addClueVisible = true"
            >批量添加</el-button
          ></el-col
        >
        <el-col :span="1" :offset="14">
          <el-button type="primary" :icon="Plus" @click="dispatchClue">批量分配</el-button></el-col
        >
      </el-row>

      <!-- 表格 -->
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%; margin-top: 2em"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="线索ID" width="120" property="clueName"> </el-table-column>
        <el-table-column property="phone" label="手机号" width="120" />
        <el-table-column property="channel" label="渠道来源" />
        <el-table-column label="创建时间" property="createTime">
          <template #default="scope">{{ scope.row.createTime.replace('T', ' ') }}</template>
        </el-table-column>
        <el-table-column label="归属人" property="belongPerson">
          <!-- <template #default="scope">{{ scope.row.date }}</template> -->
        </el-table-column>
        <el-table-column
          label="线索状态"
          :filters="[
            { text: '待分配', value: '待分配' },
            { text: '待跟进', value: '待跟进' },
            { text: '跟进中', value: '跟进中' },
            { text: '线索无效', value: '线索无效' }
          ]"
          :filter-method="filterStatus"
          filter-placement="bottom-end"
        >
          <template #default="scope">{{ scope.row.status }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button
              link
              @click="dispatchClue"
              type="primary"
              size="small"
              v-if="scope.row.status === '待分配'"
              >分配</el-button
            >
            <el-button link type="primary" size="small" v-else @click="goClueDetail(scope.row.id)"
              >跟进</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 100]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total,  prev, pager, next, sizes,jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>

  <!-- 新建线索 -->
  <el-dialog v-model="newClueVisible" style="width: 560px" @close="cancelAddCuleForm">
    <template #header>
      <div>新建线索</div>
    </template>

    <div>线索信息</div>

    <!-- 表格 -->
    <el-form style="padding: 0 80px" :model="addClueForm" :rules="addRule" ref="addClueFormRef">
      <el-form-item label="手机号" label-width="80px" prop="phone">
        <el-input placeholder="请输入内容" v-model="addClueForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="渠道来源" label-width="80px" prop="channel">
        <el-select
          v-model="addClueForm.channel"
          class="m-2"
          placeholder="请选择"
          size="middle"
          style="width: 280px"
        >
          <el-option v-for="item in channelOption" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动信息" label-width="80px" prop="activityId">
        <el-input placeholder="请输入内容" v-model="addClueForm.activityId"></el-input>
      </el-form-item>
      <el-form-item label="客户姓名" label-width="80px" prop="customerName">
        <el-input placeholder="请输入内容" v-model="addClueForm.customerName"></el-input>
      </el-form-item>
      <el-form-item label="性别" label-width="80px" prop="gender">
        <el-radio-group v-model="addClueForm.gender" class="ml-4">
          <el-radio label="1" size="large">男</el-radio>
          <el-radio label="2" size="large">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" label-width="80px" prop="age">
        <el-input v-model.number="addClueForm.age" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="微信" label-width="80px" prop="weChat">
        <el-input placeholder="请输入内容" v-model="addClueForm.weChat"></el-input>
      </el-form-item>
      <el-form-item label="QQ" label-width="80px" prop="qqNum">
        <el-input placeholder="请输入内容" v-model="addClueForm.qqNum"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelAddCuleForm">取消</el-button>
        <el-button type="primary" @click="onSubmitAddCuleForm"> 确定 </el-button>
      </div>
    </template></el-dialog
  >

  <!-- 分配线索 -->

  <el-dialog
    v-model="dispathVisible"
    style="width: 560px"
    @close="resetDispatchForm(dispatchFormRef)"
  >
    <template #header>
      <div>分配线索</div>
    </template>
    <div style="margin-bottom: 20px; padding-left: 20px">
      您选择了{{ selection.length }}个线索 , 请选择人员进行分配 :
    </div>
    <el-form style="padding-left: 20px" :model="dispatchForm" ref="dispatchFormRef">
      <el-form-item label="请选择部门" required prop="deptId">
        <el-select
          v-model="dispatchForm.deptId"
          class="m-2"
          placeholder="请选择"
          size="middle"
          @focus="getDepartment"
          style="width: 280px"
        >
          <el-option
            v-for="item in departmentOption"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="请选择人员" required prop="userId">
        <el-select
          v-model="dispatchForm.userId"
          class="m-2"
          placeholder="请选择"
          size="middle"
          style="width: 280px"
          @focus="getPerson(dispatchForm.deptId)"
        >
          <el-option
            v-for="item in personOption"
            :key="item.userId"
            :label="item.userName"
            :value="item.userName"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="resetDispatchForm(dispatchFormRef)">取消</el-button>
        <el-button type="primary" @click="submitDispatch"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 批量添加线索 excel模板上传下载 -->
  <el-dialog v-model="addClueVisible" style="width: 620px" @close="clearFileList">
    <template #header>
      <div>批量添加线索</div>
    </template>
    <!-- 上传文件 -->
    <div style="border: 1px solid #ccc; padding: 0 1em; padding-bottom: 1em; margin-bottom: 1em">
      <div style="margin: 1em 0">上传文件</div>
      <div>第一次上传请 <el-button type="primary" @click="getExcel">点击下载此模板</el-button></div>
      <el-form style="margin: 1em 0">
        <el-form-item label="上传文件" required label-width="88px">
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            :auto-upload="false"
            :on-success="sendFile"
            :limit="1"
          >
            <el-button type="primary">上 传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <div style="display: flex; justify-content: flex-end" v-if="fileList.length">
        <!-- <el-button>删除</el-button> -->
        <el-button type="primary" @click="showIt">验证结果</el-button>
      </div>
    </div>

    <!-- 验证结果 -->
    <div style="border: 1px solid #ccc; padding: 0 1em; padding-bottom: 1em">
      <div style="margin: 1em 0">结果</div>
      <div v-if="showResult">
        <p>系统导入数据 : {{ showResult.total }}条</p>
        <p style="margin: 2px 0; color: red">系统重复数据 : {{ showResult.repetition }}条</p>
        <div style="display: flex; align-items: center; justify-content: space-between">
          <p>成功导入数据 : {{ showResult.succeed }}条</p>
          <el-button type="primary" @click="getExcelResult">下载结果</el-button>
        </div>

        <div style="display: flex; justify-content: flex-end">
          <el-button type="primary" @click="finishAddExcel">完成</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.container {
  padding: 10px;

  .el-card {
    box-shadow: none;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    height: 10px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    width: 480px;
  }

  .el-form {
    .el-input {
      width: 257px;
    }

    :deep(.el-date-editor.el-input) {
      width: 257px;
    }
    :deep(.el-input__wrapper) {
      height: 30px;
    }
    .el-select {
      width: 257px;
    }
  }
  :deep(.el-table__row) {
    height: 63px;
  }
  .pagination {
    margin-top: 1em;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
