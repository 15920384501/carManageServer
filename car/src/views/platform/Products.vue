<template>
    <div class="products-wrapper">

<!--        搜索输入框-->
        <div class="products-form clearFix">

            <div class="form-item fl">
                <div class="form-title">
                    车辆型号
                </div>
                <div class="form-input">
                    <el-input label="车辆型号"
                              type="text"
                              placeholder="请输入车辆型号"
                              v-model.trim="searchInfo.model">
                    </el-input>
                </div>
            </div>
            <div class="form-item fl">
                <div class="form-title">
                    车辆品牌
                </div>
                <div class="form-input">
                    <el-select v-model="searchInfo.brand" placeholder="请选择车辆品牌">
                        <el-option
                                v-for="item in proBrandList"
                                :key="item.typeId"
                                :label="item.brand"
                                :value="item.typeId">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="form-item fl">
                <div class="form-title">
                    车身颜色
                </div>
                <div class="form-input">
                    <el-select v-model="searchInfo.color" placeholder="请选择车身颜色">
                        <el-option
                                v-for="(item , index) in colorOptions"
                                :key="index"
                                :label="item.title"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="form-item fl">
                <div class="form-title">
                    添加日期
                </div>
                <div class="form-input">
                    <el-date-picker
                            v-model="searchInfo.createdAt "
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </div>
            </div>
            <el-button type="primary" @click="search" class="fl">搜索</el-button>
        </div>

<!--        添加按钮-->
        <div class="products-add">
            <el-button type="warning" @click="goPro(1)">添加车辆信息</el-button>
            <div @click="searchRefresh" v-if="showRefresh" class="refresh">
                <i class="fa fa-refresh" aria-hidden="true"></i>
            </div>
        </div>

<!--        车辆信息列表-->
        <div class="products-list">
            <template>
                <el-table
                        :data="displayedProLIst"
                        style="width: 100%"
                        current-row-key="scope.row.typeId"
                >
                    <el-table-column label="序号" width="80" align="center">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>

                    </el-table-column>

                    <el-table-column
                            label="车辆型号"
                            width="200"
                            align="center">
                        <template slot-scope="scope">
                            <span class="type-state" >
                                    {{scope.row.model}}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="品牌名称"
                            width="100"
                            align="center">
                        <template slot-scope="scope">
                            <span class="type-state" >
                                    {{scope.row.brand }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column label="车身颜色" width="80" align="center">
                        <template slot-scope="scope">
                            <span class="type-state" >
                                <span class="item-txt" :style="{'color' :scope.row.color , 'background-color' : scope.row.color === 'white' ? '#ccc' : '' }">
                                    <i class="fa fa-car" aria-hidden="true"></i>
<!--                                {{scope.row.color}}-->
                                </span>

                            </span>
                        </template>

                    </el-table-column>
                    <el-table-column label="状态" width="80" align="center">
                        <template slot-scope="scope">
                            <span class="type-state type-txt" :class="{'dismount' : scope.row.is_dismount}" >
                                {{scope.row.is_dismount ? '已下架' : '已上架'}}
                            </span>
                        </template>

                    </el-table-column>


                    <el-table-column
                            label="添加日期"
                            width="200"
                            align="center">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.created_at | dateFilter }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="更新日期"
                            width="200"
                            align="center">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.updated_at | dateFilter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"
                                     align="center">
                        <template slot-scope="scope">

                            <el-button
                                    size="mini"
                                    @click="handleEdit(2,scope.row)">编辑</el-button>

                            <el-button
                                    size="mini"
                                    :type="scope.row.is_dismount ? 'success' : 'warning'"
                                    @click="handleChange(scope.row)">{{scope.row.is_dismount ? '上架' : '下架'}}</el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleRemove(scope.row)">删除</el-button>
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
                    @current-change="handleCurrentChange"
                    @prev-click="onPrevPage"
                    @next-click="onNextPage">
            </el-pagination>

<!--            :hide-on-single-page="totalCount < 8"-->

        </div>
    </div>
</template>

