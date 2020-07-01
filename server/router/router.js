//路由层

//导入路由控制层
const routerController  = require(__baseurl + '/router_controller/routerController.js')

module.exports = app => {

    //验证邮箱验证码
    app.use(routerController.testMailCode) ;

    //验证token字符串
    app.use(routerController.testToken) ;

    //注册
    app.post('/register',routerController.registerControl) ;

    //登录
    app.post('/login',routerController.loginControl) ;

    //发送邮箱验证码
    app.post('/sendEmailCode',routerController.sendEmailCode) ;

    //初始化车辆品牌信息
    app.get('/getType',routerController.getTypeData) ;

    //初始化车辆品牌信息
    app.post('/changeState',routerController.changeState) ;

    //添加车辆品牌信息
    app.post('/addType',routerController.addType) ;

    //修改车辆品牌信息
    app.post('/editType' , routerController.editType) ;

    //搜索功能
    app.get('/search',routerController.searchKeyword ) ;

    //获取数据表的记录数
    app.get('/typeRows',routerController.typeRows ) ;

    //获取搜索数据量
    app.get('/searchRows',routerController.searchRows ) ;

    //获取用户信息
    app.get('/userInfo',routerController.getUserInfo ) ;

    //上传图片
    app.post('/uploadImg',routerController.uploadImg) ;

    //获取车辆品牌
    app.get('/proBrand',routerController.proBrand) ;

    //添加车辆详细信息
    app.post('/postProduct',routerController.postProduct) ;

    //获取车辆详细信息
    app.get('/productList',routerController.productList) ;

    //获取车辆详细详细数据量
    app.get('/productListRows',routerController.productListRows) ;

    //上下架
    app.post('/upDown',routerController.upDown) ;

    //删除车辆详细信息
    app.post('/removeProduct' , routerController.removeProduct) ;

    //根据车辆id获取车辆详细信息
    app.get('/productByCid',routerController.productByCid) ;

    //编辑车辆详细信息
    app.post('/editProduct',routerController.editProduct) ;
}