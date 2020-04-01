<template>
	<view class="content">
<!-- 		<van-skeleton title avatar row="12" />
		<van-button @click="handle" type="default">vant</van-button>
		<van-button @click="handle1" type="default">uni</van-button> -->
		<view class="iconfont-1">2222</view>
	</view>
</template>

<script>
	// import { mapState, mapMutations, mapActions } from 'vuex'
	// import { http } from '../../js_sdk/luch-request/index1.js'
	import httpServer from '../../request/httpServer.js'
    // import Dialog from '../../wxcomponents/vant/dialog/dialog'
    import dayjs from 'dayjs'
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			
            const env = process.env.NODE_ENV
            
            console.log(env,"我是环境变量",dayjs)
			
			this.test()
			
			// Dialog.alert({
			//   title: '标题',
			//   message,
			// });
			
			// uni.showLoading({
			// 	title:"加载中"
			// })
			
			
		},
		methods: {
			async test(){
				let http = new httpServer({
					checkCode: ['0', '0000'],
					// 使用统一的catch 如果不想使用可以 http.get().catch_http_error() 即可以自己catch
					onNetworkError(err){
					    console.log(err,"catch数据")
					    return
					},
					
					// 统一处理code码错误， 如果不想使用 dispose_server_error() 可以自己处理
					onServerError(error_data){
					    console.log(error_data,"code err数据")
					    return
					},
					defaultLoading:{
					    show(){
					        uni.showLoading({
					        	title:"加载中"
					        })
					    },
					    hide(){
					        uni.hideLoading()
					    }
					},
					
				})
				let result = await http.get('http://market-referral-test.zmlearn.com:8080/api/test/test').exec()
				console.log(result,"result")
			},
			// handle(){
			// 	Dialog.alert({
			// 	  title: '标题',
			// 	  message: "www",
			// 	});
			// },
			// handle1(){
			// 	uni.showModal({
			// 		title:'提示',
			// 		content:"asdasdasdasdasdasda"
			// 	})
			// }
			
		},
		computed:{
			// ...mapState(['Token'])
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
