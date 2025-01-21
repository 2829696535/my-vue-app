import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import "@/assets/less/index.less"
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPLus from 'element-plus'
import 'element-plus/dist/index.css'
import {createPinia} from "pinia"
import axios from 'axios'
import * as eacharts from 'echarts'
axios.defaults.baseURL = '/api';
const pinia = createPinia()
 const app =createApp(App)
  app.use(ElementPLus)
  app.use(pinia)
  app.use(eacharts)
  app.config.globalProperties.$axios = axios;
 app.use(router).mount('#app')
 for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  
