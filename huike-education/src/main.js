import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 样式初始化
import 'normalize.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//message消息提示
import 'element-plus/theme-chalk/src/message-box.scss'
import 'element-plus/theme-chalk/src/message.scss'

import PluginState from 'pinia-plugin-persistedstate'

const app = createApp(App)
const piniaApp = createPinia()
piniaApp.use(PluginState) //注册持久化插件
app.use(piniaApp) // 注册pinia
// app.use(createPinia())
import '@/permission.js'
app.use(router)
app.use(ElementPlus, {
  locale: zhCn
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
