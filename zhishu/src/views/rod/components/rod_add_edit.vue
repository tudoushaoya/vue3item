<script setup>
defineOptions({
  name: 'RodAddEdit'
})
import { reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import { itemAdd, itemEdit } from '@/api/rod'
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  visible: {
    type: Boolean,
    default: false
  },
  current: {
    type: Object,
    default: null
  }
})

const formDate = reactive({
  id: null,
  poleName: '蒲谋哲',
  poleNumber: '333',
  poleIp: '172.16.39.111',
  areaId: null,
  poleType: null
})
const emit = defineEmits(['update:visible', 'add'])

const onfinish = async (value) => {
  if (props.current.id) {
    // 编辑接口
    await itemEdit({ ...value, id: props.current.id })
    message.success('编辑成功')
    emit('update:visible', false)
  } else {
    // 新增接口
    console.log(value)
    await itemAdd(value)
    message.success('添加成功')
    formDate.poleName = ''
    formDate.poleNumber = ''
    formDate.poleIp = ''
    formDate.areaId = null
    formDate.poleType = null
  }

  emit('update:visible', false)
  emit('add')
}

// 监听当前编辑的数据
watch(
  () => props.current,
  () => {
    if (props.current) {
      formDate.id = props.current.id
      formDate.poleName = props.current.poleName
      formDate.poleNumber = props.current.poleNumber
      formDate.poleIp = props.current.poleIp
      formDate.areaId = props.current.areaId
      formDate.poleType = props.current.poleType
      console.log(formDate)
    }
  }
)
// 通知父组件关闭弹窗
const onCancel = () => {
  emit('update:visible', false)
}
</script>
<template>
  <a-modal
    v-model:visible="props.visible"
    :title="props.current.id ? '编辑一体杆' : '添加一体杆'"
    :confirm-loading="confirmLoading"
    :footer="null"
    @cancel="onCancel"
  >
    <a-form layout="vertical" @finish="onfinish" :model="formDate">
      <a-form-item
        label="一体杆名称"
        name="poleName"
        :rules="[
          { required: true, message: '请输入一体杆名称', trigger: 'blur' },

          {
            min: 2,
            max: 30,
            message: '最大不能超过30字符',
            trigger: 'blur'
          }
        ]"
      >
        <a-input placeholder="请输入一体杆名称" v-model:value="formDate.poleName"></a-input>
      </a-form-item>

      <a-form-item
        label="一体杆编号"
        name="poleNumber"
        :rules="[
          { required: true, message: '请输入一体杆编号', trigger: 'blur' },
          {
            min: 2,
            max: 13,
            message: '最大不能超过30字符',
            trigger: 'blur'
          }
        ]"
      >
        <a-input placeholder="请输入一体杆编号" v-model:value="formDate.poleNumber"></a-input>
      </a-form-item>
      <a-form-item
        label="一体杆IP"
        name="poleIp"
        :rules="[
          { required: true, message: '请输入一体杆编号', trigger: 'blur' },
          {
            pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
            message: '请输入正确的IP',
            trigger: 'blur'
          }
        ]"
      >
        <a-input placeholder="请输入一体杆IP" v-model:value="formDate.poleIp"></a-input>
      </a-form-item>

      <a-form-item
        label="关联区域"
        name="areaId"
        :rules="[{ required: true, message: '请输入一体杆编号', trigger: 'blur' }]"
      >
        <a-select placeholder="请输入关联区域" v-model:value="formDate.areaId">
          <a-select-option v-for="item in props.list" :key="item.id">{{
            item.areaName
          }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="一体杆类型"
        name="poleType"
        :rules="[{ required: true, message: '请输入一体杆类型', trigger: 'blur' }]"
      >
        <a-select v-model:value="formDate.poleType" placeholder="请输入一体杆类型">
          <a-select-option value="export">出口</a-select-option>
          <a-select-option value="entrance">入口</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-space style="display: flex; justify-content: flex-end">
          <a-button @click="onCancel">取消</a-button>
          <a-button type="primary" html-type="submit">确认</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped></style>
