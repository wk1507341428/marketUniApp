<template>
    <div class="app-container">
        <view class="comment-box">
            <div class="rate-box">
                <image :src="productPic" mode="aspectFill"></image>
                <uni-rate @change="hanleRateChange" :value="rateValue"></uni-rate>
                <span>{{ rateText }}</span>
            </div>
            <textarea placeholder="宝贝满足您的期待吗？说说他的优点和美中不足的地方吧" v-model="comment" class="comment"></textarea>
            <uImg
                ref="upimg"
                :canUploadFile="true"
                :limit="limitNum"
                :uploadFileUrl="uploadFileUrl"
                :heaer="header"
                :fileKeyName="name"
                :uImgList.sync="uImgList"
            ></uImg>
			<button @click="handleSubmit">确认</button> 
        </view>
    </div>
</template>

<script>
import uImg from '@/components/zhtx-uploadImg/zhtx-uploadImg.vue'
import uniRate from '@/components/uni-rate/uni-rate.vue'
export default {
	data(){
        console.log(this.$api.UploadFileUrl,"UploadFileUrl")
        const uploadFileUrl = `${this.$api.UploadFileUrl}`
		return{
            limitNum:3,
            uploadFileUrl, // 替换成你的后端接收文件地址
            header: {},
            uImgList: [],
            name: 'file', // 上传的名字
            comment: '',
            rateValue: '5',
			productCode: '',	// 商品id
			productPic: ''		// 商品图片
		}
    },
    onLoad({ productCode, productPic }){
        if(!productCode || !productPic){
			uni.showModal({
			    title: `错误提示`,
			    content: "非法进入",
			    showCancel: false
			})
			return
		}
		this.productCode = productCode
		this.productPic = productPic
		

    },
    methods: {
        async handleSubmit(){
            console.log(this.comment, this.uImgList)
            let [ pic1, pic2, pic3 ] = this.uImgList
            let { comment, rateValue, productId } = this.$data
			
			let result = await this.$api.AddComment({
				comment,
				pic1,
				pic2,
                pic3,
                isGood: rateValue >= 3 ? '1' :'0',
                productId,
                customerId: "c4505274863346173"
			})

        },
        hanleRateChange({ value }){
            this.rateValue = value
        }
    },
    computed:{
		rateText(){
            return [0,'非常差','差','一般','好','非常好'][this.rateValue]
        }
	},
    components: {
        uImg,
        uniRate
    }
}
</script>

<style lang="scss" scoped>
.app-container{
    .comment-box{
        .rate-box{
            margin: 20upx 0;
            display: flex;
            align-items: center;
            padding: 30upx;
            span{
                margin-left: 20upx;
                position: relative;
                top: -3upx;
            }
            image{
                width: 150upx;
				height: 150upx;
				margin-right: 20upx;
            }
        }
        .comment{
            width: 100%;
			border-top: 1upx solid #EEEEEE;
            box-sizing: border-box;
            padding: 20upx;
        }
    }
}
</style>