<template>
    <div class="platform-wrapper">
        <div class="platform-top">
            <h1 class="hidden-xs-only">车 辆 后 台 管 理 系 统</h1>
            <div class="top-right">
                <div class="user-img">
                    <el-avatar :size="60" :src="userInfo.userImg"></el-avatar>
                </div>
                <div class="user-name">
                    {{userInfo.username}}
                </div>
                <span class="user-setUp">
                    设置
                </span>
                <span class="user-loginOut">
                    退出
                </span>
            </div>
        </div>
        <div class="platform-content">
            <el-container>
                <el-aside width="200px">
                    <div class="platform-menu">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item  :name="item.name" v-for="(item,index) in platformMenu" :key="index">
                                <template slot="title">
                                    <div  class="menu-title" >
                                        <i class="menu-title-icon" :class="item.icon"></i>{{item.title}}
                                    </div>
                                </template>
                                <router-link tag="div" class="menu-option" :to="{name : item.name}" v-for="(item,index) in item.subTitle" :key="index">
                                    {{item.title}}
                                    <i :class="item.iconClass"></i>
                                </router-link>
<!--                                <router-link tag="div" :to="{ name : 'Products'}" class="menu-option">-->
<!--                                    车辆信息-->
<!--                                </router-link>-->

                            </el-collapse-item>
                            <el-collapse-item  name="2">
                                <template slot="title">
                                    <div  class="menu-title" >
                                        一致性 Consistency<i class="header-icon el-icon-info"></i>
                                    </div>
                                </template>
                                <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                                <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                            </el-collapse-item>
                            <el-collapse-item  name="3">
                                <template slot="title">
                                    <div  class="menu-title" >
                                        一致性 Consistency<i class="header-icon el-icon-info"></i>
                                    </div>
                                </template>
                                <div>简化流程：设计简洁直观的操作流程；</div>
                                <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                                <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
                            </el-collapse-item>
                            <el-collapse-item name="4">
                                <template slot="title">
                                    <div  class="menu-title" >
                                        一致性 Consistency<i class="header-icon el-icon-info"></i>
                                    </div>
                                </template>
                                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-aside>
                <el-main>

<!--                    二级路由  -->
                    <div class="container">
                        <router-view></router-view>
                    </div>
                </el-main>
            </el-container>

        </div>
    </div>
</template>

<script>
    import ownAxios from "../assets/js/ownAxios";

    export default {
        name: "Platform",
        data : () => ({
            activeName : 1 ,

            //用户信息
            userInfo : {} ,

            //平台侧栏菜单
            platformMenu:[
                {
                    title : '车辆管理',
                    icon : 'fa fa-car',
                    name : 1 ,
                    subTitle : [
                        {
                            title : '汽车品牌',
                            name : 'Type',
                            // iconClass : 'header-icon el-icon-info'
                        },
                        {
                            title : '车辆信息',
                            name : 'Products' ,
                            iconClass : 'header-icon el-icon-info'
                        },

                    ]
                },
                {
                    title : '订单管理',
                    icon : 'fa fa-calendar',
                    name : 2 ,
                    subTitle : [
                        {
                            title : '查看订单',
                            name : 'CheckOrder' ,

                        },
                        {
                            title : '管理订单',
                            name : 'ManagementOrder' ,
                            iconClass : ''
                        }
                    ]
                },
                {
                    title : '数据统计',
                    icon : 'fa fa-database',
                    name : 3 ,
                    subTitle : [
                        {
                            title : '车辆统计',
                            name : 'CarStatistics' ,

                        },
                        {
                            title : '订单统计',
                            name : 'OrderStatistics' ,
                            iconClass : ''
                        }
                    ]
                }
            ],

        }),
        methods : {

            //获取用户信息
            getUserInfo(){
                ownAxios.getUserInfo(null , result => {

                    if(result.data.code === 1042){
                        this.userInfo = result.data.result[0];
                    }
                })
            }
        },
        created(){
            this.getUserInfo();
        }
    }
</script>

<style lang="less" scoped>

    /*@keyframes active{*/
    /*    0%{*/
    /*        transform : rotateY(90deg)*/
    /*    }*/

    /*    100%{*/
    /*        transform: rotateY(0);*/
    /*    }*/
    /*}*/

    .platform-top{
        height : 80px ;
        width : 100% ;
        background-color : #ccc ;
        position : sticky ;
        top : 0 ;
        padding-left : 150px ;
        line-height : 80px ;
        display: flex ;
        justify-content: space-between ;
        z-index: 50;
        background-image : url("../assets/image/headerBackground.jpg");

        h1{
            flex: 1 ;
            color : #fff ;
            font-size : 30px ;
        }

        .top-right{
            flex :  0 0 300px ;
            height : 80px ;
            line-height : 80px ;
            padding-right : 50px ;
            display: flex;
            justify-content: space-between;
            color : #fff ;

            .user-img{
                height : 80px ;
                padding : 10px 0 ;
                cursor : pointer ;

                span{
                    display: block ;
                }
            }

            .user-setUp{
                cursor : pointer ;
            }

            .user-loginOut{
                cursor : pointer ;
            }
        }
    }

    .platform-menu{
        width : 200px ;
        background-color : #333 ;
        position : fixed ;
        top : 80px ;
        bottom : 0 ;

        .menu-title-icon{
            margin-right : 6px ;
        }
    }

    .menu-title{
        width : 100%;
        padding-left : 20px ;
        text-align: center ;
    }

    .platform-menu /deep/ .el-collapse-item__header{
        color : #fff ;
        background-color : rgb(23,30,38);
        border-bottom :1px solid  #ccc ;
    }

    .platform-menu /deep/ .el-collapse-item__header.is-active{
        border-bottom-color: transparent;
    }

    .platform-menu /deep/ .el-collapse-item__content{
        padding : 0 ;
    }

    .menu-option{
        height : 44px ;
        line-height : 44px ;
        color : #fff ;
        text-align : center ;
        background-color : rgb(66, 73 ,81) ;
        cursor : pointer ;
        /*border-bottom : 1px solid #ccc ;*/
        transition : all .2s ;

        &:hover{
            transform:translateX(10px) scaleZ(1.2);
            background-color :  rgb(45,52,60) ;
        }

        &.active{
            background-color : rgb(45,52,60) ;
            border-bottom: 0 ;

        }
    }
</style>