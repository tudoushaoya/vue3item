<script setup>
import { ref } from 'vue'
import { uploadExcel } from '@/api/user'
const excelUploadInput = ref(null)
const props = defineProps({
  dialogTableVisible: {
    type: Boolean
  },
  handleSelectionChange: {
    type: Function,
    default: () => {}
  }
})
const handleUpload = () => {
  console.log(excelUploadInput.value.click())
}

const uploadChange = async (e) => {
  console.log(e.target.files)
  // 调用上传接口
  // uploadExcel() // 参数  form-data 需要文件file
  const files = e.target.files // input的文件列表
  if (files.length > 0) {
    // 大于0 说明有文件要上传
    const data = new FormData()
    console.log(data)
    // file: file类型
    data.append('file', files[0]) // 将文件参数加入到formData中
    try {
      await uploadExcel(data)
      // 成功
      // this.$emit('uploadSuccess') // 通知父组件 我上传成功
      // this.$emit('update:showExcelDialog', false) // 关闭弹层
      // this.$refs['excel-upload-input'].value = ''
    } catch (error) {
      // 捕获失败
      // this.$refs['excel-upload-input'].value = ''
    } finally {
      // 不论成功或者失败都会执行finally
      // this.$refs['excel-upload-input'].value = ''
    }
  }
}
</script>

<template>
  <el-dialog v-model="props.dialogTableVisible" title="导出">
    <input
      ref="excelUploadInput"
      class="excel-upload-input"
      type="file"
      accept=".xlsx, .xls"
      @change="uploadChange"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleUpload"> Confirm </el-button>
      </span>
    </template>
    {{ props.dialogTableVisible }}
  </el-dialog>
</template>
