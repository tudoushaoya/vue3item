<script setup>
import { ref, onMounted } from 'vue'
import { getRoleList } from '@/api/role.js'
import RoleAdd from './components/role-add.vue'

defineOptions({ name: 'roleManagePage' })
const roleParams = ref({
  roleName: '',
  status: null,
  page: 1,
  size: 10
})
const searchForm = ref({
  roleName: '',
  status: null
})
const roleTable = ref([])
//规则
const searchRules = ref({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})
//获取角色数据
const total = ref(0)
const getRoleListAPI = async () => {
  const res = await getRoleList(roleParams.value)
  roleTable.value = res.data.records
  total.value = res.data.total
  roleTable.value.forEach((item) => {
    item.createTime = item.createTime.replace('T', ' ')
  })
  console.log(roleTable.value)
}
const multipleTableRef = ref(null)
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

//搜索
const searchRef = ref(null)
const btnSearch = async () => {
  roleParams.value.roleName = searchForm.value.roleName
  roleParams.value.status = searchForm.value.status
  await getRoleListAPI()
  searchRef.value.resetFields()
}
//重置
const btnReset = () => {
  searchRef.value.resetFields()
}

//  添加
const roleAdd = ref(false)

//分页

const handleSizeChange = (val) => {
  roleParams.value.size = val
  getRoleListAPI()
}
const handleCurrentChange = (val) => {
  roleParams.value.page = val
  getRoleListAPI()
}
onMounted(() => {
  getRoleListAPI()
})
</script>
<template>
  <div class="contain">
    <el-card class="box-card">
      <el-form class="form" :model="searchForm" :rules="searchRules" ref="searchRef">
        <el-row>
          <el-col :span="8">
            <el-form-item label="角色名称" prop="roleName" style="margin-right: 50px">
              <el-input v-model="searchForm.roleName" placeholder="请输入" style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择">
                <el-option label="正常" value="0"></el-option>
                <el-option label="停用" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-space class="btn">
        <el-button type="primary" round @click="btnSearch">搜索</el-button>
        <el-button type="info" round @click="btnReset">重置</el-button>
      </el-space>
    </el-card>
    <el-row style="margin: 24px 0 19px 0">
      <el-col :span="12" style="font-size: 14px"
        >已选<span style="color: #05cc95">19</span>项</el-col
      >
      <el-col :span="12">
        <el-space style="display: flex; justify-content: center; margin-left: 193px">
          <el-button round type="danger" @click="roleAdd = true">新增</el-button>
          <el-button round type="info">删除</el-button>
          <el-button round type="info">导出</el-button>
        </el-space>
      </el-col>
    </el-row>

    <el-table ref="multipleTableRef" :data="roleTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="roleId" label="角色编号"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column prop="roleKey" label="权限字符" />
      <el-table-column prop="roleSort" label="显示顺序" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <span>{{ scope.row.status === 1 ? '停用' : '正常' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="220" align="center ">
        <template #default>
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">数据权限</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="roleParams.page"
        v-model:page-size="roleParams.size"
        :page-sizes="[10, 20, 30]"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        small
      />
    </div>
  </div>
  <RoleAdd :visible="roleAdd" @close="roleAdd = flase" />
</template>

<style lang="scss" scoped>
.contain {
  .btn {
    margin-top: 30px;
    margin-right: 101px;
    display: flex;
    justify-content: flex-end;
  }
  .demo-pagination-block {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}
</style>
