const config_defalut = require("./config")
const env = process.env.NODE_ENV

console.log(env,"envenvenv")

let config = {}
if(['development'].includes(env)){
    config = require('./config.' + env).default
}

config = Object.assign(config_defalut,config)
export default {
    ...config
}