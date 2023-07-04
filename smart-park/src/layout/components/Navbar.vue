<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-button style="margin-right: 10px;" type="primary" plain size="small">可视化大屏</el-button>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" /> -->
          <span style="font-weight: bold;">黑马程序员</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">

          <a target="_blank" @click.prevent="logout">
            <el-dropdown-item>退出登录</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="pwdShow=true">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="pwdShow" width="40%" @close="$refs.passFormRef.resetFields();open1= open2 = open3= false">
      <el-form ref="passFormRef" :model="pwdForm" :rules="pwdFormRules">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword" :type="open1? 'text':'password'" size="small" placeholder="请输入">
            <template #suffix>
              <svg-icon :icon-class="open1?'eye-open':'eye'" style="cursor: pointer;user-select: none;" @click="open1=!open1" />
            </template></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdForm.newPassword" :type="open2? 'text':'password'" size="small" placeholder="请输入">
            <template #suffix>
              <svg-icon :icon-class="open2?'eye-open':'eye'" style="cursor: pointer;user-select: none;" @click="open2=!open2" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="pwdForm.confirmPwd" :type="open3? 'text':'password'" size="small" placeholder="请输入">
            <template #suffix>
              <svg-icon :icon-class="open3?'eye-open':'eye'" style="cursor: pointer;user-select: none;" @click="open3=!open3" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button size="small" @click="pwdShow = open1= open2 = open3= false;$refs.passFormRef.resetFields()">取消</el-button>
          <el-button size="small" type="primary" @click="modifyPass">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      pwdShow: false,
      open1: false,
      open2: false,
      open3: false,
      pwdForm: {
        oldPassword: '',
        newPassword: '',
        confirmPwd: ''
      },
      pwdFormRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value !== this.pwdForm.newPassword) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  async created() {
    // const res = await getUserList()
    // console.log(res)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async modifyPass() {
      try {
        await this.$refs.passFormRef.validate()
        const obj = {
          oldPassword: this.pwdForm.oldPassword,
          newPassword: this.pwdForm.newPassword
        }
        await updatePassword(obj)
        // this.$message.success('密码修改成功，请重新登录')
        // this.$store.dispatch('user/logout')
        // this.$router.push('/login')
        this.pwdShow = this.open1 = this.open2 = this.open3 = false
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #f4f6f8;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
