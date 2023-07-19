<script setup>
import { ref, onMounted } from 'vue'
defineOptions({ name: 'CustomerStatistics' })
// 图表
import * as echarts from 'echarts'
import { getCustomerStatistics, getSubjectStatistics, getTableData } from '@/api/CustomerStatistics'
onMounted(() => {
  chartDom()
  chartDom1()
  getTableDatas()
})
// 图表日期
const Newdata = ref([])
// 新增客户数量图表数据
const NewList = ref([])
// 客户总数量图表数据
const TotalList = ref([])
// 获取图表数据
const parms = ref({
  beginTime: '2023-07-01',
  endTime: '2023-07-15'
})

const value2 = ref(['2023-07-01', '2023-07-15'])
// 新增客户图表
const chartDom = async () => {
  const res = await getCustomerStatistics(parms.value)
  Newdata.value = res.data.dateList
  NewList.value = res.data.newUserList
  TotalList.value = res.data.totalUserList
  var chartDom = document.querySelector('#datas')
  var myChart = echarts.init(chartDom)
  var option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增客户数量(个)', '客户总数量(万个)']
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
      data: Newdata.value
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增客户数量(个)',
        type: 'line',
        stack: 'Total',
        data: NewList.value
      },
      {
        name: '客户总数量(万个)',
        type: 'line',
        stack: 'Total',
        data: TotalList.value
      }
    ]
  }
  option && myChart.setOption(option)
}
// 学科客户分布图表数据
const SubjectList = ref([])
//学科客户占比分布数据
const SubjectData = ref([])
// 学科客户分布图表
const chartDom1 = async () => {
  const res = await getSubjectStatistics(parms.value)
  // console.log(res.data)
  SubjectList.value = res.data.subjectList
  SubjectData.value = res.data.percentageList
  const datas2 = [
    {
      name: '',
      value: ''
    }
  ]
  SubjectList.value.forEach((item, index) => {
    datas2[index] = {
      name: item,
      value: SubjectData.value[index]
    }
  })

  // console.log(datas2)
  var chartDom2 = document.querySelector('#datas2')
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
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: datas2
      }
    ]
  }

  option2 && myChart2.setOption(option2)
}
// 选项卡
const isShow = ref(true)
const isShows = ref(false)
const activeTab = ref('新增客户数')
const changeTab = (tab) => {
  activeTab.value = tab
  if (tab === '新增客户数') {
    isShow.value = true
    isShows.value = false
    chartDom()
  } else {
    isShow.value = false
    isShows.value = true
  }
}
// 表单搜索
const formInline = ref({
  channel: '',
  dept: '',
  clue: ''
})
//搜索
const search = () => {
  parms1.value.channel = formInline.value.channel
  parms1.value.dept = formInline.value.dept
  parms1.value.clue = formInline.value.clue
  console.log(parms1.value)
  getTableDatas()
  formInline.value.clue = ''
  formInline.value.dept = ''
  formInline.value.channel = ''
}
// 重置
const rest = () => {
  formInline.value.clue = ''
  formInline.value.dept = ''
  formInline.value.channel = ''
  getTableDatas()
}
// 表格
const multipleTableRef = ref(null)
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const tableData = ref([])
// const handleBlur = () => {
//   console.log(value2.value)
//   parms.value.beginTime = value2.value[0]
//   parms.value.endTime = value2.value[1]
//   chartDom()
// }

//获取下拉框数据

// 获取表格数据
const parms1 = ref({
  page: 1,
  pageSize: 10
})
const totals = ref(0)
const getTableDatas = async () => {
  const res = await getTableData(parms1.value)
  // console.log(res)
  totals.value = res.data.total
  tableData.value = res.data.records
}
// 日期选择
const handleDateChange = () => {
  // console.log(value2.value)
  parms.value.beginTime = value2.value[0]
  parms.value.endTime = value2.value[1]
  chartDom()
}
// 分页
const handleSizeChange = (val) => {
  // console.log(val)
  parms1.value.pageSize = val
  getTableDatas()
}
const handleCurrentChange = (val) => {
  parms1.value.page = val
  getTableDatas()
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
      class="datas"
      id="datas"
      style="width: 100%; height: 600px; margin-top: 20px"
    ></div>
    <div
      v-show="isShows"
      class="datas2"
      id="datas2"
      style="width: 1600px; height: 600px; margin-top: 20px"
    ></div>
  </div>
  <div class="table">
    <el-text size="large" style="font-size: 18px; font-weight: 800">客户统计表</el-text>
    <el-button type="danger" round size="large">导出</el-button>
  </div>
  <div class="seach">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="top">
      <el-form-item label="渠道来源:">
        <el-select v-model="formInline.channel" placeholder="请选择渠道来源" clearable>
          <el-option label="线上活动" value="1" />
          <el-option label="推广介绍" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="归属部门:">
        <el-select v-model="formInline.dept" placeholder="请选择归属部门" clearable>
          <el-option label="Zone one" value="shanghai" />
        </el-select>
      </el-form-item>
      <el-form-item label="归属人:">
        <el-input v-model="formInline.clue" placeholder="请输入归属人"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="large" round @click="search">搜索</el-button>
        <el-button type="info" size="large" round @click="rest">重置</el-button>
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
      <el-table-column property="id" label="客户ID" />
      <el-table-column property="name" label="姓名" />
      <el-table-column property="subject" label="课程学科" />
      <el-table-column property="courseName" label="课程名称" />
      <el-table-column property="channel" label="渠道来源">
        <template #default="scope">
          <el-tag v-if="scope.row.channel === '1'" type="success">线上活动</el-tag>
          <el-tag v-else-if="scope.row.channel === '2'" type="info">推广介绍</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="createUser" label="归属人" />
      <el-table-column property="createTime" label="成交时间" />
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
