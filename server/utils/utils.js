//导入发邮箱模块
const nodemailer = require("nodemailer");

//导入加密模块，js核心模块
const crypto = require('crypto') ;

//创建发邮箱配置
let transporter =  nodemailer.createTransport(config.emailOption);

//导入jsonwebtoken，生成和解析token的模块
const jsonwebtoken = require('jsonwebtoken') ;

class Utils {

    //发送邮箱验证码
    sendEmail(emails , code , fn ){
        //emails 收件地址， string
        //code 拥有像验证码
        //fn  回调函数 fn(err , data){} err存在则发送失败

        transporter.sendMail({

            //发件地址
            from : config.emailOption.auth.user,

            //收件地址
            to : emails ,

            //右键主题
            subject : '用户注册邮箱验证码' ,

            //邮件内容，可选择html
            text : `您的验证码为：${code} , 5分钟内有效`

        },fn) ;

    }

    //加密
    encodeString(value) {
        let md5 = crypto.createHash('md5');
        return md5.update(value).digest('hex');
    }

    //生成token，签名字符串
    signString(value , salt , expiresIn){

        //value 要签名的字符串
        //salt  加盐
        //expriesIn  过期时间

        //过期时间写法
        //60 ==> '60s'
        //'100' ==> '100ms'
        //'2 days' ==> '2天'
        //'10h' ==> '10小时'
        //'7d' ==> '7天'

        return jsonwebtoken.sign({
            value
        }, salt , {
            expiresIn
        })
    }

    //解析签名字符串, 解析token
    verifyString(value, salt, fn) {
        /**
         * {
         *   value: token字符串,
         *   salt: 加盐,
         *   fn: 回调函数
         * }
         *
         * fn(err, decoded) {}
         */

        jsonwebtoken.verify(value, salt, fn);
    }

    //转化cookie
    transformCookie(cookie){
        let obj = {} ;

        //处理cookie
        cookie.split(';').forEach(item => {
            obj[item.split('=')[0].trim()] = item.split('=')[1] ;
        });

        return obj ;

    }

}

module.exports = new Utils ;
