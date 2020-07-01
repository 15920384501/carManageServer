//模型集合

//导入用户信息表
const User  = require(__baseurl + '/db/model/user.js') ;

//导入验证码表
const Code  = require(__baseurl + '/db/model/code.js') ;

//导入验证码表
const Type  = require(__baseurl + '/db/model/type.js') ;

//导入验证码表，保存车辆详细信息
const Car  = require(__baseurl + '/db/model/car.js') ;

module.exports = {
    User ,
    Code ,
    Type ,
    Car ,
}
