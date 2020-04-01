import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		Token: "我是vuex中的token"
	},
	mutations:{},
	actions:{},
})

Vue.prototype.$store = store	

export default store

