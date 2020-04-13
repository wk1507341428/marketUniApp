import constants from '@/constants'

/**
 * @description: 获取收藏列表
 * @param {type} 
 * @return: 
 */
export function GetCollectList(){
    let COLLECTLIST = uni.getStorageSync(constants.COLLECTLIST)
    if( !Array.isArray(COLLECTLIST) ){
        COLLECTLIST = []
    }
    return COLLECTLIST
}

/**
 * @description: 添加收藏列表
 * @param {type} 
 * @return: 
 */
export function addCollectList(goods){
	// {
	// 	"productCode": "003",
	// 	"productName": "洗衣机",
	// 	"stock": 1000,
	// 	"price": 200,
	// 	"categoryCode": "3",
	// 	"soldStock": null,
	// 	"pic": null,
	// 	"pics": null,
	// 	"detailDesc": "我是商品详情",
	// 	"productDesc": "<div style="text-align:center;"><img width="100%" src="https://ae01.alicdn.com/kf/HTB1t0fUl_Zmx1VjSZFGq6yx2XXa5.jpg"/><img width="100%" src="https://ae01.alicdn.com/kf/HTB1LzkjThTpK1RjSZFKq6y2wXXaT.jpg"/><img width="100%" src="https://ae01.alicdn.com/kf/HTB18dkiTbvpK1RjSZPiq6zmwXXa8.jpg"/></div>",
	// 	"id": 3,
	// 	"soldPrice": null,
	// 	"favFlag": false
	// }
    let COLLECTLIST = GetCollectList()
    if( !Array.isArray(COLLECTLIST) ){
        COLLECTLIST = []
    }
    
    const { productCode } = goods
    let tempList = COLLECTLIST.filter(item => item.productCode === productCode)

    return new Promise((resolve, reject) => {
        if(tempList.length > 0){
            reject(COLLECTLIST)
        }
        COLLECTLIST.push(goods)
        uni.setStorageSync(constants.COLLECTLIST, COLLECTLIST)
        resolve(COLLECTLIST)
    })

}

/**
 * @description: 移除收藏列表
 * @param {type} 
 * @return: 
 */
function removeCollectList(goods){
    let COLLECTLIST = GetCollectList()
    if( !Array.isArray(COLLECTLIST) ){
        return
    }

    const { productCode } = goods
    let tempList = COLLECTLIST.filter(item => item.productCode !== productCode)
    uni.setStorageSync(constants.COLLECTLIST, tempList)
    return
}

/**
 * @description: 这里做一个统一登录
 * @param {type} 
 * @return: 
 */
function wxLogin(){
    uni.getUserInfo({
        provider: "weixin",
        success: (result) => {
            console.log('getUserInfo success', result);
            this.hasUserInfo = true;
            this.userInfo = result.userInfo;
        },
        fail: (error) => {
            console.log('getUserInfo fail', error)
        }
    })
}


export default {
    addCollectList,
    GetCollectList,
    removeCollectList,
    // wxLogin
}