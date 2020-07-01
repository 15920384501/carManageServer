//服务器配置
exports.serverOption =  {
    port : 8022 ,
    host : 'http://127.0.0.1'
}

//数据库操作sequelize配置
exports.databaseOptions = {
    //数据库名称
    database: 'carserver',

    //数据库用户名
    user: 'root',

    //数据库密码
    password: 'aww1030.',

    //数据地址
    host: 'localhost',

    //连接数据库类型
    dialect: 'mysql',

    //时区
    timezone: '+08:00',

    //设置连接池
    pool: {

        //最大连接数
        max: 10,

        //最小连接数
        min: 0,

        //连接超时30s,自动释放
        acquire: 30000,

        //闲置时间10s,自动释放
        idle: 10000
    }

}

//请求体配置
exports.requestBodyOptions = {
    limit : '3072kb'
}

//发邮件配置
exports.emailOption = {
    //主机
    host : 'smtp.163.com' ,

    //端口
    port : 465 ,

    //当端口为465时，应该设置为true
    secure : true ,

    //身份验证
    auth : {
        //发件地址
        user:'JOEcv001@163.com',

        //授权码
        pass: 'LSDAVFUYPXPHQZDR'
    }
}

//加盐配置
exports.saltOption = {

    //密码加盐
    passwordSalt : '_pw'
}

//token配置
exports.tokenOption = {

    //过期时间
    expires: '5d',

    //token加盐
    tokenSalt: '_tk'
}