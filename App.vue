<script>
import constants from '@/constants/index.js'
export default {
	onLaunch: function () {
        const userInfo = uni.getStorageSync(constants.USERINFOBYWEIXIN)
        if(userInfo){
            this.$store.dispatch("ADD_USERINFO", {
                username: userInfo.nickName,
                face: userInfo.avatarUrl
            })
        }
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "/static/iconfont/font.scss";
</style>
