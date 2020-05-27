<template>
	<view>
		<!-- 收货地址 -->
		<view class="addr" @tap="selectAddress">
			<view class="icon">
				<image src="../../static/img/addricon.png" mode=""></image>
			</view>
			<view class="right">
				<view class="tel-name">
					<view class="name">
						{{recinfo.recevierName}}
					</view>
					<view class="tel">
						{{recinfo.receviePhone}}
					</view>
				</view>
				<view class="addres">
					{{recinfo.provinceName}}
					{{recinfo.addressDetail}}
				</view>
			</view>
		</view>
		<!-- 购买商品列表 -->
		<view class="buy-list">
			<view class="row" v-for="(row,index) in buylistCur" :key="index">
				<view class="goods-info">
					<view class="img">
						<image :src="row.pic"></image>
					</view>
					<view class="info">
						<view class="title">{{row.productName}}</view>
                        <view class="spec-box">
                            <view v-for="spec in row.specDTOS" :key="spec.id" class="spec">{{`${spec.specName}:${spec.selectSpec[0].propertyName}`}}</view>
                            <view class="spec">数量：{{ row.number }}</view>
                        </view>
						<view class="price-number">
							<view class="price">￥{{row.price * row.number}}</view>
							<view class="number">
								
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 提示-备注 -->
		<view class="order">
			<view class="row">
				<view class="left">
					积分 :
				</view>
				<view class="right">
					已扣除{{int}}积分抵扣{{deduction|toFixed}}元
				</view>
			</view>
			<view class="row">
				<view class="left">
					备注 :
				</view>
				<view class="right">
					<input placeholder="选填,备注内容" v-model="remark" />
				</view>
			</view>
		</view>
		<!-- 明细 -->
		<view class="detail">
			<view class="row">
				<view class="nominal">
					商品金额
				</view>
				<view class="content">
					￥{{goodsPrice|toFixed}}
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					运费
				</view>
				<view class="content">
					￥+{{freight|toFixed}}
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					选择快递
				</view>
				<view class="content">
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange" :value="expressIndex" range-key="deliveryName" :range="expressList">
							<view class="uni-input">{{expressList[expressIndex].deliveryName}}</view>
						</picker>
					</view>
				</view>
			</view>
			<!-- <view class="row">
				<view class="nominal">
					积分抵扣
				</view>
				<view class="content">
					￥-{{deduction|toFixed}}
				</view>
			</view> -->
		</view>
		<view class="blck">
			
		</view>
		<view class="footer">
			<view class="settlement">
				<view class="sum">合计:<view class="money">￥{{sumPrice|toFixed}}</view></view>
				<view class="btn" @tap="toPay">提交订单</view>
			</view>
		</view>
	</view>
</template>

<script>
import * as API from '../../request'
import { mapState } from 'vuex'
import config from '../../config'
export default {
	data() {
		return {
			goodsPrice: 0,	//商品合计价格
			freight:0,	//运费
			remark:'',		//备注
			int:1200,		//抵扣积分
			deduction:0,	//抵扣价格
            
            ids: [],     // 商品Id  
            goodsDetail: {},    // 订单商品信息
            buylistCur: [],		//订单列表 处理后的数据
            recinfo: {},     // 默认地址 or 选择后的地址
			
			
			expressList: [],
			expressIndex: 0,
		};
    },
    computed:{
        ...mapState(["BUYLIST","SELECT_ADDRESS"]),
        // 用户付款价格
        sumPrice(){
            return this.goodsPrice + this.freight
        }
    },
	onShow() {
        const SELECT_ADDRESS = this.SELECT_ADDRESS
        // 更新选择的地址
        if( JSON.stringify(SELECT_ADDRESS) != "{}" ){
            this.recinfo = SELECT_ADDRESS
        }
    },
    onLoad(){
        const BUYLIST = this.BUYLIST

        if( BUYLIST && BUYLIST.length == 0 ){
            uni.showModal({
                title: `错误提示`,
                content: "非法进入",
                showCancel: false
            })
            return
        }

        this.$nextTick(()=>{
            this.init()
        })
    },
	filters: {
		toFixed:function(x) {
			return parseFloat(x).toFixed(2)
		}
	},
	methods: {
        init(){
            this.GetProductDetail()
            this.getAddressDefault()
			this.GetExpressList()
        },
		// 获取物流信息列表
		async GetExpressList(){
			let { data } = await this.$api.GetExpressList()
			this.expressList = data
			console.log(this.expressList,"this.expressList")
		},
        bindPickerChange: function(e) {
            console.log('picker发送选择改变，携带值为', e.target)
            this.expressIndex = e.target.value
        },
        // 查询商品详情并且组织数据
        GetProductDetail(){
            const BUYLIST = this.BUYLIST
            console.log(BUYLIST,"BUYLIST")
            Array.isArray(BUYLIST) && BUYLIST.map(async item => {
                const { id, number, specDTOS } = item
                let response = await API.GetProductDetail(id)
                let { data } = response
                data.number = number
                // 计算总金额
                this.goodsPrice += data.price * data.number

                // 这里覆盖下原来的的规格属性
                data.specDTOS = specDTOS
                // 处理后的数据
                this.buylistCur.push(data)
            })
        },
        // 获取默认地址
        async getAddressDefault(){
            let response = await API.getAddressList()
            const { data } = response
            // 这里因为你不知道哪个是默认地址，所以没办法，遍历一下吧
            let defaultAddress = Array.isArray(data) && data.filter(item => item.isDefault)[0]
            this.recinfo = defaultAddress
        },
        // 整合参数为提交
        getParams(){

            // {
            //     "addressId": 0,      // 收货地址
            //     "customerId": "string",  // 用户编码
            //     "deliveryFee": 0,    // 运费
            //     "items": [
            //         {
            //         "itemId": "string",      // 子单编号
            //         "productCode": "string",     // 
            //         "productName": "string",
            //         "productNum": 0,
            //         "productPrice": 0,
            //         "properties": [
            //             {
            //             "propName": "string",    // 规格名称：尺寸
            //             "propValue": "string"    // 规格描述：xl,xxl
            //             }
            //         ]
            //         }
            //     ],
            //     "merchantId": "string",  // 商家编码
            //     "orderAmount": 0,        // 订单金额 ,
            //     "orderId": "string",     // 订单id
            //     "orderStatus": "string", // 订单状态
            //     "remark": "string"
            // }
            const { freight, remark, buylistCur, recinfo, expressList, expressIndex } = this.$data
            const sumPrice = this.sumPrice
            const { customerId, merchantId } = config

            let items = []

            console.log(buylistCur,"<<<<")


            buylistCur.map(good => {
                let specDTOS = JSON.parse(JSON.stringify(good.specDTOS))
                specDTOS.map(item=>{
                    item.properties = item.selectSpec
                })
                items.push({
                    productCode: good.productCode,
                    productName: good.productName,
                    productNum: good.number,
                    productPrice: good.price,
                    properties: specDTOS
                })
            })

            return { 
                freight, 
                remark, 
                customerId: uni.getStorageSync(this.$constants.CUSTOMERID), 
                merchantId, 
                addressId: recinfo.id,
                items, 
                orderAmount:sumPrice,
				deliveryDTO:{
					id: expressList[expressIndex].id
				}
            }
        },
		async toPay(){

            const paymentOrder = this.getParams()
            const response = await API.creatOrder(paymentOrder)

            // uni.redirectTo({
            //     url:"../pay/payment/payment?amount="+this.sumPrice
            // })

            this.$store.dispatch('USER_LOGIN', ()=>{
                uni.setStorageSync('tbIndex',0);
                uni.navigateTo({url:'../user/order_list/order_list?tbIndex=0'}) 
            })
			
		},
		//选择收货地址
		selectAddress(){
			uni.navigateTo({
				url:'../user/address/address?type=select'
			})
		}
	}
}
</script>

