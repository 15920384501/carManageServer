import Vue from 'vue'

class OwnAxios{

    //注册
    register(data , resFunc,errFunc){
        Vue.axios({
            url: '/register',
            method : 'POST' ,
            data : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //发送验证码
    sendCode(data , resFunc,errFunc){
        Vue.axios({
            url: '/sendEmailCode',
            method : 'POST' ,
            data : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //登录
    login(data , resFunc,errFunc){
        Vue.axios({
            url: '/login',
            method : 'POST' ,
            data : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //获取车辆品牌数据
    getTypeData(data , resFunc,errFunc){
        Vue.axios({
            url: '/getType',
            method : 'GET' ,
            params : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //更改状态，禁用或启用
    changeState(data , resFunc,errFunc){
        Vue.axios({
            url: '/changeState',
            method : 'POST' ,
            data : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //添加品牌信息
    addType(data , resFunc,errFunc){
        Vue.axios({
            url: '/addType',
            method : 'POST' ,
            data : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //修改品牌信息
    editType(data, resFunc , errFunc){
        Vue.axios({
            url: '/editType',
            method : 'POST' ,
            data : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //搜索功能
    search(data , resFunc , errFunc){
        Vue.axios({
            url: '/search',
            method : 'GET' ,
            params : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //获取数据表的数据数量
    getTypeDataRows(data, resFunc , errFunc){
        Vue.axios({
            url: '/typeRows',
            method : 'GET' ,
            params : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //搜索车辆品牌类型数据数量
    searchRows(data , resFunc , errFunc){
        Vue.axios({
            url: '/searchRows',
            method : 'GET' ,
            params : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //获取用户信息
    getUserInfo(data , resFunc , errFunc){
        Vue.axios({
            url: '/userInfo',
            method : 'GET' ,
            params : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //获取车辆品牌
    getProBrand(data , resFunc , errFunc){
        Vue.axios({
            url: '/proBrand',
            method : 'GET' ,
            params : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //添加车辆详细信息
    addPostProduct(data , resFunc , errFunc){
        Vue.axios({
            url: '/postProduct',
            method : 'POST' ,
            data : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //添加车辆详细信息
    editPostProduct(data , resFunc , errFunc){
        Vue.axios({
            url: '/editProduct',
            method : 'POST' ,
            data : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //获取车辆详细信息
    getProductList(data , resFunc , errFunc){
        Vue.axios({
            url: '/productList',
            method : 'GET' ,
            params : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //获取车辆详细信息记录数
    getProductListRows(data , resFunc , errFunc){
        Vue.axios({
            url: '/productListRows',
            method : 'GET' ,
            params : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //上下架
    upDown(data , resFunc , errFunc){
        Vue.axios({
            url: '/upDown',
            method : 'POST' ,
            data : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //删除车辆详细信息
    removeProduct(data , resFunc , errFunc){
        Vue.axios({
            url: '/removeProduct',
            method : 'POST' ,
            data : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }

    //根据车辆id请求车辆详细信息
    getProductByCid(data , resFunc , errFunc ){
        Vue.axios({
            url: '/productByCid',
            method : 'GET' ,
            params : {
                ...data,
                cookie : document.cookie
            }
        }).then(resFunc).catch(errFunc)
    }
}

export default new OwnAxios() ;