<script setup>
import { onMounted, ref } from 'vue'
defineOptions({
  name: 'add_edit_Menu'
})

const props = defineProps({
  dialogVisible: {
    type: Boolean
  }
})
// 通知父组件
const emit = defineEmits(['close', 'add'])

const formDate = ref({
  parentId: '',
  menuType: '',
  orderNum: '',
  icon: '',
  menuName: '',
  path: '',
  visible: '',
  status: ''
})

const formRef = ref(null)
const submitForm = async () => {
  await formRef.value.validate()
}
const close = () => {
  emit('close', false)
}

onMounted(() => {})
</script>

<template>
  <el-dialog v-model="props.dialogVisible" title="添加菜单" :before-close="close">
    <el-form :model="formDate" label-width="100" ref="formRef">
      <el-form-item label="上级菜单" prop="parentId">
        <el-input placeholder="请输入" v-model="formDate.parentId" style="width: 380px"></el-input>
      </el-form-item>
      <el-form-item label="菜单类别" prop="menuType">
        <el-radio-group v-model="formDate.menuType" class="ml-4">
          <el-radio label="M" size="large">目录 </el-radio>
          <el-radio label="C" size="large">菜单 </el-radio>
          <el-radio label="F" size="large">按钮 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示顺序" prop="orderNum">
        <el-input
          placeholder="排序顺序"
          v-model="formDate.orderNum"
          style="width: 380px"
        ></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input placeholder="请选择图标" v-model="formDate.icon" style="width: 380px"></el-input>
      </el-form-item>
      <el-form-item
        label="菜单名称"
        prop="menuName"
        :rules="[
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { mix: 2, max: 20, message: '最少2-20字符账号', trigger: 'blur' }
        ]"
      >
        <el-input placeholder="请输入" v-model="formDate.menuName" style="width: 380px"></el-input>
      </el-form-item>
      <el-form-item
        label="路由地址"
        prop="path"
        :rules="[{ required: true, message: '请输入路由地址', trigger: 'blur' }]"
      >
        <el-input placeholder="请输入" v-model="formDate.path" style="width: 380px"> </el-input>
      </el-form-item>
      <el-form-item label="显示状态" prop="visible">
        <el-radio-group v-model="formDate.visible" class="ml-4">
          <el-radio label="1" size="large">显示 </el-radio>
          <el-radio label="2" size="large">隐藏 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单状态" prop="status">
        <div class="mb-2 flex items-center text-sm">
          <el-radio-group v-model="formDate.status">
            <el-radio label="1">正常</el-radio>
            <el-radio label="2">停用</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.container {
  .el-dialog__footer {
    display: flex;
    justify-content: center;
    text-align: center !important;
  }
}
</style>
