<script setup>
import { getWorkbenchData } from '@/api/workbench'
import { defineOptions, onMounted, ref, toRef } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { useRouter } from 'vue-router'
const router = useRouter()
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
defineOptions({
  name: 'workbenchPage'
})
const dataSource = ref([])
const columns = ref([
  {
    title: '序号',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '企业名称',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '租赁楼宇',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '租赁时间',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '操作',
    dataIndex: 'address',
    key: 'address'
  }
])
const data = toRef({
  labels: [],
  datasets: [
    { data: [], label: '物业费', backgroundColor: '#3656ff', barThickness: 25 },
    { data: [], label: '行车收入', backgroundColor: '#cde4ff', barThickness: 25 }
  ],
  loaded: false
})
const options = ref({
  responsive: true,
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  },
  plugins: {
    title: {
      display: true,
      text: '年度收入统计',
      position: 'top',
      align: 'start',
      font: {
        size: 15
      }
    },
    legend: {
      display: true,
      position: 'right',
      align: 'start',
      labels: {
        color: '#909399',
        fontSize: 12
      }
    },
    tooltip: {
      displayColors: false,
      callbacks: {
        title: () => '', // 禁用默认的标题显示
        label: (context) => {
          const dataIndex = context.dataIndex
          const propertyValue = data.value.datasets[0].data[dataIndex]
          const carIncomeValue = data.value.datasets[1].data[dataIndex]
          const totalIncome = propertyValue + carIncomeValue
          return [
            `总收入: ${totalIncome}`,
            `物业费: ${propertyValue}`,
            `行车收入: ${carIncomeValue}`
          ]
        }
      }
    }
  }
})
const workbenchData = ref([])

const getWorkbenchDataAPI = async () => {
  const res = await getWorkbenchData()
  workbenchData.value = res.data
  data.value.labels = res.data.annualIncomeArray.xmonth
  data.value.datasets[0].data = res.data.annualIncomeArray.ybuilding
  data.value.datasets[1].data = res.data.annualIncomeArray.yparking
  data.value.loaded = true
}

onMounted(() => {
  getWorkbenchDataAPI()
})
</script>
<template>
  <div class="app-container main" style="background-color: #f4f6f8">
    <div style="display: flex; justify-content: space-between">
      <div class="left-top">
        <div>园区数据</div>
        <div style="display: flex; justify-content: space-between">
          <div>
            <p>年度累计收费（元）</p>
            <span>{{ workbenchData.annualIncome }}</span>
          </div>
          <div>
            <p>月度累计收费（元）</p>
            <span>{{ workbenchData.enterpriseTotal }}</span>
          </div>
          <div>
            <p>本月收费（元）</p>
            <span>{{ workbenchData.monthCardTotal }}</span>
          </div>
          <div>
            <p>本月收费（元）</p>
            <span>{{ workbenchData.chargePoleTotal }}</span>
          </div>
        </div>
      </div>
      <div class="right-top">
        <div>快捷入口</div>
        <div style="display: flex; justify-content: space-between">
          <div class="right-top-mid" @click="router.push('/park/enterprise/add')">
            <img src="../../assets/add-enterprise.png" alt="" />
            <div>添加企业</div>
          </div>
          <div class="right-top-mid" @click="router.push('/system/employee')">
            <img src="../../assets/employee-manage.png" alt="" />
            <div>员工管理</div>
          </div>
          <div class="right-top-mid">
            <img src="../../assets/add-bill.png" alt="" />
            <div>添加账单</div>
          </div>
          <div class="right-top-mid">
            <img src="../../assets/data-screen.png" alt="" />
            <div>数据大屏</div>
          </div>
        </div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between">
      <div class="left-mid">
        <Bar v-if="data.loaded" :data="data" :options="options" style="width: 100%; height: 100%" />
      </div>
      <div class="right-mid">
        <div>设备告警派单</div>
        <a-empty />
        <a-button type="primary" shape="round" size="large" class="right-mid-button">
          <span>更多</span>
          <RightOutlined />
        </a-button>
      </div>
    </div>
    <div class="left-bottom">
      <div>临期合同提醒</div>
      <a-table :dataSource="dataSource" :columns="columns"></a-table>
    </div>
  </div>
</template>

<style scoped lang="less">
img {
  width: 44px;
  height: 44px;
}
.right-top {
  width: 28.5%;
  height: 155px;
  background-color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .right-top-mid {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    div {
      margin-top: 10px;
      font-size: 12px;
    }
  }
}
.left-top {
  width: 70%;
  height: 155px;
  background-color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  p {
    color: #909399;
  }
}
.left-mid {
  width: 70%;
  height: 382px;
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
}
.right-mid {
  width: 28.5%;
  height: 304px;
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .right-mid-button {
    width: 100%;
    span {
      font-size: 14px;
    }
  }
}
.left-bottom {
  width: 70%;
  height: 304px;
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
}
span {
  font-size: 24px;
  font-weight: 700;
}
</style>
