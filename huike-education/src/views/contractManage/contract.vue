<script setup>
defineOptions({ name: 'contractPage' })
import { ref, computed, onMounted, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import {
  getContractListApi,
  uploadInfoApi,
  uploadContractApi,
  getSubjectListApi,
  getCourseListApi,
  getContractDetailApi,
  getAllCourseApi
} from '@/api/contract.js'
import { ElMessage } from 'element-plus'

// 查询表单
const searchFormRef = ref(null)
const subjectOption = ref([])
const courseOption = ref([])
const formInline = ref({
  contractNo: '',
  name: '',
  phone: '',
  courseName: '',
  createTime: ''
})

const getSubjectList = async () => {
  const res = await getSubjectListApi()
  subjectOption.value = res.data
}

const getCourseList = async () => {
  if (!formInline.value.subject) {
    return
  }

  const id = subjectOption.value.findIndex(
    (el) => Object.values(el)[0] === formInline.value.subject
  )

  const res = await getCourseListApi(id)

  courseOption.value = res.data
}

watch(
  () => formInline.value.subject,
  () => {
    if (!formInline.value.subject) {
      courseOption.value = []
    }
  }
)
const resetSearchForm = (formInstance) => {
  formInstance.resetFields()
}

const onSubmit = async () => {
  console.log('submit!')
  console.log(formInline.value)
  const obj = Object.fromEntries(Object.entries(formInline.value).filter((item) => item[1] !== ''))
  const res = await getContractListApi(obj)
  total.value = res.data.total
  tableData.value = res.data.records
}

// 加载数据
const getTableList = async (params) => {
  const res = await getContractListApi(params)
  total.value = res.data.total
  tableData.value = res.data.records
}

onMounted(() => {
  getTableList({ page: page.value, pageSize: pageSize.value })
})

const tableData = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const background = ref(false)
const disabled = ref(false)
const index = computed(() => {
  return (page.value - 1) * pageSize.value + 1
})

watch([page, pageSize], ([page, pageSize]) => {
  getTableList({ page, pageSize })
})

const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
}

// 添加合同
const addContractRef = ref(null)
const addVisible = ref(false)

const allCourseOption = ref([])
const getAllCourseList = async () => {
  const res = await getAllCourseApi()
  allCourseOption.value = res.data
}

const addContract = () => {
  addVisible.value = true
}

const cancelAddContract = () => {
  addContractRef.value.resetFields()
  addVisible.value = false
}

const submitAddContract = () => {
  addContractRef.value.validate(async (valid, fields) => {
    if (!valid) {
      return console.log('error submit!!', fields)
    }
    if (!addContractForm.value.contractUrl) {
      return ElMessage.error('请上传合同')
    }
    await uploadInfoApi(addContractForm.value)
    ElMessage.success('添加成功')
    addVisible.value = false
    addContractRef.value.resetFields()
    fileList.value = []
    getTableList({ page: page.value, pageSize: pageSize.value })
  })
}

const formData = new FormData()
const fileList = ref([])

watch(fileList, async (newVal) => {
  if (newVal.length > 0) {
    formData.append('files', fileList.value[0].raw)
    const res = await uploadContractApi(formData)
    addContractForm.value.contractUrl = res.data
  }
})

const addContractForm = ref({
  phone: '',
  name: '',
  contractNo: '', //合同编号
  courseName: '',
  contractUrl: ''
})

