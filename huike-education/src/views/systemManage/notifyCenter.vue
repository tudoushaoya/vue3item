<script setup>
defineOptions({ name: 'notifyCenterPage' })
import { onMounted, ref } from 'vue'
import { getList, getDetailId } from '@/api/notify'
import { useRouter } from 'vue-router'
const router = useRouter()
// 列表数据
const tableData = ref([])

// 总条数
const totals = ref(0)
// 当前页
const pages = ref({
  page: 1,
  size: 10,
  status: 1 // 0未读 1已读
})

// 切换tabs
const activeName = ref('unread')
// 获取列表
const onTabChange = async () => {
  // console.log(activeName.value)
  if (activeName.value === 'unread') {
    pages.value.status = 0
    const {
      data: { records, total }
    } = await getList(pages.value)
    totals.value = total
    tableData.value = records
  } else {
    pages.value.status = 1
    const {
      data: { records, total }
    } = await getList(pages.value)
    totals.value = total
    tableData.value = records
  }
}
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`)
  pages.value.size = val
  onTabChange()
}

const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`)
  pages.value.page = val
  onTabChange()
}
const handleClick = async (val) => {
  console.log(val)
  const res = await getDetailId(val.noticeId)
  console.log(res)
  if (val.noticeType === 1) {
    router.push('/order')
  } else {
    router.push('/contract')
  }
}

// const type = ref({

// })
onMounted(() => {
  onTabChange()
})
</script>
<template>
  <div class="contain">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="onTabChange">
      <el-tab-pane label="未读" name="unread">
        <el-table :data="tableData" style="width: 100%" v-if="tableData.length > 0">
          <el-table-column prop="noticeId" label="序号" width="180" align="center" />
          <el-table-column prop="createBy" label="发信人" width="320" align="center" />
          <el-table-column prop="noticeContent" label="内容" width="320" align="center" />
          <el-table-column
            prop="createTime"
            label="下次跟进时间"
            width="220"
            sortable
            align="center"
          />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="handleClick(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="images" v-else>
          <img src="../../assets/notifyCenter/不存在.png" alt="" />
          <span>内容跑丢了哦～</span>
        </div>

        <div class="demo-pagination-block">
          <el-pagination
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            small
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="已读" name="read">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="noticeId" label="序号" width="180" align="center" />
          <el-table-column prop="createBy" label="发信人" width="320" align="center" />
          <el-table-column prop="noticeContent" label="内容" width="320" align="center" />
          <el-table-column
            prop="createTime"
            label="下次跟进时间"
            width="220"
            sortable
            align="center"
          />
          <el-table-column label="操作">
            <template #default>
              <el-button link type="primary" size="small" @click="readClick">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="demo-pagination-block">
          <el-pagination
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            small
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.contain {
  .images {
    width: 370px;
    height: 200px;
    margin: 180px auto;
    text-align: center;
    line-height: 50px;
    color: #666666;
    font-size: 14px;
    img {
      display: block;
    }
  }
  .demo-pagination-block {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}
</style>
