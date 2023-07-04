<template>
  <div class="container">
    <div class="app-container">
      <el-card>
        <el-form>
          <el-form-item label="企业名称">
            <el-input v-model="name" placeholder="请输入企业名称" size="small" style="width: 400px;" clearable />
            <el-button type="primary" style="margin-left: 20px;">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary">添加企业</el-button>
        <el-table :data="enterpriseList">
          <el-table-column type="index" :index="getIndex" label="序号" />
          <el-table-column prop="name" label="企业名称" />
          <el-table-column prop="contact" label="联系人" />
          <el-table-column prop="contactNumber" label="联系电话" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="text">添加合同</el-button>
              <el-button type="text">查看</el-button>
              <el-button type="text">编辑</el-button>
              <el-button type="text" :disabled="scope.row.status===1">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEnterpriseList } from '@/api/park'
export default {
  name: 'EnterprisePage',
  components: {},
  props: {},
  data() {
    return {
      name: '',
      enterpriseList: [],
      total: 0,
      params: {
        page: 1,
        pageSize: 10
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
  created() {
    this.getEnterpriseList()
  },
  mounted() {},
  methods: {
    async getEnterpriseList() {
      const { data: { data }} = await getEnterpriseList(this.params)
      this.enterpriseList = data.rows
      this.total = data.total
      console.log(this.enterpriseList, this.total)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
