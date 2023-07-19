<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getTenantList, getBuildingList, addProperty } from '@/api/propety'
import moment from 'moment'
// import { addRegion, editRegion } from '@/api/region'
import { message } from 'ant-design-vue'
// watch(
//   () => props.showDialog,
//   (newVal) => {
//     if (newVal) {
//       dataEcho()
//     }
//   }
// )
// 租客列表
const tenantList = reactive([])
// 楼宇列表
const buildingList = reactive([])
// 时间
// const value2 = ref([
//   {
//     $d: ''
//   },
//   {
//     $d: ''
//   }
// ]) // 开始时间和结束时间

onMounted(async () => {
  const res = await getTenantList()
  tenantList.push(...res.data)
  const res1 = await getBuildingList()
  buildingList.push(...res1.data)
})
const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },

  formitem: {
    type: Object
  }
})

const formData = reactive({
  enterpriseId: null, // 租户id
  buildingId: null, // 楼宇id
  value2: null, // 缴费周期
  startTime: '', // 缴费开始时间
  endTime: '', // 缴费结束时间
  paymentAmount: null, // 付款总额
  paymentMethod: null // 付款方式
})

// formData.startTime = moment(moment(formData.value2.value[0].$d).toDate()).format('YYYY-MM-DD')
// formData.endTime = moment(moment(formData.value2.value[1].$d).toDate()).format('YYYY-MM-DD')
// console.log(formData)

const formRef = ref(null)
const emit = defineEmits(['update:showDialog', 'addSuccess'])
const btnCancel = () => {
  formRef.value.resetFields() // 重置表单
  emit('update:showDialog', false)
}
const onFinish = async (values) => {
  const params = {
    enterpriseId: values.enterpriseId,
    buildingId: values.buildingId,
    startTime: moment(moment(values.value2[0].$d).toDate()).format('YYYY-MM-DD'),
    endTime: moment(moment(values.value2[1].$d).toDate()).format('YYYY-MM-DD'),
    paymentAmount: values.paymentAmount,
    paymentMethod: values.paymentMethod
  }
  const res = await addProperty(params)
  console.log(res)
  message.success('添加成功')
  emit('addSuccess')
  btnCancel()
}
</script>
<template>
  <a-modal title="添加账单" :visible="props.showDialog" :footer="null" @cancel="btnCancel">
    <a-form :model="formData" :label-col="{ span: 6 }" ref="formRef" @finish="onFinish">
      <a-form-item
        label="选择租户"
        name="enterpriseId"
        :rules="[{ required: true, message: '租户不能为空', trigger: 'blur' }]"
      >
        <a-select
          v-model:value="formData.enterpriseId"
          placeholder="请选择租户"
          :options="tenantList"
          :field-names="{ label: 'name', value: 'id' }"
          >@
        </a-select>
      </a-form-item>
      <a-form-item
        label="租货楼宇"
        name="buildingId"
        :rules="[{ required: true, message: '租货楼宇不能为空', trigger: 'blur' }]"
      >
        <a-select
          v-model:value="formData.buildingId"
          placeholder="请选择租货楼宇"
          :options="buildingList"
          :field-names="{ label: 'name', value: 'id' }"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="缴费周期" name="value2">
        <a-space direction="vertical" :size="20">
          <a-range-picker v-model:value="formData.value2" />
        </a-space>
      </a-form-item>
      <a-form-item label="支付金额" name="paymentAmount">
        <a-input v-model:value="formData.paymentAmount" placeholder="请输入支付金额"></a-input>
      </a-form-item>
      <a-form-item
        label="支付方式"
        name="paymentMethod"
        :rules="[{ required: true, message: '支付方式不能为空', trigger: 'blur' }]"
      >
        <a-select v-model:value="formData.paymentMethod" placeholder="请选择支付方式">
          <a-select-option value="1">微信</a-select-option>
          <a-select-option value="2">支付宝</a-select-option>
          <a-select-option value="3">现金</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-row justify="center" style="margin-top: 10px">
          <a-space>
            <a-button type="primary" html-type="submit">确定</a-button>
            <a-button @click="btnCancel">取消</a-button>
          </a-space>
        </a-row>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
