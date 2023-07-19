<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getActivityData, deleteActivity, getChannelSource } from '@/api/activity.js'
import AddDialog from './components/add-dialog.vue'
defineOptions({ name: 'activityPage' })

// 参数
const params = ref({
  page: 1,
  pageSize: 10,
  code: '', //活动编号
  channel: '', //渠道来源
  createStartTime: '', //创建开始时间
  createEndTime: '', //创建结束时间
  activityStartTime: '', //活动开始时间
  activityEndTime: '' //活动结束时间
})

//搜索表单
const activeForm = ref({
  code: '',
  channel: '',
  createTime: [],
  createStartTime: '', //创建开始时间
  createEndTime: '', //创建结束时间
  activityTime: [],
  activityStartTime: '', //活动开始时间
  activityEndTime: '' //活动结束时间
})
//规则
const activeRules = ref({
  code: [{ required: true, message: '请输入活动编号', trigger: 'blur' }],
  channel: [{ required: true, message: '请选择渠道来源', trigger: ['change', 'blur'] }],
  createTime: [{ required: true, message: '请选择创建时间', trigger: ['change', 'blur'] }],
  activityTime: [{ required: true, message: '请选择活动时间', trigger: ['change', 'blur'] }]
})
// 表格数据
const activeData = ref([
  {
    id: null,
    code: '',
    name: '',
    channel: null,
    info: '',
    type: '',
    activityDetails: '',
    status: '',
    beginTime: '',
    endTime: ''
  }
])

//获取表格数据
const total = ref(0)
const getActivityDataAPI = async () => {
  const res = await getActivityData(params.value)
  // console.log(res.data)
  activeData.value = res.data.records
  total.value = res.data.total
}
const activeFormRef = ref(null)
//获取渠道来源
const channelSource = ref([])
const getChannelSourceAPI = async () => {
  const res = await getChannelSource('clues_item')
  console.log(res.data)
  channelSource.value = res.data
}
//搜索
const handleSearch = async () => {
  params.value.code = activeForm.value.code.trim()
  params.value.channel = activeForm.value.channel.trim()
  params.value.createStartTime = activeForm.value.createTime[0]
  params.value.createEndTime = activeForm.value.createTime[1]
  params.value.activityStartTime = activeForm.value.activityTime[0]
  params.value.activityEndTime = activeForm.value.activityTime[1]

  getActivityDataAPI()

  await activeFormRef.value.resetFields()
}
//重置
const handleReset = async () => {
  await activeFormRef.value.resetFields()
  params.value.page = 1
  params.value.pageSize = 10
  params.value.code = ''
  params.value.channel = ''
  params.value.createStartTime = ''
  params.value.createEndTime = ''
  params.value.activityStartTime = ''
  params.value.activityEndTime = ''
  getActivityDataAPI()
}
// 弹框
const showDialog = ref(false)
//是否修改
const isEdit = ref(false)
//创建活动
const handleAdd = () => {
  isEdit.value = false
  showDialog.value = true
}
//修改
const currentIdRef = ref(null)
const handleChange = (id) => {
  console.log('修改')
  currentIdRef.value.getActivityDetailAPI(id)
  isEdit.value = true
  showDialog.value = true
}
//删除
const handleDelete = (id) => {
  ElMessageBox.confirm('确定将选择数据删除', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await deleteActivity({ id })
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        getActivityDataAPI()
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

//选择几项
const selection = ref([])
const ids = ref({})
const handleSelectionChange = (val) => {
  selection.value = val
  ids.value = selection.value.map((item) => item.id)
  console.log(ids.value)
}
//批量删除
const otherDel = async () => {
  const str = ids.value.join(',')
  ElMessageBox.confirm('确定将选择数据删除', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await deleteActivity({ id: str })
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        getActivityDataAPI()
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
//分页
const handleSizeChange = (val) => {
  params.value.pageSize = val
  getActivityDataAPI()
}
const handleCurrentChange = (val) => {
  params.value.page = val
  getActivityDataAPI()
}
onMounted(() => {
  getActivityDataAPI()
  getChannelSourceAPI()
})
</script>
<template>
  <!-- 搜索 -->
  <el-card>
    <template #header>
      <span>高级搜索</span>
    </template>
    <el-form :model="activeForm" ref="activeFormRef" :rules="activeRules">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="活动编号" prop="code">
            <el-input v-model="activeForm.code" placeholder="请输入活动编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="渠道来源" prop="channel">
            <el-select
              placeholder="请选择渠道来源"
              style="width: 100%"
              v-model="activeForm.channel"
              clearable
            >
              <el-option label="线上活动" value="1"></el-option>
              <el-option label="推广活动" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建日期" prop="createTime">
            <el-date-picker
              clearable
              v-model="activeForm.createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-col :span="8">
        <el-form-item label="活动日期" prop="activityTime">
          <el-date-picker
            clearable
            v-model="activeForm.activityTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
      <el-row style="display: flex; justify-content: end">
        <el-form-item>
          <el-button @click="handleReset"> 重置 </el-button>
          <el-button type="primary" @click="handleSearch"> 搜索 </el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-card>
  <div style="margin: 20px 0; text-align: right">
    <el-button type="primary" @click="handleAdd">+创建活动</el-button>
    <el-button type="danger" @click="otherDel">-批量删除</el-button>
  </div>
  <!-- 活动表格 -->
  <el-table :data="activeData" style="width: 100%" @selection-change="handleSelectionChange">
    <template #empty>
      <el-empty
        image="https://rzzt-1317097641.cos.ap-chengdu.myqcloud.com/empty.png"
        description="description"
      />
    </template>
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="code" label="活动编号"></el-table-column>
    <el-table-column prop="name" label="活动名称"></el-table-column>
    <el-table-column prop="channel" label="渠道来源">
      <template #default="scope">
        <span v-if="scope.row.channel == 1">线上活动</span>
        <span v-if="scope.row.channel == 2">推荐介绍</span>
      </template>
    </el-table-column>
    <el-table-column prop="info" label="活动简介"></el-table-column>
    <el-table-column prop="activityDetails" label="活动明细"></el-table-column>
    <el-table-column prop="beginTime" label="开始时间" sortable></el-table-column>
    <el-table-column prop="endTime" label="结束时间" sortable></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" link @click="handleChange(scope.row.id)">修改</el-button>
        <el-button type="danger" link @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="paginationFoot">
    <span>已选{{ selection.length }}项</span>
    <el-pagination
      :page-sizes="[10, 20, 30, 50]"
      layout="total,  prev, pager, sizes,next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <add-dialog
    v-model:showDialog="showDialog"
    :isEdit="isEdit"
    @addSuccess="getActivityDataAPI()"
    ref="currentIdRef"
  ></add-dialog>
</template>

<style lang="scss" scoped>
.paginationFoot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
</style>
