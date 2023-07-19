<script setup>
defineOptions({ name: 'userManagePage' })
import { onMounted, ref, watch } from 'vue'
import UserDialog from './components/user-dialog.vue'

import { getList, deleteUser, resetPassword, getDept } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import excelUpload from './components/excel-upload.vue'
import { transListToTree } from '@/utils/index'

const filterText = ref('')
const treeRef = ref()

watch(filterText, (val) => {
  treeRef.value.filter(val)
})

// const filterNode = (value, data) => {
//   if (!value) return true
//   return data.label.includes(value)
// }

const tableData = ref([{}])
const pages = ref({
  page: 1,
  size: 10,
  userName: '',
  phone: '',
  status: null,
  createTime: ''
})
const totals = ref(null)
const newList = async () => {
  const {
    data: { records, total }
  } = await getList(pages.value)
  records.forEach((item) => {
    const data = item.createTime.replace('T', ' ')
    item.createTime = data
  })

  tableData.value = records
  totals.value = total
}

const item = ref(0)
const disabled = ref(true)

// 监听checkbox
const handleSelectionChange = (val) => {
  console.log(val)
  item.value = val.length
  console.log(val.length)
  val.length > 0 ? (disabled.value = false) : (disabled.value = true)
}
// 批量删除
const batchDelete = () => {
  if (item.value === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择要删除的数据'
    })
  } else {
    ElMessageBox.confirm('确认删除？', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const arr = []
      tableData.value.forEach((item) => {
        if (item.checked) {
          arr.push(item.userId)
        }
      })
      await deleteUser(arr)
      newList()
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    })
  }
}

// 树形

const treeArr = ref([])
const newgetDept = async () => {
  const res = await getDept()
  const newArr = transListToTree(res.data.records, 0)
  treeArr.value = newArr
}
const defaultProps = {
  children: 'children',
  label: 'deptName',
  value: 'deptId'
}
// 控制弹窗
const dialogVisible = ref(false)

const handleSizeChange = (val) => {
  pages.value.size = val
  newList()
}

const handleCurrentChange = (val) => {
  pages.value.page = val
  newList()
}
const formDate = ref({
  userName: '',
  phone: '',
  status: null,
  createTime: '',
  password: ''
})

// 搜索
const search = () => {
  pages.value.userName = formDate.value.userName.trim()
  pages.value.phone = formDate.value.phone.trim()
  pages.value.status = formDate.value.status
  pages.value.createTime = formDate.value.createTime.trim()
  formDate.value = {
    userName: '',
    phone: '',
    status: null,
    createTime: ''
  }
  newList()
}
// 重置
const reset = () => {
  formDate.value = {
    userName: '',
    phone: '',
    status: null,
    createTime: ''
  }
  newList()
}
const flag = ref(false)
// 新增
const addUser = () => {
  dialogVisible.value = true
  flag.value = true
}

const userId = ref(null)
// 修改
const userEidt = (id) => {
  dialogVisible.value = true
  userId.value.getUserDetail(id)
  flag.value = false
}

// 删除
const userDelete = (id) => {
  ElMessageBox.confirm('确认删除？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteUser(id)
    newList()

    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  })
}

const pasd = ref({
  id: '',
  password: ''
})
// 重置
const dialogFormVisible = ref(false)

const newResetPassword = async (id) => {
  dialogFormVisible.value = true
  pasd.value.id = id
}
const subPassword = async () => {
  await resetPassword({
    id: pasd.value.id,
    password: pasd.value.password
  })
  dialogFormVisible.value = false
  ElMessage({
    type: 'success',
    message: '重置成功'
  })
  pasd.value.password = ''
  newList()
}

// excel
const excelShow = ref(false)

onMounted(() => {
  newList()
  newgetDept()
})
</script>
<template>
  <div class="contain">
    <el-card class="right">
      <el-input prefix-icon="Search" placeholder="请输入部门名称" />

      <el-tree
        ref="treeRef"
        class="filter-tree"
        :data="treeArr"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
      />
    </el-card>
    <el-card class="left">
      <el-form label-position="top" :model="formDate">
        <el-row>
          <el-col :span="8">
            <el-form-item label="账户名称" prop="userName">
              <el-input
                placeholder="请输入"
                style="width: 260px"
                v-model="formDate.userName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="phone">
              <el-input
                placeholder="请输入"
                style="width: 260px"
                v-model="formDate.phone"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formDate.status" placeholder="请选择" style="width: 260px">
                <el-option label="正常" value="0"></el-option>
                <el-option label="停用" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="日期" prop="createTime">
              <el-date-picker
                v-model="formDate.createTime"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="选择日期"
                :size="size"
                style="width: 260px"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            style="display: flex; justify-content: end; align-items: center; padding-right: 72px"
          >
            <el-button type="primary" round @click="search">搜索</el-button>
            <el-button type="info" round @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-row style="margin: 20px 0">
        <el-col :span="12" style="line-height: 50px"
          >已选<span style="color: #05cc95">{{ item }}</span
          >项</el-col
        >
        <el-col
          :span="12"
          style="display: flex; justify-content: center; align-items: center; padding-left: 72px"
        >
          <el-button type="danger" round @click="addUser">新增</el-button>
          <el-button type="info" round disabled>修改</el-button>
          <el-button type="info" round @click="batchDelete" :disabled="disabled">删除</el-button>
          <el-button type="info" round @click="excelShow = true">导出</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="multipleTableRef"
        :data="tableData"
        @selection-change="handleSelectionChange"
        align="center "
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="用户编号" align="center "> </el-table-column>
        <el-table-column prop="userName" label="用户名称"> </el-table-column>
        <el-table-column prop="name" label="用户昵称" />
        <el-table-column prop="department" label="部门" align="center " />
        <el-table-column prop="phone" label="手机号码" width="200" align="center " />
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="200"
          align="center "
        ></el-table-column>
        <el-table-column label="操作" width="215" align="center ">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="userEidt(row.id)">修改</el-button>
            <el-button type="text" size="small" style="color: #fd7065" @click="userDelete(row.id)"
              >删除</el-button
            >
            <el-button type="text" size="small" @click="newResetPassword(row.id)"
              >重置密码</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="demo-pagination-block">
        <el-pagination
          :page-sizes="[10, 20, 30, 40]"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          @size-change="handleSizeChange"
          small
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="重置密码">
      <el-form label-position="top" :model="pasd">
        <el-form-item label="请输入的新密码" :label-width="200" prop="password">
          <el-input type="password" show-password v-model="pasd.password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="subPassword"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <UserDialog
    :dialogVisible="dialogVisible"
    @close="dialogVisible = false"
    @add="newList"
    ref="userId"
    :flag="flag"
  ></UserDialog>
  <excelUpload
    :dialogTableVisible="excelShow"
    :handleSelectionChange="handleSelectionChange"
  ></excelUpload>
</template>

<style lang="scss" scoped>
.contain {
  display: flex;
  .right {
    width: 290px;
    height: 941px;
  }
  .left {
    width: 100%;
    margin-left: 20px;
  }
  .demo-pagination-block {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}
</style>
