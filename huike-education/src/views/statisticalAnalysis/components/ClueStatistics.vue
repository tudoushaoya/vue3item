<script setup>
import { ref, onMounted } from 'vue'
defineOptions({ name: 'ClueStatistics' })
// 图表
import * as echarts from 'echarts'
import { getClueStatisticsList, getClueStatisticsTable } from '@/api/ClueStatistics'
onMounted(() => {
  earchs2()
  getlist()
})
const parms = ref({
  beginTime: '2023-07-01',
  endTime: '2023-07-15'
})
const value2 = ref(['2023-07-01', '2023-07-15'])
const earchs2 = async () => {
  const res = await getClueStatisticsList(parms.value)
  // console.log(res)
  var chartDom = document.querySelector('#datas4')
  var myChart = echarts.init(chartDom)
  var option = {
    color: ['#80FFA5', '#00DDFF'],
    title: {
      text: '线索统计表'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['新增', '总数量']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: res.data.dateList
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '新增',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(128, 255, 165)'
            },
            {
              offset: 1,
              color: 'rgb(1, 191, 236)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: res.data.newClueList
      },
      {
        name: '总数量',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(0, 221, 255)'
            },
            {
              offset: 1,
              color: 'rgb(77, 119, 255)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: res.data.totalClueList
      }
    ]
  }
  var chartDom2 = document.querySelector('#datas5')
  var myChart2 = echarts.init(chartDom2)
  var option2 = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]
      }
    ]
  }

  option && myChart.setOption(option)
  option2 && myChart2.setOption(option2)
}
// 日期选择
const handleDateChange = () => {
  // console.log(value2.value)
  parms.value.beginTime = value2.value[0]
  parms.value.endTime = value2.value[1]
  earchs2()
}
const isShow = ref(true)
const isShows = ref(false)
// const activeName = ref('first')
const activeTab = ref('新增客户数')
const changeTab = (tab) => {
  activeTab.value = tab
  if (tab === '新增客户数') {
    isShow.value = true
    isShows.value = false
  } else {
    isShow.value = false
    isShows.value = true
  }
}
const formInline = ref({
  clueCode: '',
  name: '',
  dept: ''
})
// 表格
const multipleTableRef = ref(null)
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const tableData = ref([])
const totals = ref(0)
//获取请求参数
const parms1 = ref({
  page: 1,
  pageSize: 10
})
// 获取表格数据
const getlist = async () => {
  const res = await getClueStatisticsTable(parms1.value)
  console.log(res)
  totals.value = res.data.total
  tableData.value = res.data.records
}
// 分页
const handleSizeChange = (val) => {
  // console.log(val)
  parms1.value.pageSize = val
  getlist()
}
const handleCurrentChange = (val) => {
  parms1.value.page = val
  getlist()
}
// 搜索
const search = () => {
  parms1.value.clueCode = formInline.value.clueCode
  parms1.value.name = formInline.value.name
  parms1.value.dept = formInline.value.dept
  getlist()
  formInline.value.clueCode = ''
  formInline.value.name = ''
  formInline.value.dept = ''
}
// 重置
const reset = () => {
  formInline.value.clueCode = ''
  formInline.value.name = ''
  formInline.value.dept = ''
}
</script>
<template>
  <el-row>
    <el-col :span="18">
      <div class="block">
        <span class="demonstration">选择日期: &nbsp;&nbsp;</span>
        <el-date-picker
          @change="handleDateChange"
          v-model="value2"
          type="daterange"
          value-format="YYYY-MM-DD"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          size="default"
        />
      </div>
    </el-col>
    <el-col :span="6">
      <div class="consider">
        <ul>
          <li :class="{ active: activeTab === '新增客户数' }" @click="changeTab('新增客户数')">
            新增客户数
          </li>
          <li :class="{ active: activeTab === '学科客户分布' }" @click="changeTab('学科客户分布')">
            学科客户分布
          </li>
        </ul>
      </div>
    </el-col>
  </el-row>
  <div class="earch">
    <div
      v-show="isShow"
      class="datas4"
      id="datas4"
      style="width: 1600px; height: 600px; margin-top: 20px"
    ></div>
    <div
      v-show="isShows"
      class="datas5"
      id="datas5"
      style="width: 1600px; height: 600px; margin-top: 20px"
    ></div>
  </div>
  <div class="table">
    <el-text size="large" style="font-size: 18px; font-weight: 800">客户统计表</el-text>
    <el-button type="danger" round size="large">导出</el-button>
  </div>
  <div class="seach">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="top">
      <el-form-item label="线索编号:">
        <el-input v-model="formInline.clueCode" placeholder="请输入线索编号"></el-input>
      </el-form-item>
      <!-- <el-form-item label="归属人:">
        <el-input v-model="formInline.name" placeholder="请输入归属人"></el-input>
      </el-form-item> -->
      <el-form-item label="归属部门:" style="text-align: center">
        <el-input v-model="formInline.dept" placeholder="请输入归属部门"> </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="large" round @click="search">搜索</el-button>
        <el-button type="info" size="large" round @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="tables">
    <el-table
      stripe
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="clueId" label="线索编号" />
      <el-table-column property="phone" label="手机号" />
      <el-table-column property="belongPerson" label="归属人部门" />
      <!-- <el-table-column property="customerName" label="归属人" /> -->
      <!-- <el-table-column property="channel" label="渠道来源" /> -->
      <!-- <el-table-column property="" label="活动详细" /> -->
      <el-table-column property="status" label="线索状态" />
      <el-table-column property="createTime" label="创建时间" />
    </el-table>
    <div style="width: 100%; display: flex; justify-content: flex-end">
      <el-pagination
        :page-sizes="[10, 20, 30, 40]"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totals"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<style scoped>
.block {
  margin-top: 20px !important;
}
.consider ul {
  display: -webkit-box;
  list-style: none;
  width: 260px;
  margin: 0;
  padding: 0;
  height: 40px;
  border-radius: 7px;
  background: #f9f9f9;
  border: 1px solid #e9e9eb;
  padding: 3px 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.consider li {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding: 6px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Semibold;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  color: #aeb5c4;
}
.active {
  color: #05cc95 !important;
  -webkit-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  background: #fff;
  -webkit-box-shadow: 0 1px 4px 0 rgb(0 0 0 / 6%);
  box-shadow: 0 1px 4px 0rgba (0, 0, 0, 0.06);
}
.table {
  display: flex;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  height: 100px;
  line-height: 100px;
  color: #000;
  background-color: #f9f9f9;
}
.seach {
  padding: 0 20px;
  margin-top: 20px;
  height: 100px;
  line-height: 100px;
  color: #000;
  /* background-color: #f9f9f9; */
}
.el-form--inline.el-form--label-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
</style>
