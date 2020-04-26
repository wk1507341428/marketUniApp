import config from '@/config'
import constants from '@/constants'
import * as API from '@/request'
import store from '@/store'
const GET = 'GET'
const POST = 'POST'

class Call {
    constructor(client, method, path) {

        // 是否使用内置Loading
        this.useLoading = false
        // 请求路径
        this.path = path
        // 请求方法
        this.method = method

        // 请求参数
        this.params = client.params
        this.body = client.body

        // 公共模块
        this.headers = JSON.parse(JSON.stringify(client.headers))
        this.baseUrl = client.baseUrl
        this.checkCode = client.checkCode
        this.defaultLoading = client.defaultLoading

        //  true 自己catch错误   false 使用统一catch
        this.catch_error = false
        this.onNetworkError = client.onNetworkError

        // true 统一处理code码错误   false 使用统一处理
        this.server_error = false
        this.onServerError = client.onServerError
    }

    // 是否使用内置Loading
    withLoading () {
        let defaultLoading = this.defaultLoading
        if (Object.prototype.toString.call(defaultLoading) === '[object Object]') {
            if (typeof defaultLoading.show == 'function' && typeof defaultLoading.hide == 'function') {
                this.useLoading = true
            }
        }
        return this
    }

    // 使用自己的loading
    custom_loading(customLoading){
        if(Object.prototype.toString.call(customLoading) === '[object Object]'){
            if(typeof customLoading.show == 'function' && typeof customLoading.hide == 'function'){
                this.defaultLoading = customLoading
                this.useLoading = true
            }
        }
        return this
    }

    // 使用自己的catch / 不走统一catch
    catch_http_error () {
        this.catch_error = true
        return this
    }

    // 自己处理code码错误 / 不走统一处理
    dispose_server_error () {
        this.server_error = true
        return this
    }

    // 设置请求头
    setHeaders (headers = {}) {
        this.headers = Object.assign(this.headers, headers)
        return this
    }

    // 判断url是否为绝对路径
    posUrl (url) {
        return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
    }

    //  catch 
    catchHelper(err,reject){
        if (this.catch_error) {
            reject(err)
        } else {
            typeof this.onNetworkError === 'function' ? this.onNetworkError(err) : reject(err)
        }
    }

    exec () {
        
        const url = this.posUrl(this.path) ? `${this.path}` :`${this.baseUrl}${this.path}`

        return new Promise((resolve, reject) => {

            let token =  uni.getStorageSync("TOKEN")
            let request = {
                url,
                method: this.method,
                data: this.body,
                params: this.params,
                header: Object.assign(this.headers,{token}),
            }
			
			console.log(request,"requestrequest")

            if (this.useLoading) {
                this.defaultLoading.show()
            }

            uni.request(request).then(data => {

                if (this.useLoading) {
                    this.defaultLoading.hide()
                }

                var [error, response]  = data

                if(error){
                    this.catchHelper(error,reject)
                    return
                }

                if(response.statusCode === 200){
                    response = response.data
                }else{
                    this.catchHelper(response.data,reject)
                    return
                }
			

                const { success } = response
                if ( success ) {
                    resolve(response)
                } else {
                    // TODO
                    if(response.errCode == 401){
                        return new Promise(() => { 
                            uni.login({
                                provider: "weixin",
                                success: async (result) => {
                                    const response = await API.login({
                                        code: result.code,
                                        merchantId: config.merchantId
                                    })
                
                                    uni.setStorageSync(constants.TOKEN,response.data.token)
                                    uni.setStorageSync(constants.CUSTOMERID,response.data.customerId)

                                    token =  uni.getStorageSync("TOKEN")
                                    request = {
                                        url,
                                        method: this.method,
                                        data: this.body,
                                        params: this.params,
                                        header: Object.assign(this.headers,{token}),
                                    }
                        
                                    if (this.useLoading) {
                                        this.defaultLoading.show()
                                    }

                                    uni.request(request).then(data => {

                                        if (this.useLoading) {
                                            this.defaultLoading.hide()
                                        }
                        
                                        var [error, response]  = data
                        
                                        if(error){
                                            this.catchHelper(error,reject)
                                            return
                                        }
                        
                                        if(response.statusCode === 200){
                                            response = response.data
                                        }else{
                                            this.catchHelper(response.data,reject)
                                            return
                                        }
                                    
                        
                                        const { success } = response
                                        if ( success ) {
                                            resolve(response)
                                        }else{
                                            if (!this.server_error && typeof this.onServerError === 'function') {
                                                this.onServerError(response)
                                            } else {
                                                resolve(response)
                                            }
                                        }
                                    })
                                }
                            })
                        })
                    }
                    if (!this.server_error && typeof this.onServerError === 'function') {
                        this.onServerError(response)
                    } else {
                        resolve(response)
                    }
                }

            })
        })

    }
}

class HttpServe {

    constructor(options = {}) {

        this.params = {}
        this.body = {}

        const { baseUrl = '', checkCode, headers, defaultLoading, onNetworkError, onServerError } = options

        // 公用模块
        this.headers = Object.assign({}, headers)
        this.checkCode = checkCode
        this.baseUrl = baseUrl
        this.defaultLoading = defaultLoading
        this.onNetworkError = onNetworkError    // catch统一方法
        this.onServerError = onServerError      // 统一处理 code 码错误处理
    }

    get (path, params = {}) {
        this.params = params
        this.body = params
        return new Call(this, GET, path)
    }

    post (path, body = {}) {
        this.body = body
        this.params = {}
        return new Call(this, POST, path)
    }

    // 设置请求头
    setHeaders (headers = {}) {
        this.headers = Object.assign(this.headers, headers)
        return this
    }
}

export default HttpServe