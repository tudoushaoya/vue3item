<script setup>
defineOptions({ name: 'menuManagePage' })
import { onMounted, ref } from 'vue'
import menuAddDeit from './components/menu-add-deit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMenu } from '@/api/menu.js'
const parentBorder = ref(false)
// const childBorder = ref(false)
const pages = ref({
  page: 1,
  size: 10,
  menuName: '',
  status: null
})
const tableData = ref([])

// 获取
const getList = async () => {
  const res = await getMenu()
  console.log(res.data)
  tableData.value = res.data
}

// 添加
const menuAdd = ref(false)

const formDate = ref({
  menuName: '',
  status: null
})

// 搜索
const menuSearch = () => {
  pages.value.menuName = formDate.value.menuName
  pages.value.status = formDate.value.status
  getList()
  formDate.value.menuName = ''
  formDate.value.status = null
}
// 子节点table
const expandClick = async (row) => {
  console.log('row', row)
}
// 删除
const del = () => {
  ElMessageBox.confirm('确认删除？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  })
}
onMounted(() => {
  getList()
})
</script>
<template>
  <div class="contain">
    <el-card>
      <el-form label-position="top" :model="formDate">
        <el-row>
          <el-col :span="12" style="display: flex">
            <el-space>
              <el-form-item label="菜单名称" prop="menuName">
                <el-input placeholder="请输入" style="width: 240px" v-model="formDate.menuName" />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select placeholder="请选择" style="width: 240px" v-model="formDate.status">
                  <el-option label="正常" value="0"></el-option>
                  <el-option label="停用" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-space>
          </el-col>
          <el-col :span="12" style="text-align: right; line-height: 80px">
            <el-button type="primary" round @click="menuSearch">搜索</el-button>
            <el-button type="info" round>重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-row>
      <el-col :span="24" style="text-align: right; padding: 20px">
        <el-button type="danger" round @click="menuAdd = true">新增</el-button></el-col
      >
    </el-row>

    <el-table
      :data="tableData"
      :border="parentBorder"
      style="width: 100%"
      @expand-change="expandClick"
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <el-table :data="row.children" :border="childBorder">
            <el-table-column prop="menuName" style="padding: 20px !important" />
            <el-table-column prop="orderNum" />
            <el-table-column prop="perms" />
            <el-table-column prop="createTime" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="menuName" label="菜单名称" />
      <el-table-column prop="icon" label="图标" />
      <el-table-column prop="orderNum" label="排序">
        <template #default="{ $index }"> {{ $index + 1 }} </template>
      </el-table-column>
      <el-table-column prop="perms" label="权限标识" align="center" />
      <el-table-column prop="component" label="组件路径" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button type="text" @click="handleClick">修改</el-button>
          <el-button type="text">新增</el-button>
          <el-button type="text" style="color: #fd7065" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <menu-add-deit :dialogVisible="menuAdd" @close="menuAdd = false"></menu-add-deit>
  </div>
</template>

<style lang="scss" scoped>
.demo-pagination-block {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>
