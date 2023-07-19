<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  getClueDetailApi,
  addFollowApi,
  getSubjectApi,
  changeClueApi,
  changeBusinessApi
} from '@/api/clue.js'
import * as dayjs from 'dayjs'
defineOptions({ name: 'clueDetailPage' })
const route = useRoute()
const router = useRouter()
const id = +route.params.id
const intentionLevelOption = [
  { value: 1, label: 'A 近期学习' },
  { value: 2, label: 'B 打算学习,考虑中' },
  { value: 3, label: 'C 进行了解' },
  { value: 4, label: 'D 打酱油' }
]

const getClueDetail = async () => {
  const res = await getClueDetailApi(id)
  showInfo.value = res.data.clueEcho
  clueIntentions.value = res.data.clueIntentions
}

const showInfo = ref()
const clueIntentions = ref([])

onMounted(() => {
  getClueDetail()
})

const formSize = ref('default')

const rules = reactive({
  customerName: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  intentionLevel: [
    {
      required: true,
      message: '请选择意向等级',
      trigger: 'change'
    }
  ],
  intentionSubject: [
    {
      required: true,
      message: '请选择意向学科',
      trigger: 'change'
    }
  ],
  followRecords: [
    {
      required: true,
      message: '请填写跟进记录',
      trigger: 'change'
    }
  ],
  nextTime: [
    {
      required: true,
      message: '请输入下次跟踪时间',
      trigger: 'change'
    }
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change'
    }
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change'
    }
  ],
  desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
})

// 添加跟进
const ruleFormRef = ref()
const followInfo = ref({
  id,
  customerName: '',
  gender: 0,
  age: '',
  weChat: '',
  qqNum: '',
  intentionLevel: 1, //意向等级
  intentionSubject: '',
  followRecords: '', //跟进记录
  nextTime: '' //下次跟进时间
})

const subjectOption = ref([])
const getSubject = async () => {
  const res = await getSubjectApi()
  subjectOption.value = res.data
}

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      const obj = followInfo.value
      obj.nextTime = dayjs(obj.createTime).format('YYYY-MM-DD')
      await addFollowApi({ id, ...obj })
      ElMessage.success('添加跟进成功')
      ruleFormRef.value.resetFields()
      getClueDetail()
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 伪线索上报
const fakeCuleVisible = ref(false)
const fakeFormRef = ref(null)
const fakeClueForm = ref({
  clueId: id, //线索ID
  result: '', //原因
  notes: '' //备注
})

const fakeOption = ['空号', '已停机', '广告', '竞品', '无法联系', '其他']

const cancelFakeForm = () => {
  fakeFormRef.value.resetFields()
  fakeCuleVisible.value = false
}

const submitFakeForm = () => {
  fakeFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('submit!')
      await changeClueApi(fakeClueForm.value)
      ElMessage.success('伪线索上报成功')
      fakeCuleVisible.value = false
      router.push('/clue')
    } else {
      console.log('error submit!')
      return false
    }
  })
}

// 转商机
const reverseVisible = ref(false)
// 确认转商机
const confirmReverse = async () => {
  await changeBusinessApi(id)
  reverseVisible.value = false
  ElMessage.success('转商机成功')
  router.push('/clue')
}
</script>

