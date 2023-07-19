<script setup>
import { ref, onMounted } from 'vue'
defineOptions({ name: 'ChannelStatistics' })
// 图表
import * as echarts from 'echarts'
import { getChannelStatistics, getChannelStatisticsList } from '@/api/ChannelStatistics'
onMounted(() => {
  earch()
  getlists()
})

const parms = ref({
  beginTime: '2023-07-01',
  endTime: '2023-07-15'
})
const value2 = ref(['2023-07-01', '2023-07-15'])
const earch = async () => {
  const res = await getChannelStatistics(parms.value)
  // console.log(res)
  const datas2 = [
    {
      name: '',
      value: ''
    }
  ]
  res.data.channelNameList.forEach((item, index) => {
    datas2[index] = {
      name: item,
      value: res.data.channelDataList[index]
    }
  })
  console.log(datas2)
  var chartDom6 = document.querySelector('#datas6')
  var myChart6 = echarts.init(chartDom6)
  var option6 = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'center',
      top: 'bottom'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: datas2,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  const datas3 = [
    {
      name: '',
      value: ''
    }
  ]
  res.data.activityNameList.forEach((item, index) => {
    datas3[index] = {
      name: item,
      value: res.data.activityDataList[index]
    }
  })
  // console.log(datas3)
  var chartDom7 = document.querySelector('#datas7')
  var myChart7 = echarts.init(chartDom7)
  var option7 = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      left: 'center',
      top: 'bottom'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: datas3
      }
    ]
  }

  option7 && myChart7.setOption(option7)
  option6 && myChart6.setOption(option6)
}
// 日期选择器
const handleDateChange = () => {
  // console.log(value2.value)
  parms.value.beginTime = value2.value[0]
  parms.value.endTime = value2.value[1]
  earch()
}
const formInline = ref({
  activityCode: '',
  activityName: ''
})
// 表格
const multipleTableRef = ref(null)
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
//请求表格数据参数
const params1 = ref({
  page: 1,
  pageSize: 10
})
const totals = ref(0)
const tableData = ref([])
// 获取表格数据
const getlists = async () => {
  const res = await getChannelStatisticsList(params1.value)
  console.log(res)
  totals.value = res.data.total
  tableData.value = res.data.records
}
// 搜索
const search = () => {
  params1.value.activityCode = formInline.value.activityCode
  params1.value.activityName = formInline.value.activityName
  getlists()
  formInline.value.activityCode = ''
  formInline.value.activityName = ''
}
// 重置
const reset = () => {
  params1.value.activityCode = ''
  params1.value.activityName = ''
  getlists()
}
// 分页
const handleSizeChange = (val) => {
  // console.log(val)
  params1.value.pageSize = val
  getlists()
}
const handleCurrentChange = (val) => {
  params1.value.page = val
  getlists()
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
          value-format="YYYY-MM-DD"
          type="daterange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          size="default"
        />
      </div>
    </el-col>
  </el-row>
  <div class="earch" style="display: flex">
    <div class="datas6" id="datas6" style="width: 800px; height: 600px; margin-top: 20px"></div>
    <div class="datas7" id="datas7" style="width: 800px; height: 600px; margin-top: 20px"></div>
  </div>
  <div class="table">
    <el-text size="large" style="font-size: 18px; font-weight: 800">客户统计表</el-text>
    <el-button type="danger" round size="large">导出</el-button>
  </div>
  <div class="seach">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="top">
      <el-form-item label="活动编号:">
        <el-input v-model="formInline.activityCode" placeholder="请输入活动编号"></el-input>
      </el-form-item>
      <el-form-item label="活动名称:">
        <el-input v-model="formInline.activityName" placeholder="请输入活动名称"></el-input>
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
      <!-- <el-table-column property="" label="渠道来源" /> -->
      <el-table-column property="code" label="活动编号" />
      <el-table-column property="name" label="活动名称" />
      <el-table-column property="info" label="活动简介" />
      <el-table-column property="clueTotal" label="线索总数" />
      <el-table-column property="noClueTotal" label="伪线索数" />
      <el-table-column property="toBusiness" label="转化商机数" />
      <el-table-column property="toCustomer" label="转化客户数" />
      <el-table-column property="amountTotal" label="成交金额" />
      <!-- <el-table-column property="" label="活动成本" /> -->
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
