<script setup>
defineOptions({ name: 'roleAdd' })
import { useRouter } from 'vue-router'
import { ref, reactive, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { getFunctionTree, addRole } from '@/api/role'
const router = useRouter()
const selectedKeys = ref([])
const checkedKeys = ref([])
watch(checkedKeys, (val) => {
  selectedKeys.value.push(...val)
  selectedKeys.value = [...new Set(selectedKeys.value)]
  checkedKeys.value = selectedKeys.value
})
const formData = reactive({
  username: '',
  describe: ''
})
const addRoleForm = ref({})
const first = ref(true)
const second = ref(false)
const thirdly = ref(false)
const functionTree = ref([])
const steps = [
  {
    title: '角色信息',
    content: '1'
  },
  {
    title: '权限信息',
    content: '2'
  },
  {
    title: '检查并完成',
    content: '3'
  }
]
const current = ref(0)
const getFunctionTreeAPI = async () => {
  const { data } = await getFunctionTree()
  functionTree.value = data
}
const goBack = () => {
  router.go(-1)
}
const formRef = ref(null)
const next = () => {
  formRef.value.validate()
  current.value++
  if (current.value === 1) {
    first.value = false
    second.value = true
  }
  if (current.value === 2) {
    second.value = false
    thirdly.value = true
  }
}
const prev = () => {
  current.value--
  if (current.value === 2) {
    second.value = false
    thirdly.value = true
  }
  if (current.value === 1) {
    second.value = true
    thirdly.value = false
  }
  if (current.value === 0) {
    first.value = true
    second.value = false
  }
}
const fieldNames = ref({
  key: 'id'
})
const addRoleAPI = async () => {
  addRoleForm.value.perms = [...addRoleForm.value.perms]
  addRoleForm.value.perms.forEach((item, index) => {
    if (!item) {
      addRoleForm.value.perms[index] = []
    }
  })
  await addRole(addRoleForm.value)
}
const submit = () => {
  addRoleForm.value.remark = formData.describe
  addRoleForm.value.roleName = formData.username
  addRoleForm.value.perms = checkedKeys.value
  addRoleAPI()
  message.success('提交成功')
  router.go(-1)
}
onMounted(() => {
  getFunctionTreeAPI()
})
</script>
<template>
  <div class="box">
    <div class="top">
      <a-page-header style="background: #fff" @back="goBack">
        <template #tags>
          <span style="font-size: 17px; cursor: pointer" @click="goBack">返回</span>
          <MoreOutlined style="padding: 0 10px"></MoreOutlined>
          <span style="font-size: 17px">添加角色</span>
        </template>
        <template #extra>
          <span style="font-size: 17px">黑马程序员</span>
        </template>
      </a-page-header>
    </div>
    <div style="height: 60px"></div>
    <div class="container">
      <div class="left">
        <a-steps :current="current" direction="vertical">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
      </div>
      <div class="steps-content">
        <div class="right1" v-show="first">
          <a-card title="角色信息" :bordered="false" style="width: 700px">
            <a-form
              :model="formData"
              name="basic"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
              ref="formRef"
            >
              <a-form-item
                label="角色名称"
                name="username"
                :rules="[{ required: true, message: '请输入角色名称' }]"
              >
                <a-input v-model:value="formData.username" placeholder="请输入" />
              </a-form-item>

              <a-form-item label="角色描述" name="describe">
                <a-textarea v-model:value="formData.describe" placeholder="请输入" :rows="4" />
              </a-form-item>
            </a-form>
          </a-card>
          <div style="height: 140px; background: #f4f6f8"></div>
        </div>
        <div class="right2" v-show="second">
          <a-card title="权限配置" :bordered="false" style="width: 700px">
            <a-row type="flex">
              <a-col flex="auto" v-for="(item, index) in functionTree" :key="item.id">
                <div>{{ item.title }}</div>
                <a-tree
                  checkable
                  :tree-data="item.children"
                  :key="item.id"
                  v-model:checked-keys="checkedKeys[index]"
                  defaultExpandAll
                  :field-names="fieldNames"
                >
                  <template #title="{ title }">
                    <span>{{ title }}</span>
                  </template>
                </a-tree>
              </a-col>
            </a-row>
          </a-card>
          <div style="height: 140px; background: #f4f6f8"></div>
        </div>
        <div class="right3" v-show="thirdly">
          <a-card title="检查并完成" :bordered="false" style="width: 700px">
            <div>角色名称：{{ formData.username }}</div>
            <div>角色描述：{{ formData.describe }}</div>
            <div>角色权限：</div>
            <a-row type="flex">
              <a-col flex="auto" v-for="(item, index) in functionTree" :key="item.id">
                <div>{{ item.title }}</div>
                <a-tree
                  checkable
                  :tree-data="item.children"
                  :key="item.id"
                  disabled
                  v-model:checked-keys="checkedKeys[index]"
                  defaultExpandAll
                  :field-names="fieldNames"
                >
                  <template #title="{ title }">
                    <span>{{ title }}</span>
                  </template>
                </a-tree>
              </a-col>
            </a-row>
          </a-card>
          <div style="height: 140px; background: #f4f6f8"></div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="steps-action">
        <a-button v-if="current < steps.length - 1" type="primary" @click="next">下一步</a-button>
        <a-button v-if="current == steps.length - 1" type="primary" @click="submit">
          提交
        </a-button>
        <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">上一步</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.box {
  width: 100%;
  height: 100vh;
  background: #f4f6f8;
  overflow: hidden;
}
.top {
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  z-index: 999;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  width: 100%;
  height: 100vh;
  background: #f4f6f8;
  padding: 30px;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .right1 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 20px;
  }
  .right2 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 20px;
  }
  .right3 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 20px;
  }
}
</style>
