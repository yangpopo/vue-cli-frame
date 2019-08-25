import Vue from 'vue';
import App from './App';
import router from '../../components/router/taobaoFixedAssetsAuction.js'; // 路由配置地址

Vue.config.productionTip = false;


import axios from 'axios';
Vue.prototype.$axios = axios;

// 全部导入 ElementUI 控件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//局部引入 ElementUI 控件
//import { Button, Select, InputNumber, DatePicker} from 'element-ui';
//import 'element-ui/packages/theme-chalk/src/index.scss'; // 总样式入口
//import 'element-ui/lib/theme-chalk/index.css';
//import 'element-ui/packages/theme-chalk/src/button.scss';
//import 'element-ui/packages/theme-chalk/src/input-number.scss';
//import 'element-ui/packages/theme-chalk/src/input.scss';
//import 'element-ui/packages/theme-chalk/src/select.scss';


//Vue.use(Button);
//Vue.use(Select);
//Vue.use(InputNumber);
//Vue.use(DatePicker);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App></App>',
  components: {App}
})
