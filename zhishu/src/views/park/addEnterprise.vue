<script setup>
defineOptions({ name: 'addEnterprise' })
import { reactive, ref, onMounted } from 'vue'
import {
  getIndustry,
  uploadContractFile,
  addEnterprise,
  getEnterprise,
  editEnterprise
} from '@/api/enterprise'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const addForm = reactive({
  name: '',
  legalPerson: '',
  registeredAddress: '',
  industryCode: null,
  businessLicenseUrl: '',
  businessLicenseId: null,
  contact: '',
  contactNumber: ''
})
const editForm = reactive({})
const addFormRef = ref(null)
const addFormRef1 = ref(null)
const options = ref([])
//获取行业
const getIndustryList = async () => {
  const res = await getIndustry()
  options.value = res.data
}
//上传图片
//上传前的回调
const handleBeforeUpload = (file) => {
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('文件大小不能超过5M')
  }
  return false
}
// 上传图片
const updateContract = async (file) => {
  const formData = new FormData()
  formData.append('file', file.file)
  formData.append('type', 'businessLicense2')
  const res = await uploadContractFile(formData)
  addForm.businessLicenseUrl = res.data.url
  addForm.businessLicenseId = res.data.id
}
//获取企业详情
const getEnterpriseDetail = async () => {
  const res = await getEnterprise(route.params.id)
  addForm.name = res.data.name
  addForm.legalPerson = res.data.legalPerson
  addForm.registeredAddress = res.data.registeredAddress
  addForm.industryCode = res.data.industryCode
  addForm.businessLicenseUrl = res.data.businessLicenseUrl
  addForm.businessLicenseId = res.data.businessLicenseId
  addForm.contact = res.data.contact
  addForm.contactNumber = res.data.contactNumber
}

//删除文件
const handleRemove = () => {
  addForm.businessLicenseUrl = ''
  addForm.businessLicenseId = null
}
// 提交添加企业
const btnSubmit = async () => {
  addFormRef.value.validate()
  addFormRef1.value.validate()
  if (route.params.id) {
    editForm.id = route.params.id
    editForm.name = addForm.name
    editForm.legalPerson = addForm.legalPerson
    editForm.registeredAddress = addForm.registeredAddress
    editForm.industryCode = addForm.industryCode
    editForm.businessLicenseUrl = addForm.businessLicenseUrl
    editForm.businessLicenseId = addForm.businessLicenseId
    editForm.contact = addForm.contact
    editForm.contactNumber = addForm.contactNumber
    //编辑
    await editEnterprise(editForm)
    message.success('编辑成功')
  } else {
    //添加
    await addEnterprise(addForm)
    message.success('添加成功')
  }
  handleRemove()
  router.push('/park/enterprise')
  btnReset()
}
//重置
const btnReset = () => {
  addFormRef.value.resetFields()
  addFormRef1.value.resetFields()
}
onMounted(() => {
  getIndustryList()
  getEnterpriseDetail()
})
</script>
<template>
  <a-layout>
    <a-layout-header class="header">
      <div>
        <div>
          <span @click="() => $router.go(-1)">
            <ArrowLeftOutlined />
            <span>返回</span>
          </span>
          <span>添加企业</span>
        </div>
        <span>黑马管理员</span>
      </div>
    </a-layout-header>
    <a-layout-content class="main">
      <a-card title="企业信息">
        <a-form :model="addForm" :label-col="{ span: 6 }" ref="addFormRef">
          <a-row>
            <a-col :span="12">
              <a-form-item
                style="margin-right: 20px"
                label="企业名称"
                name="name"
                :rules="[{ required: true, message: '请输入企业名称', trigger: 'blur' }]"
              >
                <a-input placeholder="请输入企业名称" v-model:value="addForm.name" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="法人"
                name="legalPerson"
                :rules="[{ required: true, message: '请输入企业名称', trigger: 'blur' }]"
              >
                <a-input placeholder="请输入法人" v-model:value="addForm.legalPerson" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                style="margin-right: 20px"
                label="注册地址"
                name="registeredAddress"
                :rules="[{ required: true, message: '请输入企业名称', trigger: 'blur' }]"
              >
                <a-input placeholder="请输入注册地址" v-model:value="addForm.registeredAddress" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="所在行业"
                name="industryCode"
                :rules="[{ required: true, message: '请输入企业名称', trigger: 'blur' }]"
              >
                <a-select
                  v-model:value="addForm.industryCode"
                  :options="options"
                  :field-names="{ label: 'industryName', value: 'industryCode' }"
                  placeholder="请选择所在行业"
                >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item
            style="margin-left: -150px"
            label="营业执照"
            name="businessLicenseId"
            :rules="[{ required: true, message: '请上传营业执照', trigger: 'blur' }]"
          >
            <a-upload
              accept=".png ,.jpg ,.jpeg"
              :beforeUpload="handleBeforeUpload"
              @change="updateContract"
              @remove="handleRemove"
            >
              <a-button
                type="link"
                style="background-color: #edf5ff; border-radius: 5px"
                :disabled="addForm.businessLicenseId ? true : false"
              >
                <upload-outlined />
                上传文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item-extra style="color: #00000073"
            >支持扩展名：.png .jpg .jpeg，文件大小不得超过5M</a-form-item-extra
          >
        </a-form>
      </a-card>
      <a-card title="联系人信息">
        <a-form :model="addForm" :label-col="{ span: 6 }" ref="addFormRef1">
          <a-row>
            <a-col :span="12">
              <a-form-item
                style="margin-right: 20px"
                label="企业联系人"
                name="contact"
                :rules="[{ required: true, message: '请输入企业联系人', trigger: 'blur' }]"
              >
                <a-input placeholder="请输入企业联系人" v-model:value="addForm.contact" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="联系电话"
                name="contactNumber"
                :rules="[{ required: true, message: '请输入联系电话', trigger: 'blur' }]"
              >
                <a-input placeholder="请输入联系电话" v-model:value="addForm.contactNumber" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-layout-content>
    <a-layout-footer class="footer">
      <a-space>
        <a-button @click="btnReset">重置</a-button>
        <a-button type="primary" @click="btnSubmit">确定</a-button>
      </a-space>
    </a-layout-footer>
  </a-layout>
</template>

<style>
.header {
  background-color: #fff;

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;

    > div {
      display: flex;
      align-items: center;

      :first-child {
        cursor: pointer;
      }

      > span {
        margin-right: 20px;
      }
    }
  }
}

.ant-layout-header {
  padding: 0 20px;
}

.main {
  height: calc(100vh - 64px - 74px);
  padding: 20px 130px;
}

.footer {
  background-color: #fff;
  height: 74px;
  text-align: center;
}

.ant-card-head {
  border-bottom: none;
}

.ant-card-body {
  padding: 20px 65px 24px;
}

.ant-card {
  margin-bottom: 20px;
}
</style>
