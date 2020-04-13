<template>
	<view>
		<view class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="target" v-for="(target,index) in orderbyList" @tap="select(index)" :key="index" :class="[target.selected?'on':'']">
				{{target.text}}
				<view v-if="target.orderbyicon" class="icon" :class="target.orderbyicon[target.orderby]"></view>
			</view>
		</view> 
		<!-- 占位 -->
		<view class="place"></view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" v-for="(goods) in productsList" :key="goods.categoryCode" @tap="toGoods(goods)">
					<image mode="widthFix" src="/static/img/goods/p1.jpg"></image>
					<view class="name">{{goods.productName}}</view>
					<view class="info">
						<view class="price">¥{{goods.price}}</view>
						<view class="slogan">{{goods.stock}}库存</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{loadingText}}</view>
		</view>
	</view>
</template>

<script>
import * as API from '../../../request'
export default {
	data() {
		return {
			goodsList:[
				{ goods_id: 0, img: '/static/img/goods/p1.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 1, img: '/static/img/goods/p2.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 2, img: '/static/img/goods/p3.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 3, img: '/static/img/goods/p4.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 4, img: '/static/img/goods/p5.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 5, img: '/static/img/goods/p6.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 6, img: '/static/img/goods/p7.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 7, img: '/static/img/goods/p8.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 8, img: '/static/img/goods/p9.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 9, img: '/static/img/goods/p10.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' }
			],
			headerTop:"0px",
			headerPosition:"fixed",
			orderbyList:[
				{text:"销量",selected:true,orderbyicon:false,orderby:0},
				{text:"价格",selected:false,orderbyicon:['sheng','jiang'],orderby:0},
				{text:"好评",selected:false,orderbyicon:false,orderby:0}
			],
            orderby:"sheng",
            categoryCode: "",   // 类型code 要根据这个查询商品列表
            merchantId: "",     // 商家id 不然你知道查什么？
            productsList: [],   // 商品列表
            total: 0,           // 商品总数 因为要分页呀
            loadingText:"查看更多",
		};
	},
	onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
        const { categoryName, categoryCode, merchantId } = option
		uni.setNavigationBarTitle({
			title: categoryName
        })
        
        this.$nextTick(()=>{
            this.categoryCode = categoryCode
            this.merchantId = merchantId
            this.init()
        })
	},
	onPageScroll(e){
		//兼容iOS端下拉时顶部漂移
		if(e.scrollTop>=0){
			this.headerPosition = "fixed";
		}else{
			this.headerPosition = "absolute";
		}
	},
	//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
	onPullDownRefresh() {
        uni.showToast({title: '触发下拉加载'})
	},
	//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
	onReachBottom(){
		uni.showToast({title: '触发上拉加载'})
	},
	methods:{
		//商品跳转
		toGoods(item){
			uni.showToast({title: '商品'+item.productCode,icon:"none"});
			uni.navigateTo({
				url: `../goods?productCode=${item.productCode}`
			});
		},
		//排序类型
		select(index){
			let tmpTis = this.orderbyList[index].text+"排序 "
			if(this.orderbyList[index].orderbyicon){
				let type = this.orderbyList[index].orderby==0?'升序':'降序';
				if(this.orderbyList[index].selected){
					type = this.orderbyList[index].orderby==0?'降序':'升序';
					this.orderbyList[index].orderby = this.orderbyList[index].orderby==0?1:0;
				}
				tmpTis+=type
			}
			this.orderbyList[index].selected = true;
			let len = this.orderbyList.length;
			for(let i=0;i<len;i++){
				if(i!=index){
					this.orderbyList[i].selected = false;
				}
			}
			uni.showToast({title:tmpTis,icon:"none"});
        },
        init(){
            this.getDoodsListByCate()
        },
        // 获取商品列表
        async getDoodsListByCate(info={}){
            let { categoryCode, merchantId, productsList } = this.$data
            let params = {
                needTotalCount: true,
                offset: 0,
                pageNum: 1,
                pageSize: 20,
                merchantId,
                categoryCode
            }
            const response = await API.GetProductsByCate(Object.assign(params,info))
            const { data, total } = response

            for ( let i=0; i<10; i++ ){
                productsList = productsList.concat(data)
            }

            this.productsList = productsList
            this.total = total
        }
	}
	
}
</script>

<style lang="scss">
	.icon {
		font-size:26upx;
	}
	.header{
		width: 92%;
		padding: 0 4%;
		height: 79upx;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		border-bottom: solid 1upx #eee;
		.target{
			width: 20%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			margin-bottom: -2upx;
			color: #aaa;
			&.on{
				color: #555;
				border-bottom: 4upx solid #f06c7a;
				font-weight: 600;
				font-size: 30upx;
			}
			
			
		}
	}
.place{
		
		background-color: #ffffff;
		height: 100upx;

	}
.goods-list{
		.loading-text{
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}
		.product-list{
			width: 92%;
			padding: 0 4% 3vw 4%; 
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.product{
				width: 48%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 15upx 0;
				box-shadow: 0upx 5upx 25upx rgba(0,0,0,0.1);
				image{
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}
				.name{
					width: 92%;
					padding: 10upx 4% 0;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 30upx;
				}
				.info{
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 92%;
					padding: 10upx 4% 10upx 4%;
					
					.price{
						color: #e65339;
						font-size: 30upx;
						font-weight: 600;
					}
					.slogan{
						color: #807c87;
						font-size: 24upx;
					}
				}
			}
			
		}
	}
</style>
