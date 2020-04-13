import * as ActionTypes from './mutation-types'
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
}