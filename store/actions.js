import * as ActionTypes from './mutation-types'
import constants from '@/constants/index.js'
import config from '@/config'
import API from '@/request'
export default {
    /**
     * @description: 商品购买列表
     * @param {type} 
     * @return: 
     */
    [ActionTypes.ADD_BUYLIST]({ commit }, payload ){
        commit(ActionTypes.ADD_BUYLIST, payload)
    },
    
    /**
     * @description: 订单页面 选择地址 记录一下
     * @param {type} 
     * @return: 
     */
    [ActionTypes.ADD_SELECT_ADDRESS]({ commit }, payload ){
        commit(ActionTypes.ADD_SELECT_ADDRESS, payload)
    },

    /**
     * @description: 失败的异步队列
     * @param {type} 
     * @return: 
     */
    [ActionTypes.ADD_PROMISEQUEUE]({ commit }, payload ){
        commit(ActionTypes.ADD_PROMISEQUEUE, payload)
    },

    /**
     * @description: 用户登录的方法
     * @param {type} 
     * @return: 
     */    
    [ActionTypes.USER_LOGIN]({ dispatch }, callBack){
        // 如果已经登录过里 就没必要登录了
        if(uni.getStorageSync(constants.USERINFOBYWEIXIN)){
            typeof callBack === 'function' && callBack()
            return
        }
        uni.login({
            success({ code }){
                uni.getUserInfo({
                    provider: "weixin",
                    success: async (result) => {
                        console.log('getUserInfo success', result)
                        const { avatarUrl, nickName, gender } = result.userInfo
                        const response = await API.login({
                            code: code,
                            merchantId: config.merchantId,
                            avatarUrl,
                            nickName,
                            gender
                        })
                        // 记录本地存储
                        uni.setStorageSync(constants.USERINFOBYWEIXIN,result.userInfo)
                        uni.setStorageSync(constants.TOKEN,response.data.token)
                        uni.setStorageSync(constants.CUSTOMERID,response.data.customerId)

                        dispatch(ActionTypes.ADD_USERINFO, Object.assign({}, {
                            username: nickName,
                            face: avatarUrl
                        }))

                        typeof callBack === 'function' && callBack()
                    },
                    fail: (error) => {
                        console.log('getUserInfo fail', error)
                    }
                })
            }
        })
    },
    /**
     * @description: 添加用户微信信息
     * @param {type} 
     * @return: 
     */
    [ActionTypes.ADD_USERINFO]({ commit }, payload){
        commit(ActionTypes.ADD_USERINFO, payload)
    },
    /**
     * @description: 用户支付的公共方法
     * @param { orderId:String, callBack:Function } 
     * @return: 
     */    
    async [ActionTypes.USER_PAY]({ commit }, { orderId , callBack}){
        let { data } =  await API.pay(orderId)
        data = JSON.parse(data)
        uni.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr:data.nonceStr,
            package: data.package,
            paySign:data.sign,
            signType:data.signType,
            complete(data){
                console.log(data,"<<<<回调", callBack)
                typeof callBack === 'function' && callBack(data)
            }
        })
    },

    /**
     * @description: 用户添加商品到购物车
     * @param {type} 
     * @return: 
     */    
    async [ActionTypes.ADDCARTLIST]({ commit }, payload){
        
    }
}