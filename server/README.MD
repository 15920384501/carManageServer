# Server

## 安装
```
$ npm install
```

## 运行
```
$ node app.js
```
## 数据接口
### post 接口
```
/register         // 注册
/login            // 登录
/sendEmailCode    // 发送邮箱验证码
/changeState      // 切换车辆状态
/addType          // 添加车辆品牌信息
/editType         // 修改车辆品牌信息
/uploadImg        // 上传图片
/postProduct      // 添加车辆详细信息
/upDown           // 车辆上下架
/removeProduct    // 删除车辆详细信息
/editProduct      // 编辑车辆详细信息
```

### get 接口
```
/getType          // 获取初始化车辆品牌信息 
/search           // 获取搜索内容
/typeRows         // 获取数据表的记录数
/searchRows       // 获取搜索数据量
/userInfo         // 获取用户信息
/proBrand         // 获取车辆品牌
/productList      // 获取车辆详细信息
/productListRows  // 获取车辆详细详细数据量
/productByCid     // 根据车辆id获取车辆详细信息
```
