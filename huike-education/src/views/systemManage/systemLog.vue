<script setup>
defineOptions({ name: 'systemLogPage' })
import { getLogs } from '@/api/logs.js'
import { onMounted, ref } from 'vue'

//获取列表传值
const params = ref({
  keyword: '',
  time: '',
  page: '1',
  size: '10'
})
//申请变量
const rows = ref([])
const getLogsAPI = async () => {
  const res = await getLogs(params.value)
  console.log(res)
  total.value = res.total
  rows.value = res.records
  rows.value.forEach((item, index) => {
    item.index = index + 1
    item.operTime = item.operTime.replace('T', ' ')
  })
}
//分页总数
const total = ref(null)
onMounted(() => {
  getLogsAPI()
})
//分页
const handleSizeChange = (val) => {
  params.value.size = val
  getLogsAPI()
}
const handleCurrentChange = (val) => {
  params.value.page = val
  getLogsAPI()
}
//搜索
const inquireForm = ref({
  time: '',
  title: ''
})
const inquire = async () => {
  params.value.time = inquireForm.value.time
  params.value.title = inquireForm.value.title
  getLogsAPI()
}
//重置
const kong = () => {
  inquireForm.value.time = null
  inquireForm.value.title = null
  delete params.value.time
  delete params.value.title
  getLogsAPI()
}
</script>
<template>
  <div>
    <el-form inline="true" :model="inquireForm">
      <el-form-item label="关键字:" prop="title">
        <el-input placeholder="请输入" v-model="inquireForm.title"></el-input>
      </el-form-item>
      <el-form-item label="选择日期:" prop="time">
        <div class="block">
          <el-date-picker
            v-model="inquireForm.time"
            type="date"
            placeholder="1999-11-27"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="kong">重置</el-button>
        <el-button type="primary" @click="inquire">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="rows" align="center">
      <el-table-column label="序号" width="100">
        <template #default="scope">
          {{ (params.page - 1) * params.size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="operName"></el-table-column>
      <el-table-column label="请求方式" prop="requestMethod"></el-table-column>
      <el-table-column label="访问地址" prop="operUrl"></el-table-column>
      <el-table-column label="模块名称" prop="title"></el-table-column>
      <el-table-column label="登录IP" prop="operIp"></el-table-column>
      <el-table-column label="操作时间" prop="operTime"></el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" link>查看</el-button>
      </el-table-column>
    </el-table>
    <div class="demo-pagination-block" style="margin-top: 20px">
      <el-pagination
        :page-sizes="[20, 30, 40, 50]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
