<script setup>
import { onMounted, ref } from 'vue'
// import { ElMessage } from 'element-plus'

defineOptions({
  name: 'add_edit_User'
})

const props = defineProps({
  visible: {
    type: Boolean
  }
})
// 通知父组件
const emit = defineEmits(['close', 'add'])

const formDate = ref({})

const formRef = ref(null)
const submitForm = async () => {
  // try {
  // } catch (e) {
  //   console.log(e)
  // }
}
const close = () => {
  emit('close', false)
}

// 折叠面板
const activeNames = ref(['1'])
const handleChange = (val) => {
  console.log(val)
}

onMounted(() => {})
</script>

<template>
  <el-dialog v-model="props.visible" title="添加角色" :before-close="close">
    <el-form :model="formDate" label-width="100" ref="formRef">
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="角色名称"
            prop=""
            :rules="[
              { required: true, message: '请输入角色名称', trigger: 'blur' },
              { mix: 2, max: 4, message: '请正确输入角色名称', trigger: 'blur' }
            ]"
          >
            <el-input placeholder="请输入" v-model="formDate.ss"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="权限字符"
            prop=""
            :rules="[
              { required: true, message: '请输入权限字符', trigger: 'blur' },
              { mix: 2, max: 20, message: '请正确输入权限字符', trigger: 'blur' }
            ]"
          >
            <el-input placeholder="请输入" v-model="formDate.ss"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色顺序" prop="">
            <el-input placeholder="请输入" v-model="formDate.ss"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="状态"
            prop=""
            :rules="[{ required: true, message: '请选择状态', trigger: 'blur' }]"
          >
            <div class="mb-2 flex items-center text-sm">
              <el-radio-group v-model="radio1" class="ml-4">
                <el-radio label="正常">正常</el-radio>
                <el-radio label="停用">停用</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm"> 确认 </el-button>
      </span>
    </template>
    <div class="demo-collapse">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="首页" name="1">
          <el-checkbox v-model="checked1" label="查看" size="large" />
          <el-checkbox v-model="checked2" label="编辑" size="large" />
          <el-checkbox v-model="checked2" label="新增" size="large" />
          <el-checkbox v-model="checked2" label="删除" size="large" />
          <el-checkbox v-model="checked2" label="禁用" size="large" />
          <el-checkbox v-model="checked2" label="导入" size="large" />
          <el-checkbox v-model="checked2" label="批量处理" size="large" />
          <el-checkbox v-model="checked2" label="搜索" size="large" />
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="demo-collapse">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="用户管理" name="1">
          <el-checkbox v-model="checked1" label="查看" size="large" />
          <el-checkbox v-model="checked2" label="编辑" size="large" />
          <el-checkbox v-model="checked2" label="新增" size="large" />
          <el-checkbox v-model="checked2" label="删除" size="large" />
          <el-checkbox v-model="checked2" label="禁用" size="large" />
          <el-checkbox v-model="checked2" label="导入" size="large" />
          <el-checkbox v-model="checked2" label="批量处理" size="large" />
          <el-checkbox v-model="checked2" label="搜索" size="large" />
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="demo-collapse">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="首页" name="1">
          <el-checkbox v-model="checked1" label="查看" size="large" />
          <el-checkbox v-model="checked2" label="编辑" size="large" />
          <el-checkbox v-model="checked2" label="新增" size="large" />
          <el-checkbox v-model="checked2" label="删除" size="large" />
          <el-checkbox v-model="checked2" label="禁用" size="large" />
          <el-checkbox v-model="checked2" label="导入" size="large" />
          <el-checkbox v-model="checked2" label="批量处理" size="large" />
          <el-checkbox v-model="checked2" label="搜索" size="large" />
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-dialog__footer {
  text-align: center !important;
}
</style>
