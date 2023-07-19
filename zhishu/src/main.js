import { createApp } from 'vue'
import { createPinia } from 'pinia'

import AntD from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import App from './App.vue'
import router from './router'
import PluginState from 'pinia-plugin-persistedstate'
import Icons from '@/components/Icons'
import '@/permission'
import '@/styles/index.less'
const app = createApp(App)
const piniaApp = createPinia()
piniaApp.use(PluginState) //注册持久化插件
app.use(Icons)
app.use(piniaApp) // 注册pinia
app.use(router)
app.use(AntD) // 全局注册antD
app.mount('#app')
