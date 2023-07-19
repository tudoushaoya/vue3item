<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { addRegion, editRegion } from '@/api/region'
import { message } from 'ant-design-vue'
watch(
  () => props.showDialog,
  (newVal) => {
    if (newVal) {
      dataEcho()
    }
  }
)
const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },

  formitem: {
    type: Object
  }
})

const formData = reactive({
  id: null, // 区域id
  areaName: '', // 区域名称
  spaceNumber: null, // 车位数
  areaProportion: null, // 面积
  ruleId: null, // 计费规则,
  ruleName: '', // 计费规则名称
  remark: '' // 备注
})
// 数据回显
const dataEcho = () => {
  if (props.formitem) {
    console.log(props.formitem)

    formData.id = props.formitem.id
    formData.areaName = props.formitem.areaName
    formData.spaceNumber = props.formitem.spaceNumber
    formData.areaProportion = props.formitem.areaProportion
    formData.ruleId = props.formitem.ruleId
    formData.remark = props.formitem.remark
    console.log(formData)
  }
}
const formRef = ref(null)
const emit = defineEmits(['update:showDialog', 'addSuccess'])
const btnCancel = () => {
  formRef.value.resetFields() // 重置表单
  emit('update:showDialog', false)
}
const onFinish = async (values) => {
  if (formData.id) {
    // 编辑
    values.id = formData.id
    const res = await editRegion(values)
    console.log(res)
    message.success('编辑成功')
  } else {
    // 添加
    const res = await addRegion(values)
    console.log(res)
    message.success('添加成功')
  }
  emit('addSuccess')
  btnCancel()
}
const showTitle = computed(() => (formData.id ? '编辑区域' : '添加区域'))
</script>
<template>
  <a-modal :title="showTitle" :visible="props.showDialog" :footer="null" @cancel="btnCancel">
    <a-form :model="formData" :label-col="{ span: 6 }" ref="formRef" @finish="onFinish">
      <a-form-item
        label="区域名称"
        name="areaName"
        :rules="[{ required: true, message: '区域名称不能为空', trigger: 'blur' }]"
      >
        <a-input v-model:value="formData.areaName" placeholder="请输入区域名称"></a-input>
      </a-form-item>
      <a-form-item
        label="车位数(个)"
        name="spaceNumber"
        :rules="[{ required: true, message: '车位个数不能为空', trigger: 'blur' }]"
      >
        <a-input v-model:value="formData.spaceNumber" placeholder="请输入车位个数"></a-input>
      </a-form-item>
      <a-form-item
        label="面积(㎡)"
        name="areaProportion"
        :rules="[{ required: true, message: '面积不能为空', trigger: 'blur' }]"
      >
        <a-input v-model:value="formData.areaProportion" placeholder="请输入面积"></a-input>
      </a-form-item>
      <a-form-item
        label="关联计费规则"
        name="ruleId"
        :rules="[{ required: true, message: '面积不能为空', trigger: 'blur' }]"
      >
        <a-select v-model:value="formData.ruleId" placeholder="请选择">
          <a-select-option value="1">分段计费</a-select-option>
          <a-select-option value="2">按次计费</a-select-option>
          <a-select-option value="3">按小时计费</a-select-option>
          <a-select-option value="4">按分钟计费</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="formData.remark" placeholder="请输入备注"></a-textarea>
      </a-form-item>
      <a-form-item>
        <a-row justify="center" style="margin-top: 10px">
          <a-space>
            <a-button type="primary" html-type="submit">确定</a-button>
            <a-button @click="btnCancel">取消</a-button>
          </a-space>
        </a-row>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
