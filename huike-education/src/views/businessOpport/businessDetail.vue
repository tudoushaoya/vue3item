<script setup>
defineOptions({ name: 'businessDetailePage' })
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCustomerInfo } from '@/api/business'
import useAreaListData from '@/stores/PiniaStore.js'
import { updateFollowRecord } from '@/api/business.js'
const areaListData = useAreaListData()
const router = useRouter()
const route = useRoute()
const headerRowStyle = {
  backgroundColor: '#e6f0ec',
  fontSize: '13px',
  color: '#666666',
  textAlign: 'center'
}
const cellStyle = {
  fontSize: '13px',
  color: '#333333',
  textAlign: 'center'
}

const saveCustomerInfo = ref({
  communication: {
    communicationState: '',
    communicationTimeNext: '',
    emphasis: '',
    communicationNotes: '',
    communicationTime: '',
    communicator: 'list'
  }
})
const nowTime = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2)
  const day = ('0' + currentDate.getDate()).slice(-2)
  const hours = ('0' + currentDate.getHours()).slice(-2)
  const minutes = ('0' + currentDate.getMinutes()).slice(-2)
  const seconds = ('0' + currentDate.getSeconds()).slice(-2)
  const formattedDateTime =
    year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  saveCustomerInfo.value.communication.communicationTime = formattedDateTime
}
const customerInfoForm = ref([])
const tableData = ref([])
const getCustomerInfoAPI = async () => {
  if (route.params.flag === '1') {
    num.value = 12
  } else {
    num.value = 6
  }
  const res = await getCustomerInfo(route.params.id)
  tableData.value = res.data.communications
  tableData.value.forEach((item) => {
    item.communicationState = item.communicationState.replace('T', ' ')
  })
  customerInfoForm.value = res.data
  customerInfoForm.value.city = +res.data.city
  Object.assign(saveCustomerInfo.value, customerInfoForm.value)
}