<script>
    import ownAxios from "../../assets/js/ownAxios";

    export default {
        name: "Products",
        data: () => ({

            //每页展示数据数量
            pageCount : 7 ,

            //总数量
            totalCount : 0 ,

            //当前页码数
            page : 1 ,

            //搜索表单数据
            searchInfo : {
                brand : '',
                model : '',
                color : '',
                createdAt:'',
            },

            //品牌数组
            proBrandList : [] ,

            //颜色数组
            colorOptions:[
                {
                    title:'白色',
                    value : 'white'
                },
                {
                    title:'银色',
                    value : 'silver'
                },
                {
                    title : '黄色' ,
                    value : 'yellow'
                },
                {
                    title : '红色' ,
                    value : 'red'
                },
                {
                    title : '蓝色' ,
                    value : 'blue'
                },
                {
                    title : '绿色' ,
                    value : 'green'
                },
                {
                    title : '黑色' ,
                    value : 'black'
                }
            ],

            //车辆详细信息列表
            productList: [],

            //车辆详细信息展示数据列表
            displayedProLIst : [] ,


        }),
        methods:{

            //页面跳转
            handleCurrentChange(){
                this.getProductList() ;
            },

            //点击上一页
            onPrevPage(){

                this.page -- ;
                this.getProductList() ;

            },

            //点击下一页
            onNextPage(){

                this.page ++ ;
                this.getProductList() ;

            },

            goPro(id , cid){

                let params = {
                    id
                };

                if(cid) {
                    params.cid = cid ;
                }

                this.$router.push({name : 'Pro' , params });
            },


            handleEdit(id , item){
                this.goPro(id,item.cid)
            },

            //删除
            handleRemove(item){

                ownAxios.removeProduct({
                    cid : item.cid
                } , result =>{

                    if(result.data.code === 1084 && result.data.result === 1 ){
                        this.search();
                    }
                })
            },

            //上架or下架
            handleChange(item){

                // item.is_dismount = !item.is_dismount ;
                let bool = item.is_dismount ? 0 : 1 ;

                ownAxios.upDown({
                    isDismount : bool ,
                    cid : item.cid
                },result => {
                    if(result.data.code === 1082){
                        item.is_dismount = bool ;
                    }
                })
            },

            //获取搜索条件
            getSearchCondition(){
                let searchCondition = {} ;


                for(let key in this.searchInfo){
                    if(this.searchInfo[key] ){
                        searchCondition[key] = this.searchInfo[key];
                    }
                }

                //对时间进行处理
                if(this.searchInfo.createdAt){
                    let date = this.searchInfo.createdAt
                    let y = date.getFullYear();
                    let m = date.getMonth() + 1  ;
                    let d = date.getDate();
                    m = m < 10 ? '0' + m : m ;
                    d = d < 10 ? '0' + d : d ;
                    searchCondition.createdAt = `${y}-${m}-${d}` ;
                }

                return searchCondition ;
            },

            //获取车辆品牌
            getProBrand(){
                ownAxios.getProBrand(null , result => {

                    if(result.data.code === 1044){
                        this.proBrandList = result.data.result ;
                    }
                })
            },

            //获取车辆详细信息列表
            getProductList(){

                let searchCondition = this.getSearchCondition() ;

                //偏移数据量
                searchCondition.offset = (this.page - 1) * this.pageCount ;

                //设置获取数据长度
                searchCondition.limit = this.pageCount ;

                ownAxios.getProductList(searchCondition , result => {

                    if(result.data.code === 1072){

                        if(this.vailSearch()){

                            //如果存在搜索条件，将结果赋给假数组
                            this.displayedProLIst = result.data.result ;
                        }else{

                            //如果不存在搜索条件，将结果赋给真数组
                            this.productList = result.data.result ;
                            this.displayedProLIst = this.productList ;
                        }

                    }
                })

            },

            //搜索
            search(){
                //获取车辆详细信息
                this.getProductList()

                //获取车辆详细信息数据量
                this.getProductListRows();
            },

            //检测是否具有搜索条件  有：返回true 无：返回false
            vailSearch(){
                for(let key in this.searchInfo){
                    if( this.searchInfo[key] ){
                        return true ;
                    }
                }
                return false ;
            },

            //获取车辆详细信息数据数量
            getProductListRows(){
                let condition = this.getSearchCondition();

                ownAxios.getProductListRows(condition  , result => {

                    if(result.data.code === 1074){
                        this.totalCount = result.data.result ;
                    }
                });
            },

            //去除搜索
            searchRefresh(){
                for(let k in this.searchInfo){
                    this.searchInfo[k] = '' ;
                }
                this.search();
            }

        },

        computed : {
            showRefresh(){
                if(this.vailSearch()){
                    return true ;
                }
                return false ;
            }
        },

        created(){
            //获取品牌数据
            this.getProBrand();

            this.search();
        },
}
</script>

<style lang="less" scoped>


    .form-item{
        height : 40px ;
        line-height : 40px ;
        display: flex ;
        margin-right : 30px ;
        margin-bottom : 10px ;

        .form-title{
            flex : 0 0 80px ;
        }

        .form-input{
            flex : 0 0 200px ;
            width : 200px ;

            /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
                width : 200px ;
            }
        }
    }

    .products-add{
        margin-top : 20px ;
        display: flex ;
        justify-content : space-between ;

        .refresh{
            margin-right : 40px ;
            font-size : 24px ;
            color : #ccc ;
            line-height : 40px ;
            cursor: pointer ;
        }
    }

    .type-page{
        overflow: hidden ;
        margin : 50px auto  ;
        text-align : center ;
    }

    .item-txt{
        display: block;
        font-size : 20px ;
    }

    .type-txt{
        color : yellowgreen;

        &.dismount{
            color : red ;
        }
    }

</style>