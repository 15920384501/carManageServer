<template>
    <div class="register-wrapper">
<!--        注册登录表单-->
        <div class="register-mask">
        </div>
        <div class="register-form">
            <h1 class="form-text">注  册</h1>
            <el-form  :model="user" label-position="right" label-width="80px" >
                <el-form-item required >
                    <span class="text" slot="label">用户名称</span>
                    <el-input v-model.trim="user.username" placeholder="请输入4位以上的用户名称"></el-input>
                </el-form-item>

                <el-form-item required >
                    <span class="text" slot="label">邮箱</span>
                    <el-input v-model.trim="user.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item class="password" required>
                    <span class="text" slot="label">密码</span>
                    <el-input v-if="showPW" type="text" v-model.trim="user.password" placeholder="请输入6位以上的密码"></el-input>
                    <el-input v-else type="password" v-model.trim="user.password" placeholder="请输入6位以上的密码"></el-input>

                    <span class="icon-eye icon" @mousedown="showPassword('showPW')" @mouseup="unShowPassword('showPW')"></span>
                </el-form-item>
                <el-form-item class="password" required>
                    <span class="text" slot="label">确认密码</span>
                    <el-input v-if="showAPW" type="text" v-model.trim="user.againPassword" placeholder="请再次确认密码" ></el-input>
                    <el-input v-else type="password" v-model.trim="user.againPassword" placeholder="请再次确认密码"></el-input>

                    <span class="icon-eye icon" @mousedown="showPassword('showAPW')"  @mouseup="unShowPassword('showAPW')"></span>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="16">
                        <el-form-item class="code" required>
                            <span class="text" slot="label">验证码</span>
                            <el-input class="code-input" v-model.trim="user.code" placeholder="请输入邮箱验证码" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8"><el-button type="primary" class="code-btn" plain @click="sendEmailCode">发送验证码</el-button></el-col>
                </el-row>
                <el-form-item>
                    <el-row :gutter="20">
                        <el-col :span="17">
                            <el-button type="success" class="register-btn" @click="onRegister" plain>注册</el-button>
                        </el-col>
                        <el-col :span="3">
                            <el-button type="info" plain @click="onReset">重置</el-button>
                        </el-col>
                    </el-row>


                </el-form-item>
                <div class="change-login" @click="$router.push({name : 'Login'})">
                    已有账号？登录
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {vailForm} from "../assets/js/valiForm";
    import ownAxios from "../assets/js/ownAxios";
    export default {
        name: "Register",
        data : () => ({
            user :{

                //用户名称
                username : '',
                //邮箱
                email : '',
                //密码
                password : '',
                //确实密码
                againPassword : '',
                //验证码
                code : '',
            },

            //是否展示密码
            showPW : false ,
            showAPW : false ,
        }),
        methods : {
            //触发注册
            onRegister(){

                //验证输入信息是否正确
                let result = vailForm.vail(this.user)  ;
                if(result.pass === false) {

                    //输入信息有误，错误弹窗提示
                   this.$message.error(result.msg);
                }else{

                    //信息输入正确，查看两次密码是否一致
                   if(this.user.password !== this.user.againPassword){
                       this.$message.error('密码不一致');
                   }else{

                       //密码一致，发起注册请求
                       //  this.axios({
                       //      url: '/register',
                       //      method : 'POST' ,
                       //      data : this.user
                       //  }).then(result => {
                       //
                       //      //注册成功，提示用户
                       //      if(result.data.code === 1012){
                       //          this.$notify({
                       //              title: '成功',
                       //              message: result.data.msg,
                       //              type: 'success'
                       //          });
                       //
                       //          //跳转路由
                       //          this.$router.push({name : 'Login'}) ;
                       //
                       //      }else{
                       //
                       //          //注册信息有误，提示用户
                       //          this.$notify({
                       //              title: '警告',
                       //              message: result.data.msg,
                       //              type: 'warning'
                       //          });
                       //      }
                       //  }).catch(err => {
                       //  })

                       //发送注册封装后
                       ownAxios.register( this.user , result => {


                           //注册成功，提示用户
                           if(result.data.code === 1012){
                               this.$notify({
                                   title: '成功',
                                   message: result.data.msg,
                                   type: 'success'
                               });

                               //跳转路由
                               this.$router.push({name : 'Login'}) ;

                           }else{

                               //注册信息有误，提示用户
                               this.$notify({
                                   title: '警告',
                                   message: result.data.msg,
                                   type: 'warning'
                               });
                           }
                       });
                   }

                }

            },

            //重置
            onReset(){
                for(let key in this.user){
                    this.user[key] = '' ;
                }
            },

            //展示密码
            showPassword(key){
                this[key] = true ;
            },

            //隐藏密码
            unShowPassword(key){
                this[key] = false ;
            },

            //发送邮箱验证码
            sendEmailCode(){
                let {email} = this.user ;

                //查看是否已经输入邮箱且邮箱是否符合规范
                if(email && /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)){

                    //满足条件，发送邮箱验证码
                    // this.axios({
                    //     method : 'POST' ,
                    //     url : '/sendEmailCode',
                    //     data : {
                    //         email : this.user.email
                    //     }
                    // }).then( result => {
                    //
                    //     if(result.data.code === 1010){
                    //         //发送成功，弹窗提示
                    //         this.$notify({
                    //             title: '发送成功',
                    //             message: result.data.msg,
                    //             type: 'success'
                    //         });
                    //
                    //     }else{
                    //         //发送失败，弹窗提示
                    //         this.$notify.error({
                    //             title: '错误',
                    //             message: result.data.msg,
                    //         });
                    //     }
                    // }).catch(err => {
                    // })

                    //发送验证码封装后
                    ownAxios.sendCode({
                                email : this.user.email
                            },result => {


                            if(result.data.code === 1010){
                                //发送成功，弹窗提示
                                this.$notify({
                                    title: '发送成功',
                                    message: result.data.msg,
                                    type: 'success'
                                });

                            }else{
                                //发送失败，弹窗提示
                                this.$notify.error({
                                    title: '错误',
                                    message: result.data.msg,
                                });
                            }
                        })


                }else{

                    //不符合规范，进行错误提示
                    this.$message.error('请先输入正确的邮箱账号');
                }
            }
        },

    }
