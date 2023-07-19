<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getCluePoolListApi, getCluePoolApi } from '@/api/clue.js'
import * as dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
const channelOption = ['线下活动', '推荐介绍', '其他活动']

// 查询参数
const searchFormRef = ref(null)
const formInline = ref({
  id: '',
  phone: '',
  channel: '',
  createTime: ''
})

const resetForm = () => {
  searchFormRef.value.resetFields()
}
const onSubmit = () => {
  const obj = Object.fromEntries(Object.entries(formInline.value).filter((item) => item[1] !== ''))
  if (obj.createTime) {
    obj.createTime = dayjs(obj.createTime).format('YYYY-MM-DD')
  }
  if (obj.id) {
    obj.id = tableData.value.filter((item) => item.clueName.includes(obj.id))[0].id
  }
  getTableData({ ...obj, page: page.value, pageSize: pageSize.value })
}

const getTableData = async (params) => {
  const res = await getCluePoolListApi(params)
  tableData.value = res.data.records
  total.value = res.data.total
}

onMounted(() => {
  getTableData({ page: page.value, pageSize: pageSize.value })
})

const tableData = ref([])

const total = ref(10)
const page = ref(1)
const pageSize = ref(10)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
}

// 捞取单个
const singleVisible = ref(false)

const changeSingleStatus = (id) => {
  singleVisible.value = true
  selection.value = [{ id }]
}

// 捞取多个
const multipleVisible = ref(false)
const changeMultipleStatus = () => {
  if (!selection.value.length) {
    return ElMessage.error('请选择线索')
  }
  multipleVisible.value = true
}

const selection = ref([])

const handleSelectionChange = (val) => {
  selection.value = val
}

const multipleSubmit = async () => {
  const res = await getCluePoolApi(selection.value.map((item) => item.id).join(','))
  console.log(res)
  multipleVisible.value = false
  singleVisible.value = false
  selection.value = []
  getTableData({ page: page.value, pageSize: pageSize.value })
  ElMessage.success('捞取成功')
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

      <!-- 表单 -->

      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="searchFormRef">
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
            <el-form-item label="渠道来源:" prop="channel">
              <el-select v-model="formInline.channel" class="m-2" placeholder="请选择" size="large">
                <el-option v-for="item in channelOption" :key="item" :label="item" :value="item" />
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

          <el-col :span="4" :offset="20">
            <el-form-item>
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
            </el-form-item></el-col
          >
        </el-row>
      </el-form>

      <el-row :gutter="120" style="border-top: 1px solid #ccc; padding-top: 2em">
        <el-col :span="2">
          <el-button type="primary" :icon="Plus" @click="changeMultipleStatus">批量捞取</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%; margin-top: 2em"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="线索ID" width="120">
          <template #default="scope">{{ scope.row.clueName }}</template>
        </el-table-column>
        <el-table-column property="phone" label="手机号" width="120" />
        <el-table-column property="channel" label="渠道来源" />
        <el-table-column label="活动名称">
          <template #default="scope">{{ scope.row.activity }}</template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template #default="scope">{{ scope.row.createTime.replace('T', ' ') }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="changeSingleStatus(scope.row.id)"
              >捞取</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
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

  <!-- 单个捞取 -->
  <el-dialog v-model="singleVisible" width="30%">
    <span>确认捞取?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="singleVisible = false">取消</el-button>
        <el-button type="primary" @click="multipleSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 批量捞取 -->
  <el-dialog v-model="multipleVisible" width="30%">
    <div>您已选择{{ selection.length }}条线索</div>
    <span>确认捞取?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="multipleVisible = false">取消</el-button>
        <el-button type="primary" @click="multipleSubmit"> 确认 </el-button>
      </span>
    </template>
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
