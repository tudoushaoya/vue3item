<script setup>
import { ref, onMounted } from 'vue'
defineOptions({ name: 'SalesStatistics' })
// 图表
import * as echarts from 'echarts'
import { getSalesStatistics, getSalesStatisticsTable } from '@/api/SalesStatistics'
onMounted(() => {
  earchs()
  getTableData()
})
const value2 = ref(['2023-07-01', '2023-07-15'])
const parms = ref({
  beginTime: '2023-07-01',
  endTime: '2023-07-15'
})
const earchs = async () => {
  const res = await getSalesStatistics(parms.value)
  console.log(res)
  var chartDom3 = document.querySelector('#datas3')
  var myChart3 = echarts.init(chartDom3)
  var option3 = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['销售量']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      top: '10%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: res.data.dateList
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '销售量',
        type: 'line',
        stack: 'Total',
        data: res.data.salesList
      }
    ]
  }

  option3 && myChart3.setOption(option3)
}
// 日期选择
const handleDateChange = () => {
  console.log(value2.value)
  parms.value.beginTime = value2.value[0]
  parms.value.endTime = value2.value[1]
  earchs()
}
const formInline = ref({
  dept: ''
})
// 搜素
const search = () => {
  parms1.value.dept = formInline.value.dept
  getTableData()
}
// 重置
const reset = () => {
  formInline.value.dept = ''
  parms1.value.dept = ''
  getTableData()
}
// 表格
const multipleTableRef = ref(null)
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
// 获取表格请求参数
const parms1 = ref({
  page: '1',
  pageSize: '10'
})
const tableData = ref([])
const totals = ref(0)
// 获取表格数据
const getTableData = async () => {
  const res = await getSalesStatisticsTable(parms1.value)
  console.log(res)
  totals.value = res.data.total
  tableData.value = res.data.records
  tableData.value.forEach((item, index) => {
    item.index = index + 1
  })
}
// 分页
const handleSizeChange = (val) => {
  console.log(val)
  parms1.value.pageSize = val
  getTableData()
}
const handleCurrentChange = (val) => {
  parms1.value.page = val
  getTableData()
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
  <div class="earch">
    <div class="datas3" id="datas3" style="width: 1600px; height: 600px; margin-top: 20px"></div>
  </div>
  <div class="table">
    <el-text size="large" style="font-size: 18px; font-weight: 800">客户统计表</el-text>
    <el-button type="danger" round size="large">导出</el-button>
  </div>
  <div class="seach">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="top">
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
      <el-table-column property="index" label="排行" />
      <el-table-column property="deptId" label="归属部门" />
      <el-table-column property="contract" label="合同数量" />
      <el-table-column property="amount" label="成交金额" />
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