</script>

<style lang="less" scoped>
    .register-wrapper{
        width : 100vw ;
        height : 100vh ;
        background-image : url("../assets/image/background.jpg") ;
        background-size : 100% 100%;
    }

    .register-mask{
        position : absolute;
        top : 0 ;
        left : 0 ;
        width : 100%;
        height : 100% ;
        -webkit-backdrop-filter: blur(30px);
        backdrop-filter: blur(30px);
        background-color : rgba(7,17,27,.5);
        z-index : 10 ;
    }

    .register-form{
       width : 500px ;
        padding : 20px ;
        background-color : #fff ;
        position : absolute ;
        top: 20% ;
        left : 50% ;
        margin-left : -250px ;
        z-index : 100 ;
        border-radius: 20px ;

        .form-text{
            color : #000 ;
            text-align : center ;
            font-size : 30px ;
            margin-bottom : 20px ;
            font-weight : 700 ;
        }

        .text{
            color : #333 !important;
        }

        .password{
            position : relative ;

            .icon{
                display: block;
                position : absolute ;
                top : 50% ;
                right : 6px ;
                margin-top : -9px ;
                font-size : 18px ;
                color : #ccc ;
                cursor : pointer ;

                &:hover{
                    color : #666 ;
                }
            }
        }

        .register-btn{
            width : 100% ;
            margin-right : 20px ;
        }

        .code-btn{
            width : 100%;
        }

        .change-login{
            color : #ccc ;
            text-align : center ;
            cursor: pointer ;
        }
    }
</style>