<style lang="scss">
.addr{
	width: 86%;
	padding: 20upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
	border-radius: 20upx;
	display: flex;
	.icon{
		width: 80upx;
		height: 80upx;
		display: flex;
		align-items: center;
		image{
			width: 60upx;
			height: 60upx;
		}
	}
	.tel-name{
		width: 100%;
		display: flex;
		font-size: 32upx;
		.tel{
			margin-left: 40upx;
		}
	}
	.addres{
		width: 100%;
		font-size: 26upx;
		color: #999;
	}
}
.buy-list{
	width: 86%;
	padding: 10upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
	border-radius: 20upx;
	.row{
		margin: 30upx 0;
		.goods-info{
			width: 100%;
			display: flex;
			.img{
				width: 22vw;
				height: 22vw;
				border-radius: 10upx;
				overflow: hidden;
				flex-shrink: 0;
				margin-right: 10upx;
				image{
					width: 22vw;
					height: 22vw;
				}
			}
			.info{
				width: 100%;
				height: 22vw;
				overflow: hidden;
				// display: flex;
				// flex-wrap: wrap;
				position: relative;
				.title{
					width: 100%;
					font-size: 28upx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					// text-align: justify;
					overflow: hidden;
				}
                .spec-box{
                    display: flex;
                    margin-top: 10upx;
                    .spec{
                        font-size: 22upx;
                        background-color: #f3f3f3;
                        color: #a7a7a7;
                        line-height: 40upx;
                        padding: 0 10upx;
                        margin-right: 10upx;
                        // border-radius: 20upx;
                        // margin-bottom: 20vw;
                    }
                }
				.price-number{
					position: absolute;
					width: 100%;
					bottom: 0upx;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					font-size: 28upx;
					height: 40upx;
					.price{
						color: #f06c7a;
					}
					.number{
						display: flex;
						justify-content: center;
						align-items: center;
						
					}
				}
			}
		}
	}
}
.order{
	width: 86%;
	padding: 10upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
	border-radius: 20upx;
	.row{
		margin: 20upx 0;
		height: 40upx;
		display: flex;
		.left{
			font-size: 28upx;
		}
		.right{
			margin-left: 40upx;
			font-size: 26upx;
			color: #999;
			input{
				font-size: 26upx;
				color: #999;
			}
		}
	}
}
.blck{
	width: 100%;
	height: 100upx;
}
.footer{
		width: 92%;
		padding: 0 4%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;
		
		.settlement{
			width: 80%;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.sum{
				width: 50%;
				font-size: 28upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;
				.money{
					font-weight: 600;
				}
			}
			.btn{
				padding: 0 30upx;
				height: 60upx;
				background-color: #f06c7a;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30upx;
				border-radius: 40upx;
			}
		}
	}
.detail{
	width: 86%;
	padding: 10upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
	border-radius: 20upx;
	.row{
		height: 60upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.nominal{
			font-size: 28upx;
		}
		.content{
			font-size: 26upx;
			color: #f06c7a;
		}
	}
}
.uni-list-cell-db{
	border: 1px solid #d5d5d5;
	padding: 0 20upx;
	border-radius: 10upx;
	color: #838383;
	display: flex;
	justify-content: space-between;
	align-items: center;
	&::after{
		content: ">";
		margin-left: 20upx;
		transform: rotate(90deg);
	}
}

</style>
