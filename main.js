import Vue from 'vue'
import App from './App'
import store from './store'
import './filters'
import util from './util/index.js'

Vue.prototype.$util = util	

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    store,
    ...App
})
app.$mount()
