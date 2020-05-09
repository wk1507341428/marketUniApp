import * as ActionTypes from './mutation-types'
export default {
    /**
     * @description: 商品购买列表
     * @param {type} 
     * @return: 
     */
    [ActionTypes.ADD_BUYLIST]( state, val ){
        state.BUYLIST = val
    },

    /**
     * @description: 订单页面 选择地址 记录一下
     * @param {type} 
     * @return: 
     */    
    [ActionTypes.ADD_SELECT_ADDRESS]( state, val ){
        state.SELECT_ADDRESS = val
    },
    /**
     * @description: 增加失败的异步队列
     * @param {type} 
     * @return: 
     */
    [ActionTypes.ADD_PROMISEQUEUE]( state, val ){
        state.PROMISEQUEUE.push(val)
    },

    /**
     * @description: 同步用户信息
     * @param {type} 
     * @return: 
     */    
    [ActionTypes.ADD_USERINFO]( state, val ){
        state.USER = val
    }
}