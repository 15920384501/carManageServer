<template>
    <div class="type-wrapper">
        <div class="type-search">
            <span class="search-title">汽车品牌：</span>
            <el-input  maxlength="20"  prefix-icon="el-icon-search" v-model.trim="search" placeholder="请输入搜索内容"></el-input>
            <el-button type="primary" @click="searchKeyword"  >搜索全部</el-button>

            <div v-show="search.length > 0 " class="type-refresh">
                <i class="el-icon-circle-close" @click="onCancelSearch"></i>
            </div>
        </div>
        <div class="type-add">
            <el-button type="warning" round  @click="handleAdd">添加车辆品牌</el-button>
        </div>

<!--        品牌数据列表-->
        <div class="type-list">
            <template>
                <el-table
                        :data="displayedTypeLIst"
                        style="width: 100%"
                        current-row-key="scope.row.typeId"
                        >
                    <el-table-column label="序号" width="80" align="center">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>

                    </el-table-column>

                    <el-table-column
                            label="品牌名称"
                            width="180"
                            align="center">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p>品牌: {{ scope.row.brand }}</p>
                                <p>隶属: {{ scope.row.company }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium">{{ scope.row.brand }}</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="80" align="center">
                        <template slot-scope="scope">
                            <span class="type-state" :class="{'disable': scope.row.isDisable  }">
                                {{scope.row.isDisable ? '禁用' : '启用'}}
                            </span>
                        </template>

                    </el-table-column>
                    <el-table-column
                            label="添加日期"
                            width="200"
                            align="center">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.createdAt | dateFilter }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="更新日期"
                            width="200"
                            align="center">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.updatedAt | dateFilter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"
                                     align="center">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button
                                    size="mini"
                                    :type="scope.row.isDisable ? 'success' : 'danger'"
                                    @click="handleChange(scope.row)">{{scope.row.isDisable ? '启用' : '禁用'}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

        </div>

<!--        列表页码-->
        <div class="type-page">
            <el-pagination
                    background
                    layout="prev, pager, next, jumper"
                    :total="totalCount"
                    :page-size="pageCount"
                    :current-page.sync="page"
                    :hide-on-single-page="totalCount < 8"
                    @current-change="handleCurrentChange"
                    @prev-click="onPrevPage"
                    @next-click="onNextPage">
            </el-pagination>
        </div>

<!--        添加品牌信息弹窗-->
        <div class="type-add">
            <el-dialog
                    :title="isAdd ? '添加品牌信息' : '修改品牌信息'"
                    :visible.sync="dialogFormVisible"
                    :before-close="closeForm">
                <el-form :model="form">
                    <el-form-item label="汽车品牌" :label-width="formLabelWidth">
                        <el-input v-model.trim="form.brand" autocomplete="off" placeholder="请输入汽车品牌名称"></el-input>
                    </el-form-item>
                    <el-form-item label="隶属公司" :label-width="formLabelWidth">
                        <el-input v-model.trim="form.company" autocomplete="off"  placeholder="请输入品牌隶属公司"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeForm">取 消</el-button>
                    <el-button type="primary" @click="setType" :disabled="isNullForm"  v-loading.fullscreen.lock="fullscreenLoading">完 成</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    import ownAxios from "../../assets/js/ownAxios";

    export default {
        name: "Type",
        data : () => ({

            //搜索关键词
            search : '',

            //品牌类型列表
            typeList : [],

            //展示数据
            displayedTypeLIst : [] ,

            //弹出管是否展示
            dialogFormVisible: false,

            //弹出框内容
            form: {
                brand: '',
                company: '',
            },

            //弹出框标题宽度
            formLabelWidth: '120px' ,

            //是否显示加载
            fullscreenLoading : false,

            //修改or添加
            isAdd: true ,

            //品牌对象
            typeObj : null ,

            //每页展示数据数量
            pageCount : 7 ,

            //总数量
            totalCount : 0 ,

            //当前页码数
            page : 1 ,
        }),
        methods : {

            //页面跳转
            handleCurrentChange(){
                this.initData() ;
            },

            //点击上一页
            onPrevPage(){

                    this.page -- ;
                    this.initData() ;

            },

            //点击下一页
            onNextPage(){

                    this.page ++ ;
                    this.initData() ;

            },

            //添加窗口
            handleAdd(){

                //改变字体，打开窗口
                this.isAdd = true ;
                this.dialogFormVisible = true ;
            },

            //修改窗口
            handleEdit(item){

                //改变字体，打开窗口
                this.isAdd = false ;
                this.dialogFormVisible = true ;

                //获取当前品牌信息，在输入框显示
                this.form.brand = item.brand ;
                this.form.company = item.company ;
                this.typeObj = item ;

            },

            //禁用or启用
            handleChange(item){

                //改变数据库数据
                ownAxios.changeState({
                    typeId : item.typeId ,
                    userId : item.userId ,
                    isDisable : !item.isDisable
                },result => {

                    if(result.data.code === 1050 ){
                        item.isDisable = !item.isDisable ;
                    }
                    this.$notify.info({
                        title: '提示',
                        message: result.data.msg
                    });
                })
            },

            //添加品牌信息
            addType(loading){
                //生成typeId
                let typeId = '_tp' + Math.random().toString().slice(-6) + new Date().getTime() ;

                //发起添加请求
                ownAxios.addType({
                    typeId ,
                    brand : this.form.brand ,
                    company : this.form.company
                },result => {

                    //关闭加载
                    loading.close();

                    //添加成功
                    if(result.data.code === 1060 ){

                        //添加信息成功,刷新页面
                        this.page = 1 ;
                        this.initData();


                        //重新获取数据长度
                        this.getTypeDataRows();



                        // this.typeList.unshift(result.data.result);
                        //
                        // //如果超出，则假删除最后一项
                        // if(this.typeList.length > this.pageCount ){
                        //     this.typeList.pop();
                        // }


                        this.$notify({
                            title: '成功',
                            message: result.data.msg,
                            type: 'success'
                        });

                        //关闭弹窗，清空输入框信息
                        this.dialogFormVisible = false ;
                        this.form.brand = '' ;
                        this.form.company = '' ;

                    }else{

                        //添加信息失败，提示信息
                        this.$notify({
                            title: '警告',
                            message: result.data.msg,
                            type: 'warning'
                        });
                    }


                });

            },

            //修改品牌信息
            editType(loading){

                //判断输入框值是否发生改变
                if(this.typeObj['brand'] === this.form.brand && this.typeObj['company'] === this.form.company ){

                    //关闭加载，关闭窗口
                    loading.close();
                    this.dialogFormVisible = false ;

                }else{

                    //申请修改信息接口
                    ownAxios.editType( {
                        typeId : this.typeObj.typeId  ,
                        brand : this.form.brand ,
                        company : this.form.company
                    },result => {

                        //关闭加载
                        loading.close();

                        if(result.data.code === 1063 ){

                            this.typeList.forEach(item => {
                                if(item.typeId === this.typeObj.typeId){
                                    item.brand = this.form.brand  ;
                                    item.company =   this.form.company  ;
                                    item.updatedAt = new Date() ;
                                }
                            })

                            //修改信息成功
                            this.$notify({
                                title: '成功',
                                message: result.data.msg,
                                type: 'success'
                            });

                            //关闭弹窗，清空输入框信息
                            this.dialogFormVisible = false ;
                            this.form.brand = '' ;
                            this.form.company = '' ;

                        }else{

                            //添加信息失败，提示信息
                            this.$notify({
                                title: '警告',
                                message: result.data.msg,
                                type: 'warning'
                            });
                        }

                    })
                }
            },

            //改变品牌信息的操作
            setType(){

                //显示加载中
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                //当添加时
               if(this.isAdd){
                    this.addType(loading);

               }else{

                   //当修改时
                   this.editType(loading);
               }


            },

            //关闭弹窗回调函数
            closeForm(){
                for(let key in this.form){
                    this.form[key] = '';
                }
                this.dialogFormVisible = false ;
            } ,

            //搜索功能
            searchKeyword(){
                if(this.search){

                    //搜索车辆品牌数据
                    this.searchType();

                    //获取搜索品牌数据量
                    this.searchRows() ;
                }
            } ,

            //搜索车辆品牌类型数据数量，用于搜索分页
            searchRows(){
                ownAxios.searchRows({
                    keyword : this.search
                },result => {
                    this.totalCount = result.data.result ;
                })
            },

            //搜索车辆品牌方法
            searchType(){
                ownAxios.search({
                    keyword : this.search ,
                    offset : (this.page - 1 ) * this.pageCount ,
                    limit : this.pageCount
                },result => {
                    if(result.data.code  === 1065){
                        this.page = 1 ;
                        this.displayedTypeLIst = result.data.result ;
                    }
                })
            } ,

            //清除搜索，刷新页面
            onCancelSearch(){
                this.search = '' ;
                this.page = 1 ;
                this.getTypeDataRows();
                this.displayedTypeLIst = this.typeList ;
            },

            //获取初始化数据
            initData(){
                //请求获取品牌列表数据
                ownAxios.getTypeData({
                    //数据偏移量
                    offset : (this.page -1 ) * this.pageCount ,

                    //每次获取数据量
                    limit  : this.pageCount
                } ,result => {
                    if(result.data.code === 1040){
                        this.typeList = result.data.result ;
                        this.displayedTypeLIst = this.typeList ;
                        this.search = '' ;
                    }else{
                        this.$notify.error({
                            title: '错误',
                            message: result.data.msg
                        });
                    }

                })
            },

            //获取数据表的数据数量
            getTypeDataRows(){
                ownAxios.getTypeDataRows(null , result => {

                    this.totalCount = result.data.result  ;
                })
            }
        },
        computed : {

            // //展示在页面中的品牌数据，假数据
            // displayedTypeLIst(){
            //     let list = []
            //     this.typeList.filter(item => {
            //         if(item.brand.indexOf(this.search) > -1 ){
            //            list.push(item) ;
            //         }
            //     })
            //     return list ;
            // } ,

            //判断表单是否为空
            isNullForm(){

                //内容是否为空，为空则禁用状态
                if(this.form.brand && this.form.company){
                    return false ;
                }

                return true ;
            }
        },
        created(){
            this.initData() ;



            //获取数据表的数据数量
            this.getTypeDataRows();
        },
    }
</script>

<style lang="less" scoped>
    .type-search{
        width : 500px ;
        height : 40px ;
        line-height : 40px ;
        display: flex ;
        position : relative ;

        .search-title{
            display: block;
            flex : 0 0 100px ;
        }

        .type-refresh{
            font-size : 28px ;
            position : absolute;
            right : -36px  ;
            color : indianred;
            cursor : pointer ;
        }



        & /deep/ .el-input{
            margin-right : 10px ;
        }
    }

    .type-add{
        margin : 28px 0 ;
    }

    .type-state{
        color : yellowgreen ;

        &.disable{
            color : red ;
        }
    }

    .type-page{
        overflow: hidden ;
        margin : 50px auto  ;
        text-align : center ;

        /*& /deep/ .el-pagination{*/
        /*    margin : 0 auto ;*/
        /*    text-align: center;*/
        /*}*/
    }
</style>