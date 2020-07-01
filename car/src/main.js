import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//全局注册filter
import filters from './assets/js/filter'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

//引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//element-ui媒体查询css
import 'element-ui/lib/theme-chalk/display.css';

//引入icon
import './assets/css/style.css' ;

//增加了新的事件捕获机制－Passive Event Listeners
import 'default-passive-events'

//引入重置样式表
import './assets/css/reset.css' ;

//引入vue-cookies方便操作cookies
import VueCookies from 'vue-cookies'
Vue.use(VueCookies) ;

//引入axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios) ;

//引入font-awesome
import "font-awesome/css/font-awesome.min.css";


//静态文件目录
Vue.prototype.staticUrl = 'http://127.0.0.1:8022'

//设置基础请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8022'

//设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 携带cookie
axios.defaults.withCredentials = true

//添加axios请求拦截器, 该方法在请求之前触发
axios.interceptors.request.use(params => {


  //对于post请求,需要将参数进行序列化
  if (params.method == 'post') {
    let str ='';
    for (let key in params.data) {
      str += key + '=' + params.data[key] + '&'
    }

    str = str.slice(0, -1);

    params.data = str;
  }

  return params;

})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
