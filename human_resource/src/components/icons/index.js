import {
    HomeOutlined,
    PartitionOutlined,
    SettingOutlined,
    TeamOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PoweroffOutlined,
    LockOutlined
  } from '@ant-design/icons-vue'
  
  // 以上图标都需要全局注册
  const icons = [
    HomeOutlined,
    PartitionOutlined,
    SettingOutlined,
    TeamOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PoweroffOutlined,
    LockOutlined
  ]
  export default {
    install: (app) => icons.forEach((item) => app.component(item.displayName, item))
    // 全局注册引入的所有图标
  }
  