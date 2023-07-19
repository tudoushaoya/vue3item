<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import {
  getParkingRulesApi,
  addParkingRulesApi,
  editParkingRulesApi,
  getParkingRulesDetailApi,
  deleteParkingRulesApi
} from '../../api/car'
import { message } from 'ant-design-vue'
import ModalCancel from './cancel.vue'
defineOptions({ name: 'billingPage' })

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    customRender: ({ index }) => {
      return index + 1 + (searchParams.value.page - 1) * searchParams.value.pageSize
    }
  },
  {
    title: '计费规则编号',
    dataIndex: 'ruleNumber'
  },
  {
    title: '计费规则名称',
    dataIndex: 'ruleName'
  },
  {
    title: '免费时长(分钟)',
    dataIndex: 'freeDuration'
  },
  {
    title: '收费上限(元)',
    dataIndex: 'chargeCeiling',
    customRender: ({ record }) => {
      return record.chargeCeiling ? record.chargeCeiling : '--'
    }
  },
  {
    title: '计费方式',
    key: 'chargeType',
    dataIndex: 'chargeType',
    customRender: ({ record }) => {
      switch (record.chargeType) {
        case 'partition':
          return '分段计费'
        case 'turn':
          return '按次计费'
        case 'duration':
          return '时长收费'
      }
    }
  },
  {
    title: '计费规则',
    dataIndex: 'ruleNameView'
  },
  {
    title: '操作',
    key: 'action'
  }
]

const data = ref([])
const total = ref()
const loading = ref(false)
const getTableData = async () => {
  loading.value = true
  const res = await getParkingRulesApi()
  data.value = res.data.rows
  total.value = res.data.total
  loading.value = false
}

onMounted(() => {
  getTableData()
})

const searchParams = ref({
  carNumber: '',
  paymentStatus: '',
  page: 1,
  pageSize: 10
})

const pagination = ref({
  current: searchParams.value.page,
  pageSize: searchParams.value.pageSize,
  total,
  showSizeChanger: true,
  showTotal: (total) => `共 ${total} 条`
})

// 弹框
const formvisible = ref(false)
const edit = ref(false)
const title = computed(() => {
  return edit.value ? '编辑计费规则' : '新增计费规则'
})
const formRef = ref(null)

const modalLoading = ref(false)
const showModal = async (val = 0) => {
  edit.value = false
  formState.value = {}
  formState.value.chargeType = 'duration'
  formvisible.value = true
  if (val) {
    edit.value = true
    modalLoading.value = true
    const res = await getParkingRulesDetailApi(val.id)
    formState.value = res.data
    modalLoading.value = false
  }
}

watch(formvisible, (val) => {
  if (!val) {
    formRef.value.clearValidate()
  }
})
// 弹框表格数据
// const formState = ref({
//   id: '',
//   ruleNumber: '',
//   ruleName: '',
//   chargeType: 'duration',
//   freeDuration: '',
//   chargeCeiling: '',
//   durationTime: '',
//   durationType: '',
//   durationPrice: '',
//   turnPrice: '',
//   partitionFrameTime: '',
//   partitionFramePrice: '',
//   partitionIncreaseTime: '',
//   partitionIncreasePrice: '',
//   ruleNameView: ''
// })

const formState = ref({})

const onFinish = async (values) => {
  console.log('Success:', values)
  const obj = formState.value
  delete obj.ruleNameView
  edit.value ? await editParkingRulesApi(obj) : await addParkingRulesApi(obj)
  formvisible.value = false
  getTableData().then(() => {
    message.success('操作成功')
  })
}

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

// 取消弹框
const cancelModal = () => {
  formvisible.value = false
}

