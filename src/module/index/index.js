import Vue from 'vue'
import App from './App'
import { Button, Select } from 'element-ui';


Vue.use(Button)
Vue.use(Select)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  template: '<App/>',
  components: { App}
})
