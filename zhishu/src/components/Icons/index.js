import {
  CarOutlined,
  HomeOutlined,
  PayCircleOutlined,
  HddOutlined,
  AlignCenterOutlined,
  UnorderedListOutlined,
  LockOutlined,
  MenuFoldOutlined,
  RightOutlined,
  TeamOutlined,
  MoreOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons-vue'
// 以上图标都需要全局注册
const icons = [
  CarOutlined,
  HomeOutlined,
  PayCircleOutlined,
  HddOutlined,
  AlignCenterOutlined,
  UnorderedListOutlined,
  LockOutlined,
  MenuFoldOutlined,
  RightOutlined,
  TeamOutlined,
  MoreOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined
]
export default {
  install: (app) => icons.forEach((item) => app.component(item.displayName, item))
  // 全局注册引入的所有图标
}
