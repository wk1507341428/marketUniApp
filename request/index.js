import httpServer from './httpServer'
import config from '../config'

const http = new httpServer({
    baseUrl: `${config.host}`,
    // 使用统一的catch 如果不想使用可以 http.get().catch_http_error() 即可以自己catch
    onNetworkError(err){
        console.log(err,"catch数据")
        const { message, status } = err
        uni.showModal({
            title: `错误提示-${status}`,
            content: message || "系统繁忙,请稍后再试",
            showCancel: false
        })
        return
    },
    
    // 统一处理code码错误， 如果不想使用 dispose_server_error() 可以自己处理
    onServerError(error_data){
        console.log(error_data,"code err数据")
        const { errMessage, errCode } = error_data
        uni.showModal({
            title: `错误提示-${errCode}`,
            content: errMessage || "系统繁忙,请稍后再试",
            showCancel: false
        })
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

// 获取收货地址
export function getAddressList(){
    // TODO
    return http.get(`/mall/address/v1/addresses/c123123123`).withLoading().exec()
}

/**
 * @description: 新增收货地址
 * @param {type} 
 * @return: 
 */
export function addAddress(data){
    return http.post(`/mall/address/v1`,data).withLoading().exec()
}

/**
 * @description: 编辑收货地址
 * @param {type} 
 * @return: 
 */
export function editAddress(data){
    return http.post(`/mall/address/v1/address`,data).withLoading().exec()
}

/**
 * @description: 删除收货地址
 * @param {type} 
 * @return: 
 */
export function delAddress(data){
    return http.post(`/mall/address/v1/address/del`,data).withLoading().exec()
}

/**
 * @description: 查询商家的类目列表
 * @param {type} 
 * @return: 
 */
// TODO
export function GetCateList(data="c123123123"){
    return http.get(`/mall/product/v1/categories/${data}`).withLoading().exec()
}

/**
 * @description: 根据类别分页查询商品列表
 * @param {type} 
 * @return: 
 */
export function GetProductsByCate(data){
    return http.post(`/mall/product/v1/products/category`,data).withLoading().exec()
}

/**
 * @description: 根据产品编码查询产品详细
 * @param {type} 
 * @return: 
 */
export function GetProductDetail(params){
    return http.get(`/mall/product/v1/product/${params}`).withLoading().exec()
}

/**
 * @description: 新增个人收藏
 * @param {type} 
 * @return: 
 */
export function addFavoriate(data){
    return http.post(`/mall/customer/v1/favoriate`,data).withLoading().exec()
}

/**
 * @description: 查询我的收藏
 * @param {type} 
 * @return: 
 */
export function getFavoriateList(data){
    return http.get(`/mall/customer/v1/favoriate/${data}`).withLoading().exec()
}

/**
 * @description: 移除我的收藏
 * @param {type} 
 * @return: 
 */
export function removeFavoriate(data){
    return http.post(`/mall/customer/v1/favoriates/favoriate`,data).withLoading().exec()
}

/**
 * @description: 创建订单 提交订单？
 * @param {type} 
 * @return: 
 */
export function creatOrder(data){
   return http.post(`/mall/order/v1/`,data).withLoading().exec()
}

/**
 * @description: 登录接口
 * @param {type} 
 * @return: 
 */
export function login(data){
    return http.post(`/mall/wx/v1/token`,data).withLoading().exec()
}

/**
 * @description: 查询个人订单
 * @param {type} 
 * @return: 
 */
export function GetOrderList(data){
    return http.post(`/mall/order/v1/orders`,data).withLoading().exec()
}

/**
 * @description: 查询banner，根据商家ID
 * @param {type} 
 * @return: 
 */
export function GetBannerList(data){
    return http.get(`/mall/banners/v1/${data}`).withLoading().exec()
}
