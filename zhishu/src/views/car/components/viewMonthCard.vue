<script setup>
defineOptions({ name: 'managePage' })
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { viewDetail } from '@/api/card.js'
const router = useRouter()
const route = useRoute()

const formDate = ref({
  personName: '',
  phoneNumber: '',
  carNumber: null,
  carBrand: ''
})
const columns = [
  {
    title: '序号',
    dataIndex: 'id'
  },

  {
    title: '有效时间',
    dataIndex: 'rechargeList'
  },
  {
    title: '支付金额',
    dataIndex: 'paymentAmount'
  },

  {
    title: '支付方式',
    dataIndex: 'paymentMethod'
  },
  {
    title: '办理时间',
    dataIndex: 'createTime'
  },
  {
    title: '办理人',
    dataIndex: 'createUser'
  }
]
const data = ref([])
onMounted(async () => {
  const res = await viewDetail(route.params.id)
  console.log(res)
  formDate.value = res.data
  data.value = res.data.rechargeList
  data.value.forEach((item, index) => {
    item.id = index + 1
  })
  data.value.forEach((item) => {
    item.rechargeList = item.cardStartDate + '至' + item.cardEndDate
  })
  data.value.forEach((item) => {
    if (item.paymentMethod === 'Alipay') {
      item.paymentMethod = '支付宝'
    } else if (item.paymentMethod === 'WeChat') {
      item.paymentMethod = '微信'
    } else {
      item.paymentMethod = '人工'
    }
  })
})
</script>

<template>
  <div class="contain">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="返回"
      sub-title="查看详情"
      @back="() => router.go(-1)"
    />
    <a-form :model="formDate" @finish="onfinish">
      <a-layout class="layout">
        <a-layout-content>
          <!-- 车辆信息 -->
          <a-card title="车辆信息">
            <a-row>
              <a-col :span="12"
                ><a-form-item label="车主姓名" name="personName">
                  {{ formDate.personName }}
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="联系方式" name="phoneNumber">
                  {{ formDate.phoneNumber }}
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="12"
                ><a-form-item label="车牌号码" name="carNumber"
                  >{{ formDate.carNumber }}
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="车辆品牌" name="carBrand">
                  {{ formDate.carBrand }}
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
          <!-- 月卡缴费信息 -->
          <a-card title="月卡缴费信息">
            <a-table :dataSource="data" :columns="columns" />
          </a-card>
        </a-layout-content>
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
  }
}
</style>
