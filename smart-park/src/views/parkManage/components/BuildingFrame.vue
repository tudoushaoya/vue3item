<template>
  <el-dialog
    :title="isEdit?'编辑楼宇':'新增楼宇'"
    :visible="isShow"
    width="35%"
    @close="cancel"
  >
    <el-form ref="detailRowRef" :model="detailRow" :rules="detailRowRule">
      <el-form-item label="楼宇名称" prop="name">
        <el-input v-model="detailRow.name" size="small" placeholder="请输入楼宇名称" />
      </el-form-item>
      <el-form-item label="楼宇层数" prop="floors">
        <el-input v-model="detailRow.floors" size="small" placeholder="请输入楼宇层数" />
      </el-form-item>
      <el-form-item label="在管面积(m²)" prop="area">
        <el-input v-model="detailRow.area" size="small" placeholder="请输入在管面积">
          <template slot="append">m²</template>
        </el-input>
      </el-form-item>
      <el-form-item label="物业费(元/m²)" prop="propertyFeePrice">
        <el-input v-model="detailRow.propertyFeePrice" size="small" placeholder="请输入物业费">
          <template slot="append">元/m²</template>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel">取 消</el-button>
      <el-button type="primary" size="small" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'BuildingFrame',
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    detailRow: {
      type: Object,
      default: () => {}
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detailRowRule: {
        name: [
          { required: true, message: '请输入楼宇名称', trigger: 'blur' }
        ],
        floors: [
          { required: true, message: '请输入楼宇层数', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入在管面积', trigger: 'blur' }
        ],
        propertyFeePrice: [
          { required: true, message: '请输入物业费', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {},
  methods: {
    cancel() {
      this.$emit('update:isShow', false)
      this.$refs.detailRowRef.resetFields()
    },
    async submit() {
      this.$refs.detailRowRef.validate()
      if (this.isEdit) {
        // 编辑
        const obj = { ...this.detailRow }
        delete obj.status
        this.$emit('changeRow', obj)
        this.$emit('update:isShow', false)
        this.$message.success('编辑成功')
      } else {
        // 新增
        const obj = { ...this.detailRow }
        delete obj.status
        delete obj.id
        this.$emit('addRow', obj)
        this.$emit('update:isShow', false)
        this.$message.success('新增成功')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
    padding: 30px 70px 0;
}
</style>
