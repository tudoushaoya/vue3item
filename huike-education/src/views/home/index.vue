<script setup>
import { onMounted, ref } from 'vue'
defineOptions({ name: 'homePage' })
import * as echarts from 'echarts'
import {
  getBaseData,
  getTodayBriefing,
  getTodoList,
  getSalesFunnel,
  getClueConversion,
  getBusinessConversion
} from '@/api/home'
import { useRouter } from 'vue-router'
const router = useRouter()
const timeDate = ref(['2023-06-18', '2023-07-18'])

const paramsTime = ref({
  beginTime: timeDate.value[0],
  endTime: timeDate.value[1]
})
//获取基础数据
const basicData = ref({})
const basicDataApi = async () => {
  const res = await getBaseData(paramsTime.value)
  basicData.value = res.data
}
//获取今日简报
const TodayBriefing = ref({})
const getTodayBriefingApi = async () => {
  const res = await getTodayBriefing()
  TodayBriefing.value = res.data
}
//获取待办事项
const TodoList = ref({})
const getTodoListApi = async () => {
  const res = await getTodoList()
  TodoList.value = res.data
}
//获取线索转化漏斗
const SalesFunnel = ref({})
const getSalesFunnelApi = async () => {
  const res = await getSalesFunnel(paramsTime.value)
  SalesFunnel.value = res.data
}
//线索转化龙虎榜
const clueRecords = ref([])
const params = ref({
  page: 1,
  size: 7
})
//获取线索转化龙虎榜
const getClueConversionApi = async () => {
  Object.assign(paramsTime.value, params.value)
  const res = await getClueConversion(paramsTime.value)
  clueRecords.value = res.data
  clueRecords.value.forEach((item) => {
    item.clueTransferRate = (item.clueTransferRate * 100).toFixed(2) + '%'
  })
}

// 商机转化龙虎榜
const busiRecords = ref([])
//获取商机转化龙虎榜
const getBusiConversionApi = async () => {
  Object.assign(paramsTime.value, params.value)
  const res = await getBusinessConversion(paramsTime.value)
  busiRecords.value = res.data
  busiRecords.value.forEach((item) => {
    item.nicheTransferRate = (item.nicheTransferRate * 100).toFixed(2) + '%'
  })
  console.log(busiRecords.value)
}

// 线索转化漏斗
const echartsRef = ref(null)
const getEcharts = () => {
  const myChart = echarts.init(echartsRef.value)
  myChart.setOption({
    title: {
      x: 'center'
    },
    tooltip: {
      trigger: 'item'
    },

    calculable: true,

    series: [
      {
        name: '线索',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: [
          { value: 80, name: '线索总数' },
          { value: 80 },
          { value: 60 },
          { value: 40 },
          { value: 20 }
        ]
      }
    ]
  })
}

//搜索
const searchForm = () => {
  paramsTime.value.beginTime = timeDate.value[0]
  paramsTime.value.endTime = timeDate.value[1]
  basicDataApi()
}

