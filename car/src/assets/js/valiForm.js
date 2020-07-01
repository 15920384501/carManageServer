class VailForm {
    constructor() {
        this.vaildata = {

            //用户名称
            username : {
                reg : /^[\w\u4e00-\u9fa5]{4,10}$/,
                msg : '昵称不少于4位，只支持字母、汉子、数字、_下划线'
            },

            //邮箱
            email : {
                reg : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                msg : '邮箱格式不正确'
            },

            //密码
            password : {
                reg : /^[A-Za-z]\w{5,15}$/,
                msg : '密码为6位以上，只支持字母、数字、_下划线且首字符必须为字母'
            },

            //确认密码
            againPassword: {
                reg : /^[A-Za-z]\w{5,15}$/,
                msg : '密码只支持字母、数字、_下划线且首字符必须为字母'
            },

            //验证码
            code : {
                reg : /^\d{6}$/,
                msg : '验证码必须为6位数字'
            }
        }
    }

    //验证登录注册表单
    vail(obj){
        //验证通过返回true，否则返回false
        for(let key in obj){
            if( !this.vaildata[key].reg.test(obj[key]) ){
                return {
                    pass : false ,
                    msg : this.vaildata[key].msg
                }
            }
        }


            return true ;
    }

    //验证输入内容不能含有<script>
    rmScriptVail(str){
        return (rule , value ,callback) => {


            if(!/<\/?script>/.test(value) && value !== ''){
                callback();
            }else{
                callback(new Error(str));
            }

        }
    }

    //验证输入内容必须为正确数字格式
    digitalVail(str){
        return (rule , value ,callback) => {


            if(/^(([1-9]\d*)|0)(\.\d{1,2})?$/.test(value)){
                callback();
            }else{
                callback(new Error(str));
            }

        }
    }
}
export const vailForm = new VailForm() ;