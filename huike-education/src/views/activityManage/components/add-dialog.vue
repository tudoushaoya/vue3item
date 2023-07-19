<script setup>
import { ref, onMounted } from 'vue'
defineOptions({ name: 'addDialog' })
import {
  getActivityDetail,
  updateActivity,
  addActivityData,
  getActivityType,
  getChannelSource
} from '@/api/activity.js'
import { ElMessage } from 'element-plus'
const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})
const activeFormRef = ref(null)
//弹框表单
const dialogForm = ref({
  id: null,
  name: '',
  channel: '',
  info: '',
  type: '',
  discount: null,
  vouchers: null,
  createTimeAll: [],
  beginTime: '', //创建开始时间
  endTime: '' //创建结束时间
})

//规则
const dialogRules = ref({
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  channel: [{ required: true, message: '请选择渠道来源', trigger: ['change', 'blur'] }],
  info: [{ required: true, message: '请输入活动简介', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: ['change', 'blur'] }],
  discount: [{ required: true, message: '请输入折扣', trigger: 'blur' }],
  vouchers: [{ required: true, message: '请输入代金券', trigger: 'blur' }],
  createTimeAll: [{ required: true, message: '请选择活动时间', trigger: ['change', 'blur'] }]
})

const emit = defineEmits(['update:showDialog', 'addSuccess'])
//关闭弹窗
const handleClose = () => {
  emit('update:showDialog', false)
  activeFormRef.value.resetFields()
}
//获取详情
const getActivityDetailAPI = async (id) => {
  const res = await getActivityDetail(id)
  console.log(res.data)
  dialogForm.value = res.data
  dialogForm.value.createTimeAll = [res.data.beginTime, res.data.endTime]
}
defineExpose({
  getActivityDetailAPI
})

//获取活动类型
const activityType = ref([])
const getActivityTypeAPI = async () => {
  const res = await getActivityType()
  console.log(res.data)
  activityType.value = res.data
}
//获取渠道来源
const channelSource = ref([])
const getChannelSourceAPI = async () => {
  const res = await getChannelSource('clues_item')
  console.log(res.data)
  channelSource.value = res.data
}
//确认
const btnSubmit = async () => {
  await activeFormRef.value.validate()
  if (props.isEdit) {
    console.log(dialogForm.value)
    dialogForm.value.beginTime = dialogForm.value.createTimeAll[0]
    dialogForm.value.endTime = dialogForm.value.createTimeAll[1]
    delete dialogForm.value.createTimeAll
    const res = await updateActivity(dialogForm.value)
    console.log(res)

    ElMessage({
      message: '修改成功',
      type: 'success'
    })
    console.log('修改')
  } else {
    dialogForm.value.beginTime = dialogForm.value.createTimeAll[0]
    dialogForm.value.endTime = dialogForm.value.createTimeAll[1]
    delete dialogForm.value.createTimeAll
    console.log(dialogForm.value)
    const res = await addActivityData(dialogForm.value)
    console.log(res)
    ElMessage({
      message: '添加成功',
      type: 'success'
    })
  }
  emit('addSuccess')
  handleClose()
}
onMounted(() => {
  getActivityTypeAPI()
  getChannelSourceAPI()
})
</script>
<template>
  <el-dialog
    v-model="props.showDialog"
    :title="props.isEdit ? '修改活动' : '创建活动'"
    width="50%"
    :before-close="handleClose"
  >
    <el-form
      label-width="80px"
      :rules="dialogRules"
      label-position="top"
      ref="activeFormRef"
      :model="dialogForm"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="渠道来源" prop="channel">
            <el-select
              placeholder="请选择渠道来源"
              style="width: 100%"
              v-model="dialogForm.channel"
              clearable
            >
              <el-option label="线上活动" value="1"></el-option>
              <el-option label="推广活动" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动名称" prop="name">
            <el-input placeholder="请输入活动名称" v-model="dialogForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="活动日期" prop="createTimeAll">
        <el-date-picker
          v-model="dialogForm.createTimeAll"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="活动简介" prop="info">
            <el-input placeholder="请输入活动简介" v-model="dialogForm.info"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动类型" prop="type">
            <el-select
              placeholder="请选择活动类型"
              clearable
              style="width: 100%"
              v-model="dialogForm.type"
            >
              <el-option label="课程折扣" value="1"></el-option>
              <el-option label="课程代金券" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-col :span="12">
        <el-form-item
          v-if="dialogForm.type && !props.isEdit"
          :label="dialogForm.type === '1' ? '折扣' : '代金券'"
          :prop="dialogForm.type === '1' ? 'discount' : 'vouchers'"
        >
          <el-input-number
            v-if="dialogForm.type === '2'"
            style="width: 100%"
            v-model="dialogForm.vouchers"
            placeholder="请输入代金券"
            :min="0.1"
            :max="9.9"
            controls-position="right"
            :precision="1"
            :step="0.1"
          />
          <el-input-number
            v-if="dialogForm.type === '1'"
            style="width: 100%"
            v-model="dialogForm.discount"
            placeholder="请输入折扣"
            :min="0.1"
            :max="9.9"
            controls-position="right"
            :precision="1"
            :step="0.1"
          />
        </el-form-item>
        <el-form-item
          v-if="props.isEdit"
          :label="dialogForm.type === '1' ? '折扣' : '代金券'"
          :prop="dialogForm.type === '1' ? 'discount' : 'vouchers'"
        >
          <el-input-number
            v-if="dialogForm.type === '2'"
            style="width: 100%"
            v-model="dialogForm.vouchers"
            placeholder="请输入代金券"
            :min="0.1"
            :max="9.9"
            controls-position="right"
            :precision="1"
            :step="0.1"
          />
          <el-input-number
            v-if="dialogForm.type === '1'"
            style="width: 100%"
            v-model="dialogForm.discount"
            placeholder="请输入折扣"
            :min="0.1"
            :max="9.9"
            controls-position="right"
            :precision="1"
            :step="0.1"
          />
        </el-form-item>
      </el-col>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button round @click="handleClose">取消</el-button>
        <el-button round type="primary" @click="btnSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
