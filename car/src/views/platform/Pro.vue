<template>
    <div class="pro-wrapper">
        <div class="pro-back">
            <el-page-header @back="goBack" :content="id == 1 ? '添加车辆信息' :'编辑车辆信息'">
            </el-page-header>
        </div>
        <div class="pro-form">
            <el-form
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
                    :status-icon="true"
            >
                <el-form-item label="汽车品牌" prop="brand">
                    <el-select v-model="ruleForm.brand" placeholder="请选汽车品牌">
                        <el-option :label="item.brand" :key="index" :value="item.typeId" v-for="(item,index ) in proBrandList "></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="汽车型号" prop="model">
                    <el-input v-model="ruleForm.model" placeholder="请输入汽车型号"></el-input>
                </el-form-item>
                <el-form-item label="车身颜色" prop="color">
                    <el-select v-model="ruleForm.color" placeholder="请选择车身颜色">
                        <el-option :label="item.title" :value="item.value" v-for="(item , index) in carColorList" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="具体价格" prop="price" >
                    <el-input  max="15" min="0" v-model="ruleForm.price" placeholder="请输入汽车价格" prefix-icon="">
                        <template  slot="prefix">
                            <i class="price-icon fa fa-jpy" aria-hidden="true"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="汽车数量" prop="num">
                    <el-input-number v-model="ruleForm.num"  :min="1" :max="1000000000" ></el-input-number>
                </el-form-item>


                <el-form-item label="是否下架">
                    <el-switch v-model="ruleForm.isDismount"></el-switch>
                </el-form-item>
                <el-form-item label="车辆图片" prop="carPic">
                    <el-upload
                            :action="uploadUrl()"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-success="handleSuccess"
                            :multiple="false"
                            :before-upload="handleBeforeUpload"
                            :limit="1"
                            :file-list="fileList"
                            >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item label="备注信息" prop="desc">
                    <el-input show-word-limit type="textarea" maxlength="200" placeholder="可在此添加相关备注" v-model="ruleForm.desc" :autosize="{ minRows: 2, maxRows: 6 }" resize="none"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">{{id === 1 ? "立即添加" : "修改完毕"}}</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script>
    import ownAxios from "../../assets/js/ownAxios";
    import {vailForm} from "../../assets/js/valiForm";

    export default {
        name: "Pro" ,
        data: () => ({

            //用于保存临时数据
            temporaryProductInfo : {} ,

            //提交模式
            id : '' ,

            //上传图片数组
            fileList :[],

            //车辆品牌列表
            proBrandList : [] ,

            //表单数据
            ruleForm: {
                //车辆品牌
                brand: '',
                //车辆型号
                model: '',
                //车辆价格
                price: '',
                //车辆库存
                num: 1,
                //车辆图片
                carPic:'',
                //车辆图片类型
                carPicType : '',
                //车身颜色
                color: '',
                //是否下架
                isDismount: false,
                //车辆备注
                desc: ''
            },

            //车身颜色数组
            carColorList:[
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

            //图片大小
            imgSize: 1 ,

            //图片放大属性
            dialogImageUrl: '',
            dialogVisible: false ,

            //表单验证验证规则
            rules: {
                brand: [
                    { required: true, message: '请选择汽车品牌', trigger: 'blur' },
                ],
                model: [
                    { validator: vailForm.rmScriptVail('请输入正确的车辆型号') , required: true, trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                carPic: [
                    {  required: true,message: '请添加车辆图片' , trigger: 'change' }
                ],
                price: [
                    { validator: vailForm.digitalVail('请输入汽车价格,必须为数字格式,小数为2位') , required: true, trigger: 'blur' }
                ],
                color: [
                    {  required: true, message: '请选择车身颜色', trigger: 'change' }
                ],
                desc: [
                    { validator:vailForm.rmScriptVail('请输入正确文本内容'), trigger: 'blur' }
                ],
            }
        }),
        methods: {

            //返回上一层
            goBack(){
                this.$router.go(-1) ;
            },

            //提交表单数据函数
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.isDismount = this.ruleForm.isDismount ? 1 : 0 ;
                        if(this.id == 2){

                            //获取编辑的数据
                            let data = {};
                            for(let k in this.temporaryProductInfo){
                                if(this.temporaryProductInfo[k] != this.ruleForm[k]){

                                    if(k === 'carPic'){
                                        data[k + 'Type'] = this.ruleForm[k + 'Type'] ;
                                    }
                                    data[k] = this.ruleForm[k] ;
                                }
                            }

                            if(JSON.stringify(data) === '{}'){
                                this.$router.push({name : 'Products'})
                                return ;
                            }

                            data.cid = this.ruleForm.cid ;

                            this.editProduct(data);
                        }else{
                            this.addProduct() ;
                        }
                    } else {

                        return false;
                    }

                });
            },

            //编辑车辆信息
            editProduct(data){
                ownAxios.editPostProduct(data , res =>{

                    if(res.data.code === 1086){
                        this.$notify({
                            title: '成功',
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.$router.push({name : 'Products'});
                    }

                })
            },

            //添加车辆信息
            addProduct(){
                ownAxios.addPostProduct(this.ruleForm , res =>{

                    if(res.data.code === 1080){
                        this.$notify({
                            title: '成功',
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.$router.push({name : 'Products'});
                    }
                    this.$router.push({name : 'Products'});
                })
            },

            //重置表单数据函数
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },


            //放大图片函数
            handlePictureCardPreview(file) {

                this.dialogImageUrl = file.url;

                this.dialogVisible = true;
            },

            //配置图片上传路径
            uploadUrl(){
                return "http://127.0.0.1:8022/uploadImg";
            },

            //上传图片成功回调函数
            handleSuccess(res, file){


                let fileType = file.raw.type.split('/')[1];

                //将文件转换成base64

                //创建文件读取对象
                let fileReader = new FileReader();
                let self = this ;

                fileReader.onload = function(){

                    //将图片base64值储存
                    self.ruleForm.carPic = this.result.replace(/data:image\/[A-Za-z]*;base64,/ , '') ;
                    self.ruleForm.carPicType = fileType ;
                }

                fileReader.readAsDataURL(file.raw);
            },

            //图片上传前回调函数
            handleBeforeUpload(file){
                //控制上传图片大小
                let fileSize = file.size / 1024 / 1024 ;

                if (fileSize > this.imgSize){
                    this.$notify({
                        title: '警告',
                        message: `上传图片大小不能超过${this.imgSize}MB`,
                        type: 'warning'
                    });
                    return false;
                }
            },

            //获取车辆品牌
            getProBrand(){
                ownAxios.getProBrand(null , result => {

                    if(result.data.code === 1044){
                        this.proBrandList = result.data.result ;
                    }
                })
            },

            //根据车辆id查看车辆详细信息
            getProductByCid(cid){
                ownAxios.getProductByCid({
                    cid
                }, res => {
                    if(res.data.code === 1072) {
                        this.ruleForm = res.data.result[0] ;

                        //复制一份数据，用于判断用户是否修改数据
                        this.temporaryProductInfo = Object.assign({},res.data.result[0]);

                        this.fileList.push({url : this.staticUrl+ '/' + this.ruleForm.carPic});
                    }
                })
            }
        } ,
        created(){
            let params = this.$route.params ;


            this.id = params.id ;

            this.getProBrand();

            if(this.id == 2 ){
                this.getProductByCid(params.cid);
            }
        },

    }
</script>

<style lang="less" scoped>
    .pro-back{
        padding :0 10px 8px;
        margin-bottom : 20px ;
        border-bottom : 1px solid rgba(7,17,27,.1);
    }

    .price-icon{
        margin-left : 10px ;
    }
</style>