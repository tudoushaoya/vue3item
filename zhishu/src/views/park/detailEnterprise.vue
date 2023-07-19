<script setup>
import { onMounted } from 'vue'
import { getEnterprise } from '@/api/enterprise'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
const route = useRoute()
defineOptions({ name: 'detailEnterprise' })
const enterpriseDetail = ref({})
//定义列
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: '租赁楼宇',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '合同状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '租赁起止时间',
    dataIndex: 'startTime',
    key: 'startTime'
  },
  {
    title: '租赁合同',
    dataIndex: 'contractName',
    key: 'contractName'
  },
  {
    title: '录入时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '操作',
    dataIndex: 'active',
    key: 'active'
  }
]

//获取详情
const getEnterpriseDetail = async () => {
  console.log(route.params.id)
  const res = await getEnterprise(route.params.id)
  console.log(res.data)
  enterpriseDetail.value = res.data
}

// //合同下载
// const downloadContract1 = async (id) => {
//   console.log(id)
//   const res = await downloadContract(id)
//   console.log(res)
// }

onMounted(() => {
  getEnterpriseDetail()
})
</script>
<template>
  <a-layout>
    <a-layout-header class="header" :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
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
        <a-form :label-col="{ span: 6 }" ref="addFormRef">
          <a-row>
            <a-col :span="12">
              <a-form-item style="margin-right: 20px" label="企业名称">
                <span>{{ enterpriseDetail.name }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="法人">
                <span>{{ enterpriseDetail.legalPerson }}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item style="margin-right: 20px" label="企业地址">
                <span>{{ enterpriseDetail.registeredAddress }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="所在行业">
                <span>{{ enterpriseDetail.industryName }}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="营业执照" style="margin-left: -150px">
            <img :src="enterpriseDetail.businessLicenseUrl" alt="" style="width: 300px" />
          </a-form-item>
        </a-form>
      </a-card>
      <a-card title="企业信息">
        <a-form :label-col="{ span: 6 }" ref="addFormRef">
          <a-row>
            <a-col :span="12">
              <a-form-item style="margin-right: 20px" label="企业联系人">
                <span>{{ enterpriseDetail.contact }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="联系电话">
                <span>{{ enterpriseDetail.contactNumber }}</span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
      <a-card title="租赁记录">
        <a-table :columns="columns" :dataSource="enterpriseDetail.rent">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'contractName'">
              <a
                type="link"
                target="_blank"
                :href="'https://view.officeapps.live.com/op/view.aspx?src=' + record.contractUrl"
                >{{ record.contractName }}</a
              >
            </template>
            <template v-if="column.dataIndex === 'active'">
              <a :href="record.contractUrl" download>合同下载</a>
            </template>
            <template v-if="column.dataIndex === 'startTime'">
              {{ record.startTime + '至' + record.endTime }}
            </template>
            <template v-if="column.dataIndex === 'index'">
              {{ 1 }}
            </template>
            <template v-if="column.dataIndex === 'status'">
              <a-tag v-if="record.status === 0" color="green">待生效</a-tag>
              <a-tag v-if="record.status === 1" color="pink">生效中</a-tag>
              <a-tag v-if="record.status === 2" color="red">已到期</a-tag>
              <a-tag v-if="record.status === 3" color="default">已退租</a-tag>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-layout-content>
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
  /* height: calc(100vh - 64px); */
  padding: 20px 130px;
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