const saveCustomerInfoConfirm = async () => {
  nowTime()
  Object.assign(saveCustomerInfo.value, customerInfoForm.value)
  delete saveCustomerInfo.value.communications
  await updateFollowRecord(saveCustomerInfo.value)
  getCustomerInfoAPI()
}
const num = ref(6)
const dialogFormVisible = ref(false)
const subjectList = ref([])
const areaList = ref([])
const professions = [
  '医生',
  '教师',
  '工程师',
  '律师',
  '会计师',
  '设计师',
  '销售员',
  '经理',
  '顾问',
  '程序员'
]
const educationLevels = ['小学', '初中', '高中', '大专', '本科', '硕士', '博士']
const majors = [
  '计算机科学与技术',
  '电子工程',
  '化学工程',
  '机械工程',
  '土木工程',
  '生物医学工程',
  '金融学',
  '市场营销',
  '会计学',
  '英语',
  '法律',
  '心理学',
  '环境科学',
  '艺术与设计',
  '音乐',
  '传媒学',
  '教育学',
  '历史学',
  '体育学',
  '物理学',
  '化学',
  '数学',
  '生物学',
  '地理学',
  '社会学',
  '护理学',
  '药学',
  '农业科学',
  '电子商务',
  '电影制作',
  '环境工程',
  '食品科学',
  '旅游管理',
  '公共管理',
  '国际关系',
  '哲学',
  '建筑学',
  '室内设计',
  '时装设计',
  '航空航天工程',
  '汽车工程',
  '化妆艺术',
  '酒店管理',
  '人力资源管理',
  '网络安全',
  '人工智能',
  '数据科学',
  '人类学',
  '考古学',
  '神经科学',
  '生物技术',
  '体育管理',
  '能源工程'
]
const employmentStatus = [
  '在职',
  '离职',
  '待业',
  '自由职业',
  '学生',
  '退休',
  '实习',
  '兼职',
  '创业',
  '家庭主妇'
]
const salaryRanges = [
  '1000 - 3000',
  '3000 - 5000',
  '5000 - 8000',
  '8000 - 10000',
  '10000 - 15000',
  '15000 - 20000',
  '20000 - 30000',
  '30000 - 50000',
  '50000 - 80000',
  '80000以上'
]
const studyReasons = [
  '提升职业技能',
  '进修学历',
  '转行就业',
  '兴趣爱好',
  '拓展知识面',
  '学术研究',
  '实现个人目标',
  '追求博学多才',
  '改变生活态度',
  '为未来打好基础'
]
const careerPlans = [
  '晋升为部门经理',
  '创办自己的公司',
  '成为行业专家',
  '追求更高薪资',
  '转向研究领域',
  '拓展国际市场',
  '提升领导力技能',
  '实现工作与生活平衡',
  '成为优秀的团队领导',
  '贡献于公益事业'
]
const studyTimePlans = [
  '每天早晨专注学习30分钟',
  '每晚学习新知识1小时',
  '每周末参加学习小组讨论',
  '每周阅读1本学术书籍',
  '定期参加学术研讨会',
  '每月报名参加一个在线课程',
  '制定每周学习计划',
  '每天复习当天学习的内容',
  '每季度评估学习进度并调整学习计划',
  '每年参加学术会议或学习交流活动'
]
const itRelatedCourses = [
  '计算机编程（如Python、Java、C++等）',
  'Web开发（HTML、CSS、JavaScript等）',
  '移动应用开发（Android、iOS等）',
  '数据库管理与设计',
  '数据科学与机器学习',
  '人工智能与深度学习',
  '网络与系统安全',
  '网络与云计算',
  'DevOps与持续集成/持续交付',
  '人机交互与用户体验设计',
  '网络管理与监控',
  '物联网与嵌入式系统',
  '虚拟现实与增强现实开发',
  '软件工程与项目管理',
  '网络分析与网络安全',
  '信息安全与密码学',
  '数据可视化',
  '人工智能伦理与法律',
  '人工智能在医疗保健中的应用',
  '区块链技术与加密货币',
  '云计算与大数据',
  '网络编程与系统设计',
  '网络运维与故障排除',
  '云平台开发与部署',
  '机器人技术与控制',
  '计算机图形学与游戏开发',
  '网络通信与协议',
  '软件测试与质量保证',
  '计算机网络与通信',
  '数据仓库与商业智能',
  '网络攻防与渗透测试',
  'IT项目管理与团队协作'
]
onMounted(() => {
  getCustomerInfoAPI()
  areaList.value = areaListData.setAreaList
  subjectList.value = areaListData.setSubjectList
})
</script>
<template>
  <el-button @click="router.go(-1)" type="primary">返回</el-button>
  <el-form label-width="100px" label-position="top" :model="customerInfoForm">
    <el-card shadow="never">
      <template #header>
        <span>客户资料 ID</span>
        <span style="font-size: 14px; color: #aeb5c4; user-select: none; cursor: not-allowed">{{
          route.params.id
        }}</span>
      </template>
      <el-row :gutter="80">
        <el-col :span="6"
          ><el-form-item label="客户姓名" prop="customerName">
            <el-input
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="customerInfoForm.customerName"
              disabled
            />
            <span v-else>{{ customerInfoForm.customerName }}</span>
          </el-form-item></el-col
        >
        <el-col :span="6"
          ><el-form-item label="手机号" prop="phone">
            <el-input
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="customerInfoForm.phone"
            ></el-input>
            <span v-else>{{ customerInfoForm.phone }}</span></el-form-item
          ></el-col
        >
        <el-col :span="6"
          ><el-form-item label="职业" prop="profession">
            <el-select
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="customerInfoForm.profession"
            >
              <el-option
                v-for="(item, index) in professions"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
            <span v-else>{{ customerInfoForm.profession }}</span></el-form-item
          ></el-col
        >
        <el-col :span="6"
          ><el-form-item label="学历" prop="schoolRecord">
            <el-select
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="customerInfoForm.schoolRecord"
            >
              <el-option
                v-for="(item, index) in educationLevels"
                :key="index"
                :label="item"
                :value="item"
              /> </el-select
            ><span v-else>{{ customerInfoForm.schoolRecord }}</span>
          </el-form-item></el-col
        >
      </el-row>
      <el-row :gutter="80">
        <el-col :span="6"
          ><el-form-item label="所在地区" prop="city">
            <el-tree-select
              v-if="+route.params.flag === 1"
              class="inputWidth"
              :data="areaList"
              :props="{ label: 'name', value: 'pid', children: 'cityList' }"
              v-model="customerInfoForm.city"
            ></el-tree-select
            ><span v-else>{{ customerInfoForm.city }}</span>
          </el-form-item></el-col
        >
        <el-col :span="6">
          <el-form-item label="微信号" prop="weChatNum">
            <el-input
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="customerInfoForm.weChatNum"
            ></el-input>
            <span v-else>{{ customerInfoForm.weChatNum }}</span></el-form-item
          ></el-col
        >
        <el-col :span="6">
          <el-form-item label="年龄" prop="age">
            <el-input-number
              v-if="+route.params.flag === 1"
              style="width: 100%"
              v-model="customerInfoForm.age"
              controls-position="right"
            ></el-input-number>
            <span v-else>{{ customerInfoForm.age }}</span></el-form-item
          ></el-col
        >
        <el-col :span="6"
          ><el-form-item label="专业" prop="major">
            <el-select
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="customerInfoForm.major"
            >
              <el-option
                v-for="(item, index) in majors"
                :key="index"
                :label="item"
                :value="item"
              /> </el-select
            ><span v-else>{{ customerInfoForm.major }}</span>
          </el-form-item></el-col
        >
      </el-row>
      <el-row :gutter="80">
        <el-col :span="6"
          ><el-form-item label="在职情况" prop="jobState">
            <el-select
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="customerInfoForm.jobState"
            >
              <el-option
                v-for="(item, index) in employmentStatus"
                :key="index"
                :label="item"
                :value="item"
            /></el-select>
            <span v-else>{{ customerInfoForm.jobState }}</span></el-form-item
          ></el-col
        >
        <el-col :span="6"
          ><el-form-item label="当前薪资" prop="currentSal">
            <el-select
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="customerInfoForm.currentSal"
              ><el-option
                v-for="(item, index) in salaryRanges"
                :key="index"
                :label="item"
                :value="item" /></el-select
            ><span v-else>{{ customerInfoForm.currentSal }}</span>
          </el-form-item></el-col
        >
        <el-col :span="6"
          ><el-form-item label="QQ" prop="qqNum">
            <el-input
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="customerInfoForm.qqNum"
            ></el-input
            ><span v-else>{{ customerInfoForm.qqNum }}</span>
          </el-form-item></el-col
        >
        <el-col :span="6"
          ><el-form-item label="性别" prop="sex">
            <el-radio-group
              class="inputWidth"
              v-if="+route.params.flag === 1"
              v-model="customerInfoForm.sex"
            >
              <el-radio :label="1" size="large">男</el-radio>
              <el-radio :label="2" size="large">女</el-radio>
            </el-radio-group>
            <span v-else>{{ customerInfoForm.sex }}</span>
          </el-form-item></el-col
        >
      </el-row>
      <div style="display: flex"></div>
      <el-row :gutter="80">
        <el-col :span="6"
          ><el-form-item label="目标薪资" prop="targetSal">
            <el-select
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="customerInfoForm.targetSal"
              ><el-option
                v-for="(item, index) in salaryRanges"
                :key="index"
                :label="item"
                :value="item"
            /></el-select>
            <span v-else>{{ customerInfoForm.targetSal }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item label="备注" prop="remark">
            <el-input
              v-if="+route.params.flag === 1"
              type="textarea"
              :rows="1"
              v-model="customerInfoForm.remark"
            />
            <span v-else>{{ customerInfoForm.remark }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="never">
      <template #header> 客户意向 </template>
      <div style="display: flex; justify-content: space-between"></div>
      <el-row :gutter="80">
        <el-col :span="6"
          ><el-form-item label="意向学科" prop="subject">
            <el-select
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="customerInfoForm.subject"
            >
              <el-option
                v-for="item in subjectList"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictLabel"
              />
            </el-select>
            <span v-else>{{ customerInfoForm.subject }}</span>
          </el-form-item></el-col
        >
        <el-col :span="6"
          ><el-form-item label="学习原因" prop="studyCause">
            <el-select
              v-if="+route.params.flag === 1"
              placeholder="请输入"
              class="inputWidth"
              v-model="customerInfoForm.studyCause"
              ><el-option
                v-for="(item, index) in studyReasons"
                :key="index"
                :label="item"
                :value="item"
            /></el-select>
            <span v-else>{{ customerInfoForm.studyCause }}</span></el-form-item
          ></el-col
        >
        <el-col :span="6"
          ><el-form-item label="职业计划" prop="careerPlan">
            <el-select
              v-if="+route.params.flag === 1"
              placeholder="请输入"
              class="inputWidth"
              v-model="customerInfoForm.careerPlan"
              ><el-option
                v-for="(item, index) in careerPlans"
                :key="index"
                :label="item"
                :value="item" /></el-select
            ><span v-else>{{ customerInfoForm.careerPlan }}</span>
          </el-form-item></el-col
        >
        <el-col :span="6"
          ><el-form-item label="时间计划" prop="timePlan">
            <el-select
              v-if="+route.params.flag === 1"
              placeholder="请输入"
              class="inputWidth"
              v-model="customerInfoForm.timePlan"
              ><el-option
                v-for="(item, index) in studyTimePlans"
                :key="index"
                :label="item"
                :value="item"
              /> </el-select
            ><span v-else>{{ customerInfoForm.timePlan }}</span>
          </el-form-item></el-col
        >
      </el-row>
      <el-row :gutter="80">
        <el-col :span="6">
          <el-form-item label="意向课程" prop="course">
            <el-select
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="customerInfoForm.course"
            >
              <el-option
                v-for="(item, index) in itRelatedCourses"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
            <span v-else>{{ customerInfoForm.course }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="其他意向" prop="otherIntention">
            <el-input
              v-if="+route.params.flag === 1"
              placeholder="请输入"
              v-model="customerInfoForm.otherIntention"
            />
            <span v-else>{{ customerInfoForm.otherIntention }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="never">
      <template #header> 添加沟通记录 </template>
      <el-row :gutter="80">
        <el-col :span="6">
          <el-form-item label="跟进状态" prop="communicationState">
            <el-select
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="saveCustomerInfo.communication.communicationState"
            >
              <el-option value="接通" label="接通"></el-option>
              <el-option value="拒绝" label="拒绝"></el-option>
              <el-option value="无人接听" label="无人接听"></el-option>
            </el-select>
            <span v-else>123</span>
          </el-form-item></el-col
        >
        <el-col :span="6">
          <el-form-item label="下次跟进时间" prop="communicationTimeNext">
            <!-- <el-select v-if="+route.params.flag === 1" class="inputWidth"></el-select> -->
            <el-date-picker
              v-if="+route.params.flag === 1"
              class="inputWidth"
              v-model="saveCustomerInfo.communication.communicationTimeNext"
              type="datetime"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
            <span v-else>123</span></el-form-item
          ></el-col
        >
      </el-row>
      <el-row :gutter="80">
        <el-col :span="num">
          <el-form-item label="沟通重点" prop="emphasis">
            <el-select
              style="width: 100%"
              v-if="+route.params.flag === 1"
              v-model="saveCustomerInfo.communication.emphasis"
              multiple
              placeholder="请选择"
            >
              <el-option label="课程" value="课程" />
              <el-option label="价格" value="价格" />
              <el-option label="位置" value="位置" />
              <el-option label="时间" value="时间" />
              <el-option label="师资" value="师资" />
              <el-option label="项目" value="项目" />
              <el-option label="薪资" value="薪资" />
              <el-option label="职业" value="职业" />
              <el-option label="其他自定义" value="其他自定义" />
            </el-select>
            <span v-else>123</span>
          </el-form-item>
        </el-col>
        <el-col :span="num">
          <el-form-item label="沟通纪要" prop="communicationNotes">
            <el-input
              style="width: 100%"
              v-if="+route.params.flag === 1"
              placeholder="请填写补充内容..."
              maxlength="20"
              show-word-limit
              v-model="saveCustomerInfo.communication.communicationNotes"
            ></el-input>
            <span v-else>123</span>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="display: flex; justify-content: end" v-if="+route.params.flag === 1">
        <el-form-item>
          <el-button
            style="background: #fe7165; color: #fff; border: none; width: 94px; height: 40px"
            round
            @click="saveCustomerInfoConfirm"
            >保存</el-button
          >
          <el-button class="buttonStyle" type="info" round>退回公海</el-button>
          <el-button class="buttonStyle" type="info" round @click="dialogFormVisible = true"
            >转成交客户</el-button
          >
        </el-form-item>
      </div>
    </el-card>
  </el-form>
  <el-card shadow="never">
    <template #header> 历史沟通记录</template>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="headerRowStyle"
      :cell-style="cellStyle"
      stripe
    >
      <el-table-column prop="communicationTime" label="本次沟通时间"></el-table-column>
      <el-table-column prop="emphasis" label="沟通重点"></el-table-column>
      <el-table-column prop="communicationState" label="沟通状态"></el-table-column>
      <el-table-column prop="communicationNotes" label="沟通纪要"></el-table-column>
      <el-table-column prop="communicator" label="沟通人"></el-table-column>
      <template #empty>
        <el-empty image="https://rzzt-1317097641.cos.ap-chengdu.myqcloud.com/empty.png" />
      </template>
    </el-table>
  </el-card>
  <el-dialog v-model="dialogFormVisible" title="添加合同">
    <el-form label-position="top" label-width="80px">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="客户手机号">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同编号">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form>
      <el-form-item label="上传文件">
        <el-button type="primary" round style="width: 100px; height: 40px"
          ><el-icon> <UploadFilled /> </el-icon>上传</el-button
        >
      </el-form-item>
      <el-form-item>
        <span>已上传</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false" round="">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false" round>确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-card__header) {
  background: #f2f2f2 !important;
}

.inputWidth {
  width: 17vw;
}

.buttonStyle {
  color: #333333;
  background: #eaeaea;
  border: none;
  width: 132px;
  height: 40px;

  &:hover {
    color: #fff;
    background: #05cd95;
  }
}
</style>
