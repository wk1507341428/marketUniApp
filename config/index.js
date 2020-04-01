const config_defalut = require("./zm-1v1-config").default
const env = process.env.NODE_ENV

let config = {}
if(['development'].includes(env)){
    config = require('./config.' + env).default
}

config = Object.assign(config_defalut,config)
export default {
    ...config
}