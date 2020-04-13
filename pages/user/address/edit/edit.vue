<template>
	<view>
		<view class="content">
			<view class="row">
				<view class="nominal">
					收件人
				</view>
				<view class="input">
					<input placeholder="请输入收件人姓名" type="text" v-model="name" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					电话号码
				</view>
				<view class="input">
					<input placeholder="请输入收件人电话号码" type="text" v-model="tel" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					所在地区
				</view>
				<view class="input" @tap="chooseCity">
					{{region.label}}
				</view>
				
			</view>
			<view class="row">
				<view class="nominal">
					详细地址
				</view>
				<view class="input">
					<textarea v-model="detailed" auto-height="true" placeholder="输入详细地址"></textarea>
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					设置默认地址
				</view>
				<view class="input switch">
					<switch color="#f06c7a" :checked="isDefault" @change=isDefaultChange />
				</view>
			</view>
			<view class="row" v-if="editType=='edit'" @tap="del">
				<view class="del">
					删除收货地址
				</view>
			</view>
		</view>
		<view class="save" @tap="save">
			<view class="btn">
				保存地址
			</view>
		</view>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValue" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
import * as API from '../../../../request/index'
export default {
	components: {
		mpvueCityPicker
	},
	data() {
		return {
			editType:'edit',
			id:'',
			name:'',
			tel:'',
			detailed:'',
			isDefault:false,
			cityPickerValue: [0, 0, 1],
			themeColor: '#007AFF',
			region:{label:"请点击选择地址",value:[],cityCode:""}
		};
	},
	methods: {
		onCancel(e) {
			console.log(e)
		},
		chooseCity() {
			this.$refs.mpvueCityPicker.show()
		},
		onConfirm(e) {
			this.region = e
			this.cityPickerValue = e.value;
		},
		isDefaultChange(e){
			this.isDefault = e.detail.value;
		},
		del(){
			uni.showModal({
				title: '删除提示',
				content: '你将删除这个收货地址',
				success: async (res)=>{
					if (res.confirm) {
                        const { id } = this.$data
                        let response = await API.delAddress(id)
                        uni.showToast({title:'删除成功'})
                        setTimeout(()=>{
                            uni.navigateBack()
                        },500)
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})
        },
		async save(){
            let { name, tel, isDefault, region, detailed, editType, id } = this.$data

            if( !name ){
                uni.showToast({title:'请输入收件人姓名',icon:'none'});
				return
            }
			if(!tel){
				uni.showToast({title:'请输入收件人电话号码',icon:'none'});
				return
			}
			if(!detailed){
				uni.showToast({title:'请输入收件人详细地址',icon:'none'});
				return
			}
			if(region.value.length==0){
				uni.showToast({title:'请选择收件地址',icon:'none'});
				return
            }
            
            const { cityCode, label } = region

            // addressDetail (string): 详细地址 ,
            // customerId (string): 客户编号 ,
            // id (integer, optional): 主键 ,
            // isDefault (integer, optional): 是否默认 ,
            // provinceId (string): 省份ID ,
            // provinceName (string): 省份名称 ,
            // receviePhone (string): 收件人手机 ,
            // recevierName (string): 收件人姓名

            let response = {}

            // 新增地址
            if( editType === "add" ){
                response = await API.addAddress({
                    addressDetail: detailed,
                    isDefault: Number(isDefault),
                    provinceId: cityCode,
                    provinceName: label,
                    receviePhone: tel,
                    recevierName: name,
                    // TODO
                    customerId: "c123123123"
                })

                uni.showToast({title:'添加成功'})
                setTimeout(()=>{
                    uni.navigateBack()
                },1000)
            }
            // 编辑地址
            else if( editType === 'edit' ){
                response = await API.editAddress({
                    addressDetail: detailed,
                    isDefault: Number(isDefault),
                    provinceId: cityCode,
                    provinceName: label,
                    receviePhone: tel,
                    recevierName: name,
                    customerId: "c123123123",
                    id
                })
                uni.showToast({title:'编辑成功'})
                setTimeout(()=>{
                    uni.navigateBack()
                },1000)
            }
		}
	},
	onLoad(e) {
		this.editType = e.type;
		if(e.type == 'edit'){
			uni.getStorage({
				key:'address',
				success: (e) => {
                    const { addressDetail, customerId, id, isDefault, provinceId, provinceName, receviePhone, recevierName } = e.data
					this.id = id
					this.name = recevierName
					this.tel = receviePhone
					this.detailed = addressDetail
					this.isDefault = isDefault
                    this.cityPickerValue = [18,2,1]
                    // TODO  地址这一刻还需要一个字段来控制picker
					this.region = {
                        label: provinceName,
                        value: [18,2,1],
                        cityCode: provinceId
                    }
				}
			})
		}
		
	},
	onBackPress() {
		if (this.$refs.mpvueCityPicker.showPicker) {
			this.$refs.mpvueCityPicker.pickerCancel();
			return true;
		}
	},
	onUnload() {
		if (this.$refs.mpvueCityPicker.showPicker) {
			this.$refs.mpvueCityPicker.pickerCancel()
		}
	}
};
</script>
<style lang="scss">

.save{
		view{
			display: flex;
		}
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.btn{
			box-shadow: 0upx 5upx 10upx rgba(0,0,0,0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background-color: #f06c7a;
			color: #fff;
			justify-content: center;
			align-items: center;
			.icon{
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}
			font-size: 30upx;
		}
	}
	.content{
		display: flex;
		flex-wrap: wrap;
		view{
			display: flex;
		}
		.row{
			width: 94%;
			
			margin: 0 3%;
			border-top: solid 1upx #eee;
			.nominal{
				width: 30%;
				height: 120upx;
				font-weight: 200;
				font-size: 30upx;
				align-items: center;
			}
			.input{
				width: 70%;
				padding: 20upx 0;
				align-items: center;
				font-size: 30upx;
				&.switch{
					justify-content: flex-end;
				}
				.textarea{
					margin: 20upx 0;
					min-height: 120upx;
				}
			}
			.del{
				width: 100%;
				height: 100upx;
				justify-content: center;
				align-items: center;
				font-size: 36upx;
				color: #f06c7a;
				background-color: rgba(255,0,0,0.05);
				border-bottom: solid 1upx #eee;
			}
		}
	}
	
</style>
