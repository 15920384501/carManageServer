<template>
    <div class="register-wrapper">
        <!--        登录表单-->
        <div class="register-mask">
        </div>
        <div class="register-form">
            <h1 class="form-text">登  录</h1>
            <el-form :model="user"  label-position="right" label-width="80px" >

                <el-form-item>
                    <span class="text" slot="label">邮箱</span>
                    <el-input v-model.trim="user.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item class="password">
                    <span class="text" slot="label">密码</span>
                    <el-input v-if="showPW" type="text" v-model.trim="user.password" placeholder="请输入密码"></el-input>
                    <el-input v-else type="password" v-model.trim="user.password" placeholder="请输入密码"></el-input>

                    <span class="icon-eye icon" @mousedown="showPassword('showPW')" @mouseup="unShowPassword('showPW')"></span>
                </el-form-item>
                <el-form-item>
                    <el-row :gutter="20">
                        <el-col :span="17">
                            <el-button type="success" class="register-btn" plain @click="onLogin">登录</el-button>
                        </el-col>
                        <el-col :span="3">
                            <el-button type="info" plain @click="onReset">重置</el-button>
                        </el-col>
                    </el-row>


                </el-form-item>
                <div class="form-foot">
                    <div class="change-register"  @click="$router.push({name : 'Register'})">
                        未有账号？去注册
                    </div>
                    <div class="forget">
                        忘记密码？
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {vailForm} from "../assets/js/valiForm";
    import ownAxios from "../assets/js/ownAxios";

    export default {
        name: "Login",
        data : () => ({
            user :{

                //邮箱
                email : '',
                //密码
                password : '',

            },

            //是否展示密码
            showPW : false ,
            showAPW : false ,
        }),
        methods : {

            //登录
            onLogin(){
                let result = vailForm.vail(this.user)  ;
                if(result.pass === false) {

                    //输入信息有误，错误弹窗提示
                    this.$message.error(result.msg);
                }else{

                    //登录
                    // this.axios({
                    //     url : '/login',
                    //     method : 'POST' ,
                    //     data : this.user
                    // }).then(result => {
                    //     if(result.data.code === 1020 ){
                    //         this.$notify({
                    //             title: '成功',
                    //             message: result.data.msg ,
                    //             type: 'success'
                    //         });
                    //         this.$cookies.set('_ck',result.data.token , '5d');
                    //         this.$router.push({name : 'Platform' });
                    //     }else{
                    //         this.$notify.error({
                    //             title: '错误',
                    //             message: result.data.msg ,
                    //         });
                    //     }
                    // }).catch(err => {
                    // });

                    //登录请求封装后
                    ownAxios.login(this.user , result => {

                        if(result.data.code === 1020 ){
                            this.$notify({
                                title: '成功',
                                message: result.data.msg ,
                                type: 'success'
                            });
                            this.$cookies.set('_ck',result.data.token , '5d');
                            this.$router.push({name : 'Platform' });
                        }else{
                            this.$notify.error({
                                title: '错误',
                                message: result.data.msg ,
                            });
                        }
                    })
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

        .form-foot{
            display: flex ;
            justify-content: space-between ;
            cursor: pointer ;

            .change-register{
                flex : 1 ;
                color : #ccc ;
                text-align : center ;
                font-size : 16px ;
            }

            .forget{
                color : #333 ;
                flex : 1 ;
                text-align: right ;
            }
        }

    }
</style>