<script setup>
import { addBuilding, editBuilding } from '@/api/building.js'
import { message } from 'ant-design-vue'
import { computed, watch, ref } from 'vue'
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
  currentId: {
    type: Number
  },
  Editor: {
    type: Object
  }
})

const showTitle = computed(() => (formData.value.id ? '编辑楼宇' : '添加楼宇'))
//获取楼宇详情

const formRef = ref(null) //声明变量
const emit = defineEmits(['update:showDialog', 'addSucces', 'currentId'])
const btnCancel = () => {
  //清空表单
  formRef.value?.resetFields()
  emit('clearId')
  emit('update:showDialog', false)
}

const formData = ref({
  name: '',
  id: null,
  floors: null,
  area: null,
  propertyFeePrice: null
})

const dataEcho = () => {
  console.log(props.Editor)
  if (props.Editor) {
    formData.value.id = props.Editor.id
    formData.value.name = props.Editor.name
    formData.value.floors = props.Editor.floors
    formData.value.area = props.Editor.area
    formData.value.propertyFeePrice = props.Editor.propertyFeePrice
  }
}
const onFinish = async (values) => {
  //判断有无id
  if (formData.value.id) {
    //编辑楼宇
    await editBuilding(formData.value)
    message.success('编辑楼宇成功')
  } else {
    await addBuilding(values)
    message.success('添加楼宇成功')
  }
  emit('addSucces') //通知父组件更新
  btnCancel() //关闭弹层
}
</script>
<template>
  <a-modal :visible="props.showDialog" :title="showTitle" :footer="null" @cancel="btnCancel">
    <a-form :model="formData" @finish="onFinish" ref="formRef">
      <a-form-item
        label="用户姓名"
        name="name"
        :rules="[
          { required: true, message: '楼宇名不能为空', trigger: 'blur' },
          { min: 2, max: 6, message: '楼宇名2-6个字符', trigger: 'blur' }
        ]"
      >
        <a-input placeholder="请输入楼宇名称" v-model:value="formData.name"></a-input>
      </a-form-item>
      <a-form-item
        label="楼宇层数"
        name="floors"
        :rules="[{ required: true, message: '楼宇层数不能为空', trigger: 'blur' }]"
      >
        <a-input-number
          class="custom-input-number"
          v-model:value="formData.floors"
        ></a-input-number>
      </a-form-item>
      <a-form-item
        label="在管面积"
        name="area"
        :rules="[{ required: true, message: '在管面积不能为空', trigger: 'blur' }]"
      >
        <a-input placeholder="请输入在管面积" v-model:value="formData.area">
          <template #addonAfter>m²</template>
        </a-input>
      </a-form-item>
      <a-form-item
        label="物业费"
        name="propertyFeePrice"
        :rules="[{ required: true, message: '物业费不能为空', trigger: 'blur' }]"
      >
        <a-input placeholder="请输入物业费" v-model:value="formData.propertyFeePrice">
          <template #addonAfter>元m²</template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">确认</a-button>
        <a-button @click="btnCancel">取消</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
