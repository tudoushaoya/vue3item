<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getBuildings, uploadContractFile, addContract } from '@/api/enterprise'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import { message } from 'ant-design-vue'
defineOptions({ name: 'add-dialog' })
const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },
  currentId: {
    type: Number,
    default: null
  },
  renewData: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:showDialog', 'addSuccess'])
const options = ref([]) //楼宇下拉框
// 合同弹窗数据
const dialogData = reactive({
  buildingId: null, //楼宇id
  timeAll: [],
  startTime: '',
  endTime: '',
  contractUrl: '', //合同地址
  contractId: null, //合同id
  type: 0,
  enterpriseId: null //企业id
})
const formRef = ref(null)
//上传前的回调
const handleBeforeUpload = (file) => {
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('文件大小不能超过5M')
  }
  return false
}
const changeTime = (value) => {
  dialogData.timeAll = value
  dialogData.endTime = value[1]
}
// 上传合同
const updateContract = async (file) => {
  console.log(file.file)
  const formData = new FormData()
  formData.append('file', file.file)
  formData.append('type', 'contract')
  const res = await uploadContractFile(formData)
  console.log(res.data.id)
  dialogData.contractId = res.data.id
  dialogData.contractUrl = res.data.url
  console.log(dialogData)
}
// 获取可租赁楼宇
const getBuildingsData = async () => {
  const res = await getBuildings()
  options.value = res.data
  console.log(options.value)
}

//日期不可选
const disabledDate = (current) => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return current && current < yesterday
}
//  取消
const handleCancel = () => {
  emit('update:showDialog', false)
  formRef.value?.resetFields()
}
const handleEdit = (record) => {
  console.log(record)
  dialogData.buildingId = record.buildingId
  dialogData.buildingName = record.buildingName
  const currentDate = new Date(record.endTime)
  currentDate.setDate(currentDate.getDate() + 1)
  const date = new Date(currentDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`
  dialogData.timeAll = [formattedDate, '']
  dialogData.startTime = formattedDate
  console.log(formattedDate)
  console.log(dialogData)
}
//回显操作
defineExpose({
  handleEdit
})

//移除文件
const removeContract = () => {
  dialogData.contractId = null
  dialogData.contractUrl = ''
}

//  提交添加合同
const onFinish = async (values) => {
  if (props.isEdit) {
    //编辑
    values.buildingId = dialogData.buildingId
    values.startTime = dialogData.startTime
    values.endTime = dialogData.endTime
    values.contractId = dialogData.contractId
    values.contractUrl = dialogData.contractUrl
    values.enterpriseId = props.currentId
    delete values.timeAll
    console.log(values)
    const res = await addContract({ ...values, enterpriseId: props.currentId, type: 1 })
    if (res.code === 10000) {
      message.success('添加成功')
    }
  } else {
    values.startTime = dialogData.timeAll[0]
    values.endTime = dialogData.timeAll[1]
    values.contractId = dialogData.contractId
    delete values.timeAll
    console.log(values)
    const res = await addContract({ ...values, enterpriseId: props.currentId, type: 0 })
    console.log(res)
    if (res.code === 10000) {
      message.success('添加成功')
    }
  }
  removeContract()
  emit('addSuccess')
  handleCancel()
}

onMounted(() => {
  getBuildingsData()
})
</script>
<template>
  <div>
    <a-modal
      @cancel="handleCancel"
      :visible="props.showDialog"
      :title="props.isEdit ? '续租合同' : '添加合同'"
      :footer="null"
      bodyStyle="padding: 20px 100px"
    >
      <!-- 租赁楼宇 -->
      <a-form layout="vertical" :model="dialogData" ref="formRef" @finish="onFinish">
        <a-form-item
          label="租赁楼宇"
          name="buildingId"
          style="width: 290px"
          :rules="[{ required: true, message: '请选择租赁的楼宇', trigger: 'change' }]"
        >
          <a-select
            v-if="!props.isEdit"
            v-model:value="dialogData.buildingId"
            :options="options"
            :field-names="{ label: 'name', value: 'id' }"
            placeholder="请选择租赁的楼宇"
          >
          </a-select>
          <a-input v-else v-model:value="dialogData.buildingName" disabled></a-input>
        </a-form-item>
        <!-- 租赁起止日期 -->
        <a-form-item
          label="租赁起止日期"
          name="timeAll"
          :rules="[
            { required: true, message: '请选择租赁的起止日期', trigger: 'blur', type: 'array' }
          ]"
        >
          <a-range-picker
            v-if="!props.isEdit"
            v-model:value="dialogData.timeAll"
            @change="changeTime"
            value-format="YYYY-MM-DD"
            :locale="locale"
            :disabledDate="disabledDate"
          />
          <a-range-picker
            v-else
            v-model:value="dialogData.timeAll"
            @change="changeTime"
            value-format="YYYY-MM-DD"
            :locale="locale"
            :disabled="[true, false]"
          />
        </a-form-item>
        <!-- 租赁合同 -->
        <a-form-item
          label="租赁合同"
          name="contractUrl"
          :rules="[{ required: true, message: '请选择租赁合同', trigger: 'blur' }]"
        >
          <a-upload
            accept=".doc, .docx ,.pdf"
            :beforeUpload="handleBeforeUpload"
            @change="updateContract"
            @remove="removeContract"
          >
            <a-button
              type="link"
              :disabled="dialogData.contractId ? true : false"
              style="background-color: #edf5ff; border-radius: 5px"
            >
              <upload-outlined />
              上传文件
            </a-button>
            <!-- <a-tag v-else color="success">
              <template #icon>
                <check-circle-outlined />
              </template>
              success
            </a-tag> -->
            <!-- <template #previewIcon><eye-two-tone /></template>
            <template #removeIcon><delete-two-tone /></template> -->
          </a-upload>
        </a-form-item>
        <a-form-item-extra style="color: #00000073"
          >支持扩展名：.doc .docx .pdf 文件大小不得超过5M</a-form-item-extra
        >
        <a-form-item style="text-align: right; margin-top: 80px">
          <a-space>
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary" html-type="submit">确定</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style></style>
