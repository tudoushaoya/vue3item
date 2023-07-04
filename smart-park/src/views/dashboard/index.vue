<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <!-- 园区数据 -->
        <div class="info-wrapper">
          <p>园区数据</p>
          <div class="park-box">
            <div class="div-box">
              <span>年度累计收费(元)</span>
              <span>{{ workBench.annualIncome }}</span>
            </div>
            <div class="div-box">
              <span>入驻企业总数(个)</span>
              <span>{{ workBench.enterpriseTotal }}</span>
            </div>
            <div class="div-box">
              <span>月卡车辆总数(辆)</span>
              <span>{{ workBench.monthCardTotal }}</span>
            </div>
            <div class="div-box">
              <span>一体杆总数(台)</span>
              <span>{{ workBench.chargePoleTotal }}</span>
            </div>
          </div>
        </div>
        <!-- 年度收入统计 -->
        <div class="info-wrapper">
          <p>年度收入统计</p>
          <div id="main" />
        </div>
        <!-- 临期合同提醒 -->
        <div class="info-wrapper">
          <p>临期合同提醒</p>
          <el-table :data="contractList.rows" style="100%">
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="enterpriseName" label="企业名称" />
            <el-table-column prop="buildingName" label="租赁楼宇" />
            <el-table-column label="租赁时间">
              <template #default="scope">
                {{ scope.row.startTime }} 至 {{ scope.row.endTime }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" @click.native="toRenew(scope.row)">续签</el-button>
                <el-button type="text" @click="retreat()">退租</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :page-sizes="[10,20,50]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="contractList.total"
            style="text-align: right;margin-top: 20px;"
          />
        </div>
      </div>
      <div class="right">
        <!-- 快捷入口 -->
        <div class="info-wrapper">
          <p>快捷入口</p>
        </div>
      </div>
    </div>
    <!-- 续租合同弹框 -->
    <el-dialog
      title="续租合同"
      :visible.sync="RenewShow"
      width="45%"
    >
      <el-form :model="RenewForm">
        <el-form-item label="租赁楼宇" prop="buildingName">
          <el-input v-model="RenewForm.buildingName" disabled size="small" />
        </el-form-item>
        <el-form-item label="租赁起止日期">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            :start-placeholder="RenewForm.startTime"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="租赁合同">
          <input type="file" accept=".doc,.docx,.pdf" style="display: none;">
          <el-button type="text" plain><i class="el-icon-upload2" />上传文件</el-button>
          <p style="margin: 0;color: #8c8c8c;">支持扩展名：.doc .docx .pdf, 文件大小不得超过5M</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="RenewShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="RenewShow = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 退租弹框 -->
    <el-dialog :visible.sync="retreatShow" width="45%" :show-close="false">
      <p style="font-size: 18px;color: black;">退租不可撤回，是否确认退租当前楼宇?</p>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="retreatShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="retreatShow = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWorkbenchBaseInfo, getWorkbenchRentInfo } from '@/api/workbench'
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
export default {
  name: 'Dashboard',
  data() {
    return {
      RenewShow: false, // 续租合同弹框
      RenewForm: {}, // 续租合同表单
      retreatShow: false, // 退租弹框
      workBench: {}, // 工作台基本信息
      contractList: {}, // 合同列表
      endDate: '' // 用于保存灵活更改的结束日期
    }
  },
  computed: {
    ...mapGetters(['name']),
    value1: {
      get() {
        // 通过计算属性获取开始日期和结束日期的范围
        return [this.RenewForm.startTime, this.endDate]
      },
      set(val) {
        // 当结束日期改变时，更新endDate变量
        this.endDate = val[1]
      }
    }
  },
  async created() {
    await this.getWorkbenchBaseInfo()// 获取工作台基本信息
    this.initChart()
    const { data: { data }} = await getWorkbenchRentInfo()// 获取合同列表
    this.contractList = data
    console.log(this.contractList)
  },
  async mounted() {
    // await this.initChart()
  },
  methods: {
    // 获取工作台基本信息
    async getWorkbenchBaseInfo() {
      const res = await getWorkbenchBaseInfo()
      this.workBench = res.data.data
      console.log(this.workBench)
    },
    // 初始化图表
    async initChart() {
      console.log(this.workBench)
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('main'))
      // 绘制图表
      myChart.setOption({
        tooltip: {},
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: ['行车收入', '物业费']
        },
        xAxis: {
          data: this.workBench.annualIncomeArray.xmonth
        },
        yAxis: {},
        series: [
          {
            name: '物业费',
            type: 'bar',
            data: this.workBench.annualIncomeArray.ybuilding,
            color: '#3656ff',
            stack: 'x',
            barWidth: 20
          },
          {
            name: '行车收入',
            type: 'bar',
            data: this.workBench.annualIncomeArray.yparking,
            color: '#cde4ff',
            stack: 'x',
            barWidth: 20
          }
        ]
      })
    },
    // 续签
    async toRenew(val) {
      console.log(val)
      this.RenewForm = val
      this.RenewShow = true
    },
    // 退租
    retreat() {
      console.log(11)
      this.retreatShow = true
    }

  }
}
</script>

<style lang="scss" scoped>
.info-wrapper{
  background-color: #fff;
  padding: 20px;
    margin-bottom: 20px;
    min-width: 260px;
}
.app-container{
  display: flex;
  background-color: #f4f6f8;
  .left{
    flex: 2;
  }
  .right{
    flex:1;
    margin-left: 20px;
  }
}
.park-box{
  display: flex;
  justify-content: space-around;
  .div-box{
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    span{
      display: block;
      font-size: 16px;
      color: #303035;
      font-weight: bold;

      &:first-child{
        font-size: 14px;
        color: #909399;
        padding-bottom: 20px;
        font-weight: normal;
      }
    }
  }
}
#main{
  width: 100%;
  height: 400px;
}

::v-deep .el-dialog__body{
  padding: 20px 100px;
}
::v-deep .el-dialog__footer{
  background-color: #f4f6f8;
  padding: 10px 20px ;
}
::v-deep .el-form-item__label {
    display: contents;
}
</style>
