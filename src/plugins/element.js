import Vue from 'vue'
import {
    Button, Popover,
    Dialog, Drawer,
    Tree, Radio,
    RadioGroup, Checkbox,
    CheckboxGroup, Breadcrumb,
    BreadcrumbItem, Message,
    Tabs,
    TabPane,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Button)
Vue.use(Popover)
Vue.use(Dialog)
Vue.use(Drawer)
Vue.use(Tree)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Tabs)
Vue.use(TabPane)

Vue.prototype.$message = {
    error(msg) {
        Message.closeAll();
        Message.error(msg)
    },
    success(msg) {
        Message.closeAll();
        Message.success(msg)
    }
}