import httpServer from './httpServer'

const http = new httpServer({
    checkCode: ['0', '0000'],
    // 使用统一的catch 如果不想使用可以 http.get().catch_http_error() 即可以自己catch
    onNetworkError(err){
        console.log(err,"catch数据")
        return
    },
    
    // 统一处理code码错误， 如果不想使用 dispose_server_error() 可以自己处理
    onServerError(error_data){
        console.log(error_data,"code err数据")
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