<template>
  <div class="container">
    <div class="left">
      <div class="left-top">
        <el-card>
          <template #header>
            <h4>线索ID:XS45555</h4>
          </template>
          <!-- 展示信息 -->
          <el-row :gutter="60" v-if="showInfo">
            <el-col :span="8">创建时间 : {{ showInfo.createTime.replace('T', ' ') }}</el-col>
            <el-col :span="8">归属时间 : {{ showInfo.updateTime.replace('T', ' ') }}</el-col>
            <el-col :span="8">手机号 : {{ showInfo.phone }}</el-col>
            <el-col :span="8">渠道来源 : {{ showInfo.channel }}</el-col>
            <el-col :span="8">线索分配 : {{ showInfo.clueName }}</el-col>
            <el-col :span="8">线索归属 : {{ showInfo.belongPerson }}</el-col>
            <el-col :span="8">活动信息 : {{ showInfo.activity }}</el-col>
          </el-row>
        </el-card>
      </div>

      <!-- 添加跟进 -->
      <div class="left-bottom">
        <el-card>
          <template #header>
            <div class="leftBottomHeader">
              <h4>添加跟进</h4>
              <div>
                <el-button type="primary" @click="fakeCuleVisible = true">伪线索</el-button>
                <el-button type="primary" @click="reverseVisible = true">转商机</el-button>
              </div>
            </div>
          </template>

          <!-- 添加新进表格 -->
          <el-form
            ref="ruleFormRef"
            :model="followInfo"
            :rules="rules"
            label-width="120px"
            class="demo-ruleForm"
            :size="formSize"
            status-icon
          >
            <el-form-item label="客户姓名" prop="customerName">
              <el-input
                v-model="followInfo.customerName"
                placeholder="请输入"
                style="width: 180px"
              />
            </el-form-item>

            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="followInfo.gender">
                <el-radio :label="0">女</el-radio>
                <el-radio :label="1">男</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="年龄" prop="age">
              <el-input v-model.number="followInfo.age" placeholder="请输入" style="width: 180px" />
            </el-form-item>
            <el-form-item label="微信" prop="weChat">
              <el-input
                v-model="followInfo.weChat"
                placeholder="请输入"
                style="width: 180px"
              ></el-input>
            </el-form-item>

            <el-form-item label="QQ" prop="qqNum">
              <el-input
                v-model="followInfo.qqNum"
                placeholder="请输入"
                style="width: 180px"
              ></el-input>
            </el-form-item>

            <el-form-item label="意向等级" prop="intentionLevel">
              <el-radio-group v-model="followInfo.intentionLevel">
                <el-radio v-for="(el, i) in intentionLevelOption" :key="i" :label="el.value">{{
                  el.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="意向学科" prop="intentionSubject">
              <el-select
                v-model="followInfo.intentionSubject"
                placeholder="请选择"
                style="width: 380px"
                @focus="getSubject"
              >
                <el-option
                  v-for="(el, i) in subjectOption"
                  :key="i"
                  :label="el.dictLabel"
                  :value="el.dictLabel"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="跟进记录" prop="followRecords">
              <el-input
                v-model="followInfo.followRecords"
                maxlength="50"
                :rows="3"
                placeholder="请输入"
                show-word-limit
                type="textarea"
                style="width: 380px"
                resize="none"
              />
            </el-form-item>

            <el-form-item label="下次跟进时间:" prop="nextTime">
              <el-date-picker
                v-model="followInfo.nextTime"
                type="date"
                placeholder="请选择"
                style="width: 380px"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm(ruleFormRef)"
                style="translate: 500px 0; width: 100px"
              >
                确认
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
    <!-- 操作信息 -->
    <div class="right">
      <el-card>
        <template #header>
          <h4>操作记录</h4>
        </template>

        <div v-if="clueIntentions">
          <div class="content" v-for="(el, i) in clueIntentions" :key="i">
            <p>
              意向等级 :
              {{ intentionLevelOption.filter((item) => item.value === el.intentionLevel)[0].label }}
            </p>
            <p>意向学科 : {{ el.intentionSubject }}</p>
            <p>下次跟进时间 : {{ el.nextTime.replace('T', ' ') }}</p>
            <p>跟进记录 : {{ el.followRecords }}</p>
            <div class="right-bottom">
              <p>跟进人 : {{ showInfo.belongPerson }}</p>
              <p>{{ el.createTime }}</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>

  <!-- 伪线索 -->
  <el-dialog v-model="fakeCuleVisible" style="width: 560px" @close="cancelFakeForm">
    <template #header>
      <div>伪线索上报</div>
    </template>

    <!-- 表格 -->
    <div>上报说明</div>
    <el-form style="padding: 0 80px" :model="fakeClueForm" ref="fakeFormRef">
      <el-form-item label="原因" required label-width="60px" prop="result">
        <el-select
          v-model="fakeClueForm.result"
          class="m-2"
          placeholder="请选择"
          size="middle"
          style="width: 280px"
        >
          <el-option v-for="item in fakeOption" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="备注" label-width="60px" prop="notes">
        <el-input
          v-model="fakeClueForm.notes"
          type="textarea"
          maxlength="20"
          :rows="3"
          placeholder="请输入"
          show-word-limit
          resize="none"
          style="width: 280px"
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelFakeForm">取消</el-button>
        <el-button type="primary" @click="submitFakeForm"> 确定 </el-button>
      </div>
    </template></el-dialog
  >

  <!-- 转客户 -->
  <el-dialog
    v-model="reverseVisible"
    style="
      width: 360px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    "
  >
    <div>确认转为客户?</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="reverseVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReverse"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.container {
  padding: 10px;
  display: flex;
  max-height: 862px;
  .left {
    flex: 2;

    .left-top {
      background-color: yellow;
    }
    .left-bottom {
      .leftBottomHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .right {
    flex: 1;
    overflow: auto;

    .right-bottom {
      color: #ccc;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
  .el-card {
    font-size: 14px;
    box-shadow: none;
    border-radius: 0;

    :deep(.el-card__header) {
      padding-top: 0;
      padding-bottom: 0;
    }
    .el-col {
      margin: 1em 0;
    }
  }
}
</style>
