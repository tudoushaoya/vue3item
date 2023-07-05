<template>
  <div class="container">
    <div class="app-container">
      <el-card>
        <el-form>
          <el-form-item label="楼宇名称">
            <el-input v-model="name" placeholder="请输入楼宇名称" size="small" style="width: 400px;" clearable />
            <el-button type="primary" style="margin-left: 20px;" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="addBuilding">添加楼宇</el-button>
        <el-table :data="buildingList.rows">
          <el-table-column type="index" :index="getIndex" label="序号" />
          <el-table-column prop="name" label="楼宇名称" />
          <el-table-column prop="floors" label="层数" />
          <el-table-column prop="area" label="在管面积(m²)" />
          <el-table-column prop="propertyFeePrice" label="物业费(元/m²)" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              {{ scope.row.status === 1 ? '租赁中' : '空置中' }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button type="text" :disabled="scope.row.status===1" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="params.page"
          :page-sizes="[10,20,30]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="buildingList.total"
          style="text-align: right;margin-top: 20px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </div>
    <building-frame :detail-row="detailRow" :is-show.sync="isShow" :is-edit="isEdit" @changeRow="changeRow" @addRow="addRow" />
  </div>
</template>

<script>
import { getBuildList, updateBuild, addBuild, deleteBuild } from '@/api/park'
import BuildingFrame from './components/BuildingFrame.vue'
export default {
  name: 'BuildingPage',
  components: { BuildingFrame },
  props: {},
  data() {
    return {
      isShow: false,
      isEdit: false,
      name: '',
      buildingList: {},
      detailRow: {},
      params: {
        page: 1,
        pageSize: 10,
        name: ''
      }
    }
  },
  computed: {
    getIndex() {
      return index => {
        return (this.params.page - 1) * this.params.pageSize + index + 1
      }
    }
  },
  watch: {},
  async created() {
    this.getBuildList()
  },
  mounted() {},
  methods: {
    // 获取楼宇列表
    async getBuildList() {
      const { data: { data }} = await getBuildList(this.params)
      this.buildingList = data
    },
    // 分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getBuildList()
    },
    // 页码
    handleCurrentChange(val) {
      this.params.page = val
      this.getBuildList()
    },
    // 查询
    search() {
      this.params.name = this.name
      this.getBuildList()
    },
    // 添加楼宇
    addBuilding() {
      this.detailRow = {}
      this.isShow = true
      this.isEdit = false
    },
    // 编辑楼宇
    async edit(row) {
      this.detailRow = row
      this.isShow = true
      this.isEdit = true
    },
    async changeRow(val) {
      await updateBuild(val)
      this.getBuildList()
    },
    async addRow(val) {
      await addBuild(val)
      this.getBuildList()
    },
    del(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteBuild(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((e) => {
        console.log(e.response)
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>
<style lang="scss" scoped>
</style>
