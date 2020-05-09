import Vue from 'vue'
import App from './App'
import store from './store'
import './filters'
import util from './util/index.js'
import api from './request'
import constants from './constants'

Vue.prototype.$util = util	
Vue.prototype.$api = api	
Vue.prototype.$constants = constants

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    store,
    ...App
})
app.$mount()