const delId = ref('')
const cancelVisible = ref(false)
const showCancelModal = (val = 0) => {
  cancelVisible.value = true
  console.log('canelmodal')
  if (val) {
    console.log(val)
    delId.value = val.id
  }
}
</script>
<template>
  <div class="app-container">
    <a-card :bordered="false">
      <template #title>
        <a-space style="font-size: 14px">
          <a-button type="primary" @click="showModal(0)">增加停车计划规则</a-button>
        </a-space>
      </template>
      <a-table :pagination="pagination" :columns="columns" :data-source="data" :loading="loading">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <span>
              <a @click="showModal(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="showCancelModal(record)">删除</a>
            </span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>

  <a-modal :footer="null" v-model:visible="formvisible" :title="title" width="560px">
    <div v-if="modalLoading">
      <a-spin></a-spin>
    </div>

    <a-form
      v-else
      ref="formRef"
      :model="formState"
      name="basic"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 22 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      layout="vertical"
      style="margin-left: 60px"
    >
      <a-form-item
        label="计费规则编号"
        name="ruleNumber"
        :rules="[{ required: true, message: '请输入计费规则编号!' }]"
      >
        <a-input v-model:value="formState.ruleNumber" placeholder="请输入计费规则编号" />
      </a-form-item>

      <a-form-item
        label="计费规则名称"
        name="ruleName"
        :rules="[{ required: true, message: '请输入计费规则名称!' }]"
      >
        <a-input v-model:value="formState.ruleName" placeholder="请输入计费规则名称" />
      </a-form-item>

      <a-form-item
        label="计费方式 (全天收费)"
        name="chargeType"
        :rules="[{ required: true, message: '请输入计费规则名称!' }]"
      >
        <a-radio-group
          v-model:value="formState.chargeType"
          style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10%"
        >
          <a-radio value="duration">时长收费</a-radio>
          <a-radio value="turn">按次计费</a-radio>
          <a-radio value="partition">时长收费</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item>
        <template #label>
          <a-row style="width: 420px">
            <a-col span="12"> <span>免费时长</span> </a-col>
            <a-col span="12">
              <span>收费上限</span>
            </a-col>
          </a-row>
        </template>
        <a-row>
          <a-col span="9">
            <a-form-item name="freeDuration">
              <a-input v-model:value="formState.freeDuration" placeholder="请输入免费时长" />
            </a-form-item>
          </a-col>
          <a-col span="2" style="text-align: center; line-height: 32px; margin: 0 8px"> 分钟</a-col>
          <a-col span="9">
            <a-form-item name="chargeCeiling">
              <a-input v-model:value="formState.chargeCeiling" placeholder="请输入收费上限" />
            </a-form-item>
          </a-col>
          <a-col span="2" style="text-align: center; line-height: 32px; margin-left: 4px">
            分钟</a-col
          >
        </a-row>
      </a-form-item>

      <a-form-item label="计费规则" required>
        <template v-if="formState.chargeType === 'duration'">
          <a-row>
            <span style="margin-right: 10px; line-height: 32px">每</span>

            <a-form-item
              name="durationTime"
              :rules="[{ required: true, message: '请输入计费时间!' }]"
            >
              <a-input-number
                style="width: 120px"
                placeholder="请输入"
                v-model:value="formState.durationTime"
              ></a-input-number>
            </a-form-item>

            <a-form-item
              name="durationType"
              :rules="[{ required: true, message: '请输入计费时间单位!' }]"
              style="margin: 0 10px; width: 100px"
            >
              <a-select placeholder="请选择" v-model:value="formState.durationType">
                <a-select-option value="hour">小时</a-select-option>
                <a-select-option value="minute">分钟</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              name="durationPrice"
              :rules="[{ required: true, message: '请输入计费金额!' }]"
            >
              <a-input-number
                v-model:value="formState.durationPrice"
                style="width: 120px"
                placeholder="请输入"
              ></a-input-number>
            </a-form-item>

            <span style="margin-left: 10px; line-height: 32px">元</span>
          </a-row>
        </template>

        <template v-if="formState.chargeType === 'turn'">
          <a-row>
            <span style="line-height: 32px">每次</span>
            <a-form-item
              style="margin: 0 10px"
              name="turnPrice"
              :rules="[{ required: true, message: '请输入计费金额!' }]"
            >
              <a-input v-model:value="formState.turnPrice" placeholder="请输入金额"></a-input>
            </a-form-item>
            <span style="line-height: 32px">元</span>
          </a-row>
        </template>

        <template v-if="formState.chargeType === 'partition'">
          <a-row>
            <a-form-item
              name="partitionFrameTime"
              :rules="[{ required: true, message: '请输入计费时间!' }]"
            >
              <a-input-number
                placeholder="请输入"
                v-model:value="formState.partitionFrameTime"
              ></a-input-number>
            </a-form-item>
            <span style="line-height: 32px; margin: 0 10px">小时内 , 每小时收费</span>
            <a-form-item
              name="partitionFramePrice"
              :rules="[{ required: true, message: '请输入计费金额!' }]"
            >
              <a-input-number
                placeholder="请输入"
                v-model:value="formState.partitionFramePrice"
              ></a-input-number>
            </a-form-item>
            <span style="line-height: 32px; margin-left: 10px">元</span>
          </a-row>
          <a-row>
            <span style="line-height: 32px; margin-right: 10px">每增加</span>
            <a-form-item
              name="partitionIncreaseTime"
              :rules="[{ required: true, message: '请输入计费时间!' }]"
            >
              <a-input-number
                v-model:value="formState.partitionIncreaseTime"
                placeholder="请输入"
              ></a-input-number
            ></a-form-item>
            <span style="line-height: 32px; margin: 0 10px">小时 , 增加</span>
            <a-form-item
              name="partitionIncreasePrice"
              :rules="[{ required: true, message: '请输入计费金额!' }]"
            >
              <a-input-number
                v-model:value="formState.partitionIncreasePrice"
                placeholder="请输入"
              ></a-input-number>
            </a-form-item>
            <span style="line-height: 32px; margin-left: 10px">元</span>
          </a-row>
        </template>
      </a-form-item>

      <a-form-item style="padding-top: 20px; margin-bottom: 0">
        <a-row justify="end">
          <a-button @click="cancelModal" style="margin-right: 10px">取消</a-button>
          <a-button type="primary" html-type="submit">确定</a-button>
        </a-row>
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 取消框弹窗 -->
  <ModalCancel
    v-model:cancelVisible="cancelVisible"
    :delId="delId"
    :delfn="deleteParkingRulesApi"
    :refreshfn="getTableData"
  ></ModalCancel>
</template>

<style lang="less">
.ant-radio-wrapper {
  border: 1px solid rgb(75, 115, 255);
  padding: 4px 6px;
}
</style>
