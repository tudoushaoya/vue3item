<script setup>
defineOptions({ name: 'managePage' })
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getDetail, renewCard } from '@/api/card.js'
import { message } from 'ant-design-vue'
const router = useRouter()
const route = useRoute()

const formDate = ref({
  carInfoId: 0,
  personName: '',
  phoneNumber: '',
  carNumber: null,
  carBrand: '',
  dataAll: [],
  cardStartDate: '',
  cardEndDate: '',
  paymentAmount: '',
  paymentMethod: null
})

const changeTime = (values) => {
  console.log(values)
  formDate.value.cardStartDate = values[0]
  formDate.value.cardEndDate = values[1]
}

const carID = ref(0)
// 提交表单校验
const onfinish = async (values) => {
  values.cardStartDate = formDate.value.cardStartDate
  values.cardEndDate = formDate.value.cardEndDate
  delete values.dataAll
  delete values.personName
  delete values.phoneNumber
  delete values.carNumber
  delete values.carBrand
  const res = await renewCard({ ...values, carInfoId: carID.value })
  console.log(res)
  message.success('续费成功')
  router.push('/car/monthCard')
}

const newGetDetail = async () => {
  const {
    data: { carBrand, carInfoId, carNumber, personName, phoneNumber, rechargeList }
  } = await getDetail(route.params.id)
  formDate.value.carBrand = carBrand
  carID.value = carInfoId
  formDate.value.carNumber = carNumber
  formDate.value.personName = personName
  formDate.value.phoneNumber = phoneNumber
  console.log(rechargeList[0].cardEndDate)
  const dateString = rechargeList[0].cardEndDate
  const date = new Date(dateString)
  date.setDate(date.getDate() + 1)

  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)

  const formattedDate = `${year}-${month}-${day}`
  console.log(formattedDate)
  formDate.value.dataAll[0] = formattedDate
}
onMounted(() => {
  newGetDetail()
})
</script>

<template>
  <div class="contain">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="返回"
      sub-title="月卡续费"
      @back="() => router.go(-1)"
    />
    <a-form :model="formDate" @finish="onfinish">
      <a-layout class="layout">
        <a-layout-content>
          <!-- 车辆信息 -->
          <a-card title="车辆信息">
            <a-row>
              <a-col :span="12"
                ><a-form-item
                  label="车主姓名"
                  name="personName"
                  :rules="[{ required: true, message: '请输入车主姓名!', trigger: 'blur' }]"
                >
                  <a-input
                    placeholder="请输入车主姓名"
                    v-model:value="formDate.personName"
                    disabled
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="联系方式"
                  name="phoneNumber"
                  :rules="[
                    { required: true, message: '请输入联系方式!', trigger: 'blur' },
                    { min: 11, max: 11, message: '请输入11位手机号码!', trigger: 'blur' }
                  ]"
                >
                  <a-input
                    placeholder="请输入联系方式"
                    disabled
                    v-model:value="formDate.phoneNumber"
                  ></a-input>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="12"
                ><a-form-item
                  label="车牌号码"
                  name="carNumber"
                  :rules="[
                    { required: true, message: '请输入车牌号码!', trigger: 'blur' },
                    { min: 7, max: 7, message: '请输入7位车牌号码!', trigger: 'blur' }
                  ]"
                >
                  <a-input
                    placeholder="请输入车牌号码"
                    v-model:value="formDate.carNumber"
                    disabled
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="车辆品牌"
                  name="carBrand"
                  :rules="[{ required: true, message: '请输入车辆品牌!', trigger: 'blur' }]"
                >
                  <a-input
                    placeholder="请输入车辆品牌"
                    v-model:value="formDate.carBrand"
                    disabled
                  ></a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
          <!-- 月卡缴费信息 -->
          <a-card title="月卡缴费信息">
            <a-row>
              <a-col :span="12"
                ><a-form-item
                  label="有效日期"
                  name="dataAll"
                  :rules="[
                    {
                      required: true,
                      message: '请输入有效日期!',
                      trigger: ['blur'],
                      type: 'array'
                    }
                  ]"
                >
                  <a-space direction="vertical" :size="12">
                    <a-range-picker
                      v-model:value="formDate.dataAll"
                      value-format="YYYY-MM-DD"
                      @change="changeTime"
                      :disabled="[true, false]"
                    />
                  </a-space>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="支付金额"
                  name="paymentAmount"
                  :rules="[{ required: true, message: '请输入支付金额!', trigger: 'blur' }]"
                >
                  <a-input
                    placeholder="请输入支付金额"
                    v-model:value="formDate.paymentAmount"
                  ></a-input>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="12"
                ><a-form-item
                  label="支付方式"
                  name="paymentMethod"
                  :rules="[{ required: true, message: '请选择支付方式!', trigger: 'blur' }]"
                >
                  <a-select
                    v-model:value="formDate.paymentMethod"
                    placeholder="请选择支付方式"
                    style="width: 403px"
                  >
                    <a-select-option value="Alipay">支付宝</a-select-option>
                    <a-select-option value="WeChat">微信</a-select-option>
                    <a-select-option value="Cash">线下</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12"> </a-col>
            </a-row>
          </a-card>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          <a-space>
            <a-button>重置</a-button>
            <a-button type="primary" html-type="submit">提交</a-button>
          </a-space>
        </a-layout-footer>
      </a-layout>
    </a-form>
  </div>
</template>

<style lang="less" scoped>
.contain {
  height: 890px;
  background: #f0f2f5;
  .ant-page-header-ghost {
    background: #fff !important;
  }
  .layout {
    margin: 20px auto;
    width: 1277px;
    background: #fff;
    // margin-top: 20px;
    .ant-input {
      width: 410px;
    }
  }
}
</style>