//刷新
const reFresh = () => {
  timeDate.value = ['2023-06-18', '2023-07-18']
  paramsTime.value.beginTime = timeDate.value[0]
  paramsTime.value.endTime = timeDate.value[1]
  basicDataApi()
}
onMounted(() => {
  basicDataApi()
  getTodayBriefingApi()
  getTodoListApi()
  getSalesFunnelApi()
  getClueConversionApi()
  getBusiConversionApi()
  getEcharts()
})
</script>
<template>
  <div>
    <el-card>
      <!-- 搜索 -->
      <el-form :inline="true">
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="timeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 300px"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round @click="searchForm">搜索</el-button>
          <el-button type="info" round icon="RefreshRight" @click="reFresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 基础数据 -->
    <div class="box">
      <span class="card-title">基础数据</span>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-card>
            <div class="left">
              <span>线索数量</span>
              <span>{{ basicData.clueCount }}</span>
            </div>
            <div class="right">
              <img src="../../assets/home/编组 23(1).png" alt="" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="left">
              <span>商机数量</span>
              <span>{{ basicData.nicheCount }}</span>
            </div>
            <div class="right">
              <img src="../../assets/home/编组 5.png" alt="" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="left">
              <span>客户数量</span>
              <span>{{ basicData.customCount }}</span>
            </div>
            <div class="right">
              <img src="../../assets/home/编组 4.png" alt="" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="left">
              <span>销售数量</span>
              <span>{{ basicData.salesAmount }}</span>
            </div>
            <div class="right">
              <img src="../../assets/home/编组 3.png" alt="" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 今日简报 -->
    <div class="box">
      <span class="card-title">今日简报</span>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-card>
            <div class="left">
              <span>今日新增线索</span>
              <span>{{ TodayBriefing.todayNewClueCount }}</span>
            </div>
            <div class="right">
              <img src="../../assets/home/编组 23.png" alt="" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="left">
              <span>今日新增商机</span>
              <span>{{ TodayBriefing.todayNewNicheCount }}</span>
            </div>
            <div class="right">
              <img src="../../assets/home/编组 4(1).png" alt="" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="left">
              <span>今日新增客户</span>
              <span>{{ TodayBriefing.todayNewCustomCount }}</span>
            </div>
            <div class="right">
              <img src="../../assets/home/编组 3(1).png" alt="" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="left">
              <span>今日销售额</span>
              <span>{{ TodayBriefing.todayNewSalesAmount }}</span>
            </div>
            <div class="right">
              <img src="../../assets/home/编组 3(1).png" alt="" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 待办事项  线索转化漏斗 -->
    <div class="line-box">
      <!-- 待办事项 -->
      <div class="box">
        <span class="card-title">待办事项</span>
        <el-row :gutter="24" style="margin-bottom: 20px">
          <el-col :span="24">
            <el-card @click="router.push('/clue')">
              <div class="left">
                <span>待跟进线索</span>
                <span>{{ TodoList.unFollowClueCount }}</span>
              </div>
              <div class="right">
                <img src="../../assets/home/转派(1).png" alt="" />
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-card @click="router.push('/business')">
              <div class="left">
                <span>待跟进商机</span>
                <span>{{ TodoList.unFollowNicheCount }}</span>
              </div>
              <div class="right">
                <img src="../../assets/home/商机记录.png" alt="" />
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card @click="router.push('/clue')">
              <div class="left">
                <span>待分配线索</span>
                <span>{{ TodoList.unShareClueCount }}</span>
              </div>
              <div class="right">
                <img src="../../assets/home/编组 7.png" alt="" />
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 20px">
          <el-col :span="24">
            <el-card @click="router.push('/business')">
              <div class="left">
                <span>待分配商机</span>
                <span>{{ TodoList.unShareNicheCount }}</span>
              </div>
              <div class="right">
                <img src="../../assets/home/形状.png" alt="" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <!-- 线索转化漏斗 -->
      <div class="line-change">
        <span class="card-title">线索转化漏斗</span>
        <el-card>
          <div class="echarts-box">
            <div class="echarts1" ref="echartsRef"></div>
            <div class="echarts-box-right">
              <div class="left">
                <div>
                  <span>有效线索转化率</span>&nbsp;&nbsp;
                  <span>{{ SalesFunnel.clueTransferRate }}</span>
                </div>
                <div>
                  <span>商机转化率</span>&nbsp;&nbsp;
                  <span>{{ SalesFunnel.nicheTransferRate }}</span>
                </div>
                <div>
                  <span>客户转化率</span>&nbsp;&nbsp;
                  <span>{{ SalesFunnel.customerTransferRate }}</span>
                </div>
              </div>
              <div class="right">
                <div>
                  <span>有效线索数</span>&nbsp;&nbsp;
                  <span>{{ SalesFunnel.validClueCount }}</span>
                </div>
                <div>
                  <span>商机数</span>&nbsp;&nbsp;
                  <span>{{ SalesFunnel.nicheCount }}</span>
                </div>
                <div>
                  <span>客户数</span>&nbsp;&nbsp;
                  <span>{{ SalesFunnel.customerCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 线索转化龙虎榜 商机转化龙虎榜 -->
    <div class="line-box">
      <div class="box">
        <span class="card-title">线索转化龙虎榜</span>
        <el-table :data="clueRecords" style="width: 100%">
          <template #empty v-if="!clueRecords.length">
            <el-empty
              image="https://rzzt-1317097641.cos.ap-chengdu.myqcloud.com/empty.png"
              description="暂无数据"
            ></el-empty>
          </template>
          <el-table-column type="index" :index="1" label="排名" width="100px" />
          <el-table-column prop="userName" label="用户姓名" />
          <el-table-column prop="dept" label="部门" />
          <el-table-column prop="validClueCount" sortable label="线索转化数(个)" />
          <el-table-column prop="clueTransferRate" sortable label="线索转化占比(%)" />
        </el-table>
      </div>
      <div class="box">
        <span class="card-title">商机转化龙虎榜</span>
        <el-table :data="busiRecords">
          <template #empty v-if="!busiRecords.length">
            <el-empty
              image="https://rzzt-1317097641.cos.ap-chengdu.myqcloud.com/empty.png"
              description="暂无数据"
            ></el-empty>
          </template>
          <el-table-column type="index" :index="1" label="排名" width="100px" />
          <el-table-column prop="userName" label="用户姓名" />
          <el-table-column prop="dept" label="部门" />
          <el-table-column prop="validNicheCount" sortable label="商机转化数(个)" />
          <el-table-column prop="nicheTransferRate" sortable label="商机转化占比(%)" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  margin-top: 20px;
  .el-card {
    cursor: pointer;
  }
  .card-title {
    display: block;
    margin-bottom: 20px;
    font-size: 14px;
  }
  :deep(.el-card__body) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      flex-direction: column;
      span:nth-child(1) {
        display: block;
        font-size: 14px;
        color: #999999;
        margin-bottom: 5px;
      }
    }
  }
}
.line-box {
  display: flex;
  .box {
    flex: 1;
    margin-right: 10px;
  }
  .line-change {
    flex: 1;
    margin-top: 20px;
    margin-left: 10px;
    .card-title {
      display: block;
      margin-bottom: 20px;
      font-size: 14px;
    }
    :deep(.el-card__body) {
      text-align: center;
    }
    .echarts-box {
      display: flex;
    }
    .echarts-box-right {
      color: #d0d0d0;
      font-size: 12px;
      display: flex;
      margin-top: 150px;
      span:nth-child(1) {
        display: inline-block;
        margin-bottom: 10px;
      }
      span:nth-child(2) {
        color: #333333;
      }
      .left {
        margin-right: 20px;
      }
    }
    .echarts1 {
      width: 254px;
      height: 242px;
    }
  }
}
</style>