// 预览合同
const showVisible = ref(false)
const contractUrl = ref('')
const showContract = async (id) => {
  const res = await getContractDetailApi(id)
  contractUrl.value = res.data.contractUrl
  showVisible.value = true
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

      <el-form :inline="true" ref="searchFormRef" :model="formInline" class="demo-form-inline">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="合同编号:" label-width="72px" prop="contractNo">
              <el-input v-model="formInline.contractNo" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户姓名:" label-width="72px" prop="name">
              <el-input v-model="formInline.name" placeholder="请输入" clearable /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="手机号:" label-width="72px" prop="phone">
              <el-input
                v-model="formInline.phone"
                placeholder="请输入"
                clearable
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="购买学科:" prop="subject">
              <el-select
                v-model="formInline.subject"
                class="m-2"
                placeholder="我的线索"
                size="large"
                @focus="getSubjectList"
              >
                <el-option
                  v-for="(item, i) in subjectOption"
                  :key="i"
                  :label="Object.values(item)[0]"
                  :value="Object.values(item)[0]"
                />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="购买课程:" prop="courseName">
              <el-select
                v-model="formInline.courseName"
                class="m-2"
                placeholder="我的线索"
                size="large"
                @focus="getCourseList"
              >
                <el-option
                  v-for="(item, i) in courseOption"
                  :key="i"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="创建时间:" prop="createTime">
              <el-date-picker
                v-model="formInline.createTime"
                type="date"
                placeholder="请选择"
                :size="size"
              /> </el-form-item
          ></el-col>
          <el-col :span="4" :offset="20">
            <el-form-item>
              <el-button @click="resetSearchForm(searchFormRef)">重置</el-button>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
            </el-form-item></el-col
          >
        </el-row>
      </el-form>

      <el-row :gutter="120" style="border-top: 1px solid #ccc; padding-top: 2em">
        <el-col :span="2">
          <el-button type="primary" :icon="Plus" @click="addContract">添加合同</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table ref="multipleTableRef" :data="tableData" style="width: 100%; margin-top: 2em">
        <el-table-column type="index" :index="index" width="55" label="序号" />

        <el-table-column property="contractNo" label="合同编号" width="120" />
        <el-table-column property="name" label="客户姓名" />
        <el-table-column label="手机号" property="phone">
          <!-- <template #default="scope">{{ scope.row.date }}</template> -->
        </el-table-column>
        <el-table-column label="购买学科" property="subject">
          <!-- <template #default="scope">{{ scope.row.date }}</template> -->
        </el-table-column>
        <el-table-column label="购买课程" property="courseName">
          <!-- <template #default="scope">{{ scope.row.date }}</template> -->
        </el-table-column>
        <el-table-column label="创建时间" property="createTime" sortable>
          <template #default="scope">{{ scope.row.createTime.replace('T', ' ') }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="showContract(scope.row.id)"
              >预览</el-button
            >
            <el-button link type="primary" size="small">修改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
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

  <!-- 添加合同 -->
  <el-dialog v-model="addVisible" width="560px" @close="cancelAddContract">
    <template #header>
      <div>添加合同</div>
    </template>
    <div>
      <el-form :model="addContractForm" style="padding: 0 20px" ref="addContractRef">
        <el-form-item label="客户名称" required prop="name" label-width="92px">
          <el-input placeholder="请输入" v-model="addContractForm.name"></el-input>
        </el-form-item>

        <el-form-item label="客户手机号" required prop="phone">
          <el-input placeholder="请输入" v-model="addContractForm.phone"></el-input>
        </el-form-item>

        <el-form-item label="合同编号" required label-width="92px" prop="contractNo">
          <el-input placeholder="请输入" v-model="addContractForm.contractNo"></el-input>
        </el-form-item>

        <el-form-item label="购买课程:" prop="courseName" label-width="92px">
          <el-select
            style="width: 388px"
            v-model="addContractForm.courseName"
            class="m-2"
            required
            placeholder="选择课程"
            size="medium"
            @focus="getAllCourseList"
          >
            <el-option
              v-for="(item, i) in allCourseOption"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="上传合同" required label-width="92px">
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            accept="application/pdf"
            :auto-upload="false"
            :limit="1"
          >
            <el-button type="primary">上传</el-button>
            <template #tip>
              <div class="el-upload__tip">仅支持pdf文件.</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button @click="cancelAddContract">取消</el-button>
          <el-button type="primary" @click="submitAddContract">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 预览合同 -->
  <el-dialog v-model="showVisible">
    <object :data="contractUrl" type="application/pdf" width="600" height="600"></object>
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
