import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// 引入Vant UI
import { 
  Button, Cell, CellGroup, Dialog, Field, Icon, NavBar, Popup, Toast, 
  Search, Tag, Empty, BackTop, DropdownMenu, DropdownItem, Switch, 
  Notify, Loading, Swipe, SwipeItem
} from 'vant'
import 'vant/lib/index.css'

// 引入UnoCSS
import 'uno.css'

// 引入动画初始化
import { initAnimations } from './utils/animation'

// 创建应用实例
const app = createApp(App)

// 注册Pinia状态管理
app.use(createPinia())

// 注册路由
app.use(router)

// 注册Vant组件
;[
  Button, Cell, CellGroup, Dialog, Field, Icon, NavBar, Popup, Toast,
  Search, Tag, Empty, BackTop, DropdownMenu, DropdownItem, Switch,
  Notify, Loading, Swipe, SwipeItem
].forEach(component => {
  app.use(component)
})

// 初始化动画
initAnimations()

// 挂载应用
app.mount('#app')
