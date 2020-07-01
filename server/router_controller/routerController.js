//路由控制层

//导入工具库
const utils = require(__baseurl + '/utils/utils.js') ;

//导入API层
const api = require(__baseurl + '/api/api.js') ;

//导入时间处理模块 moment
const moment = require('moment') ;

//导入文件系统模块
const fs = require('fs');

//导入sequelize
const Sequelize = require('sequelize') ;

//导入数据库操作符
const Op = Sequelize.Op ;

class RouterController {

    //验证邮箱验证码中间件
    testMailCode(req,res,next){

        //只有/register接口才需要验证
        if(whiteList.emailList.indexOf(req.url) > -1 ){

            //根据当前时间，获取5分钟前的时间
            let currentTime = new Date().getTime() - 5 * 60 * 1000 ;

            //使用moment对时间进行格式转换
            let data = moment(currentTime).format('YYYY-MM-DD HH:mm:ss') ;

            //查看是否该验证码，以及验证码是否过期
            api.findData('Code',{
                email : req.body.email ,
                code : req.body.code ,
                createdAt : {
                    [Op.gte] : data
                }
            }).then(result => {
                if(result.length < 1 ){

                    //验证不通过，回馈信息
                    res.send({msg : '该验证码不正确或已失效' , code : 1016})
                }else{

                    //验证通过
                    next() ;
                }

            }).catch( err => {

                console.log('err ==> ' , err) ;
                res.send({msg : '验证码验证失败' , code : 1015})
            })
        }else{

            //其他接口正常执行
            next() ;
        }
    }

    //验证token字符串
    testToken(req,res,next){
        //截取路径
        let url = req.url.split('?')[0];

        //是否需要验证token
        if(whiteList.tokenList.indexOf(url) > -1 ){

            //获取cookie
            let cookie = req.body.cookie || req.query.cookie ;

            //解析cookie
            cookie = utils.transformCookie(cookie);

            if(cookie['_ck']){

                //解析token
                utils.verifyString(cookie['_ck'],config.tokenOption.tokenSalt,( err , decoded ) =>{
                    if(err){
                        res.send({msg : '请先登录' , code : 1030 });
                    }else{

                        console.log('token验证通过');

                        //将userId传递
                        req.userId = decoded.value ;
                        next() ;
                    }
                })
            }else{
                res.send({msg : '当前请求域不合法' , code : 1031 });
            }

        }else{
            next() ;
        }




    }

    //注册
    registerControl(req,res){



        //查看邮箱是否已经被注册
        api.findData('User' , {
            email : req.body.email
        }).then(result => {

            if(result.length < 1 ){

                //创建用户id
                let userId = '_u'+ Math.random().toString().slice(-10) + new Date().getTime() ;

                //加密密码
                let password  = utils.encodeString(config.saltOption.passwordSalt + req.body.password  )

                //添加用户信息
                api.createData('User',{
                    userId  ,
                    username : req.body.username  ,
                    password  ,
                    email : req.body.email ,
                }).then(result => {
                    console.log('用户信息添加成功') ;
                    res.send({msg : '注册成功' , code : 1012 });
                }).catch(err => {
                    console.log('user err ==> ' , err ) ;
                    res.send({msg : '注册失败'  , code : 1013 }) ;
                });

            }else{
                res.send({msg : '该邮箱已经被注册，请更换！' , code : 1014 });
            }

        }).catch(err => {
            //查询失败
            console.log('err ==> ', err ) ;
            res.send({msg : '注册失败' , code :  1013 }) ;
        });



    }

    //登录
    loginControl(req , res ){

        //查找邮箱是否存在
        api.findData('User' , {
            email : req.body.email ,
            isDestroy : 0
        },['userId' , 'password']).then(result => {

            //用户不存再，反馈信息
            if(result.length < 1 ){
                res.send({msg : '用户不存在' , code : 1022 } ) ;
            }else{

                //加密密码
                let password = utils.encodeString(config.saltOption.passwordSalt + req.body.password ) ;

                //生成token
                let token = utils.signString(result[0].dataValues.userId , config.tokenOption.tokenSalt , config.tokenOption.expires );

                //将密码与数据库进行匹配
                if(password == result[0].dataValues.password ) {

                    res.send({msg : '登录成功'  , code : 1020 , token }) ;
                }else{
                    res.send({msg : '账号或密码不正确' , code : 1023})
                }
            }

        }).catch(err => {
            console.log('login err ==> ' , err) ;
            res.send({msg : '登录失败' , code : 1021 } ) ;
        })
    }

    //发送邮箱验证码
    sendEmailCode( req , res ){

        //创建验证码
        let code = Math.random().toString().slice(-6);


        api.createData('Code',{
            email : req.body.email ,
            code : code
        }).then(result => {
            //开发阶段需要，上线后可删除
            console.log('code ==>' , code ) ;
            console.log('cookie ==>' , req.body.cookie ) ;
            res.send({msg : '验证码已发送到你的邮箱' , code : 1010 })
            return ;

            //发送验证码
            utils.sendEmail(req.body.email   , code ,(err , data) => {
                if(err){
                    //发送失败
                    console.log('err ==> ', err) ;
                    res.send({msg : '验证码发送失败', code : 1011 } ) ;
                }else{
                    res.send({msg : '验证码以发送到你的邮箱' , code : 1010 })
                }
            })

        }).catch(err => {
            console.log('err ==> ' ,err ) ;
            res.send({
                msg : '验证码发送失败' ,
                code : 1011
            })
        }) ;


    }

    //初始化车辆品牌信息
    getTypeData(req , res){

        console.log('req.query.offset' , )

        //获取车辆品牌信息
        api.findDataByLimit('Type', {
            userId : req.userId
        }, null ,
            ['updatedAt' , 'DESC'],
            Number(req.query.offset) ,
            Number(req.query.limit) ).then( result => {

            //查询成功
            res.send({msg : '查询成功' , code : 1040 , result  });

        }).catch(err => {
            console.log('err => ' , err) ;
            res.send({msg : '查询失败 ' ,code : 1041 })
        })
    }

    //更改状态，禁用或启用
    changeState(req, res ){

        let isDisable = req.body.isDisable === 'true' ? 1 : 0 ;

        console.log(req.body.isDisable,isDisable)
        api.updateData('Type',{
            isDisable
        },{
            typeId : req.body.typeId ,
            userId : req.body.userId
        }).then(result => {
            console.log(result ) ;
            res.send({msg : '操作成功' ,code : 1050 ,result })
        }).catch(err => {
            res.send({msg : '操作失败' , code : 1051 });
            console.log('err =>> ' ,err ) ;
        })
    }

    //添加车辆品牌信息
    addType(req,res){
        console.log('req.userId ==> ' , req.userId ) ;
        console.log('req.body.brand ==> ' , req.body.brand ) ;
        api.findData('Type',{
            brand : req.body.brand ,
            userId : req.userId
        }).then(result => {
            // console.log('result ==> ' ,result );
            if(result.length > 0 ){
                res.send({msg : '该品牌已经存在' , code : 1062})
            }else{
                api.createData('Type',{
                    typeId : req.body.typeId ,
                    brand : req.body.brand ,
                    company : req.body.company ,
                    userId : req.userId
                }).then(result => {
                    console.log('result == > ' , result ) ;
                    res.send({msg : '信息添加成功' , code : 1060 , result });
                }).catch(err => {
                    console.log('err ==> ' ,err) ;
                    res.send({msg : '信息添加失败' , code : 1061});
                })
            }
        }).catch(err => {
            console.log('findData err ==> ' ,err ) ;
        })
    }

    //修改车辆品牌信息
    editType(req,res){

        api.findData('Type',{
            brand : req.body.brand ,
            userId : req.userId
        }).then(result => {
            if(result.length > 0 ){
                res.send({msg : '该品牌已经存在' , code : 1062})
            }else{

                api.updateData('Type' , {
                    brand : req.body.brand ,
                    company:  req.body.company
                },{
                    typeId : req.body.typeId
                }).then(result => {
                    res.send({msg : '修改信息成功' , code : 1063})
                }).catch(err => {
                    console.log('err ==> ' , err ) ;
                    res.send({msg : '修改信息失败' , code : 1064 })
                })
            }
        }).catch(err => {
            console.log('err ==> ' ,err ) ;
        })


    }

    //搜索功能
    searchKeyword(req,res){

        api.findDataByLimit('Type',{
            userId : req.userId ,
            brand : {
                [Op.like] : `%${req.query.keyword}%`
            }
        },null , ['updatedAt' , 'DESC'],
            Number(req.query.offset) ,Number(req.query.limit)).then(result => {
            res.send({msg : '搜索成功' , code : 1065 , result })
        }).catch(err => {
            console.log('err ==> ' ,err );
            res.send({msg : '搜索失败' , code : 1066 }) ;
        })
    }

    //获取车辆品牌类型数据量
    searchRows(req, res ) {
        api.count('Type',{
            userId : req.userId ,
            brand : {
                [Op.like] : `%${req.query.keyword}%`
            }
        }).then(result => {
            res.send({msg : '获取搜索数据量成功' , code : 1072 , result })
        }).catch(err => {
            console.log('err ==> ' ,err );
            res.send({msg : '获取搜索数据量失败' , code : 1073 }) ;
        })
    }

    //获取数据表的记录数
    typeRows(req,res){
        api.count('Type',{
            userId : req.userId
        }).then(result => {
            res.send({msg : '获取车辆品牌数量成功' , code : 1070 , result })
        }).catch(err => {
            console.log('err ==> ' ,err ) ;
            res.send({msg : '获取车辆品牌数量失败' , code : 1071});
        })
    }

    //获取用户信息
    getUserInfo(req , res){
        api.findData('User' , {
            userId : req.userId ,
        }).then(result => {
            res.send({msg : '查询用户信息成功' , code : 1042 ,result })
        }).catch(err => {
            console.log('err ==> ' ,err );
            res.send({msg : '查询用户信息失败' , code : 1043  })
        })
    }

    //图片上传
    uploadImg(req ,res ){
        res.send({msg : '图片上传成功' , code : 1067})
    }

    //获取车辆品牌
    proBrand(req ,res ){
        api.findData('Type', {
            userId: req.userId,
            isDisable : 0
        },['typeId','brand']).then(result => {
            res.send({msg : '获取车辆品牌成功' , code : 1044 ,result })
        }).catch(err => {
            console.log('err ==> ' ,err );
            res.send({msg : '获取车辆品牌失败' , code : 1045});
        })
    }

    //添加车辆详细信息
    postProduct(req,res){

        //上传完毕图片，再写数据进入数据库中
        let base64 = req.body.carPic.replace(/ /g , '+');

        //将base64转换成buffer，类似二进制文件
        let buffer = new Buffer(base64 , 'base64');

        //生成文件名
        let filename = Math.random().toString().slice(2) + '.' + req.body.carPicType;

        //使用文件系统将图片base64写入服务器
        fs.writeFile(__baseurl + '/upload/' + filename, buffer ,err => {
            if(err){
                //如果上传失败
                res.send({msg :'添加车辆信息失败' , code : 1081 })
            }else{
                //上传图片成功
                req.body['carPic'] = filename ;
                delete req.body['carPicType'] ;

                //将数据写入数据库
                req.body.cid = '_car' + new Date().getTime() + Math.random().toString().slice(-6) ;

                console.log('cid ==> ' , req.body.cid);

                //关联用户
                req.body.userId = req.userId  ;

                console.log('req.body == >' ,req.body)

                api.createData('Car' , req.body).then(result => {
                    res.send({msg : '添加车辆信息成功' , code : 1080 })
                }).catch(err => {
                    console.log('err ==> ' ,err) ;
                    res.send({msg : '添加车辆信息失败' , code : 1081 })
                })
            }



        })


    }

    //获取车辆详细信息列表
    productList(req, res){
        console.log(req.query);

        //查询条件
        let condition = {
            userId : req.userId ,
            offset : Number(req.query.offset) ,
            limit : Number(req.query.limit)
        }

        //sql語句
        let sql = "SELECT `c`.`user_id`, `c`.`cid`, `c`.`created_at`, `c`.`updated_at`, `c`.`color`, `c`.`model`, `c`.`is_dismount`, `t`.`brand` FROM `car` AS `c` INNER JOIN `type` AS `t` ON `c`.`brand` = `t`.`type_id` AND `c`.`user_id` = :userId";


        if(req.query.model ){
            condition.model = '%' + req.query.model + '%' ;
            sql += " AND `c`.`model` LIKE :model";
        }

        if(req.query.createdAt){
            condition.createdAt ='%'+ req.query.createdAt +'%';
            sql += " AND `c`.`created_at` LIKE :createdAt" ;
        }

        if(req.query.brand){
            condition.brand = req.query.brand ;
            sql += " AND `c`.`brand` = :brand" ;
        }

        if(req.query.color){
            condition.color =req.query.color ;
            sql += " AND `c`.`color` = :color" ;
        }

        //按更新时间排序，分页查询
        sql += " ORDER BY `c`.`updated_at` DESC LIMIT :offset , :limit" ;

        console.log('sql ==> ' ,sql );


        api.query(sql , condition ).then(result => {
            res.send({msg :'查询车辆详细信息数据失败' ,code: 1072 , result  })
        }).catch(err => {
            console.log('err => ' ,err );
            res.send({msg : '查询车辆详细信息数据失败' , code: 1073 });
        })

    }

    //获取车辆详细信息数据量
    productListRows(req , res){

        let condition = {
            userId : req.userId ,
        }

        if(req.query.model ){
            condition.model = {
                [Op.like] : '%' + req.query.model + '%'
            } ;
        }

        if(req.query.createdAt){
            console.log(req.query.createdAt)
            condition.createdAt = {
                [Op.substring] :  req.query.createdAt
            } ;
        }

        if(req.query.brand){
            condition.brand = req.query.brand ;
        }

        if(req.query.color){
            condition.color =req.query.color ;
        }

        api.count('Car' , condition ).then(result =>{
            res.send({msg : '获取车辆详细信息数据量成功', code :1074 ,result  })
        }).catch(err => {
            console.log('err =>' ,err );
            res.send({msg : '获取车辆详细信息数据量失败' , code :1075});
        })
    }

    //上下架
    upDown(req , res ){
        console.log(Number(req.body.isDismount))
        api.updateData('Car' , {
            isDismount : Number(req.body.isDismount)
        },{
            cid : req.body.cid
        }).then( result => {
            res.send({msg : '修改车辆信息状态成功' , code : 1082 ,result })
        }).catch( err => {
            console.log('err ==>' , err  ) ;
            res.send({msg : '修改车辆信息状态失败' , code : 1083})
        })
    }

    //删除车辆信息
    removeProduct(req, res){
        console.log('cid ==>' ,req.body.cid)
        api.destroyData('Car' , {
            cid : req.body.cid
        }).then(result => {
            res.send({msg : '删除车辆详细信息成功' , code : 1084 ,result });
        }).catch(err => {
            console.log('err ==> ' ,err) ;
            res.send({msg : '删除车辆详细信息失败' , code : 1085});
        })
    }

    //根据车辆id获取车辆详细信息
    productByCid(req , res ){
        api.findData('Car' , {
            cid : req.query.cid
        },['cid' ,'brand' , 'model' ,'price' , 'num' , 'carPic' , 'color' , 'isDismount' , 'desc']).then( result => {
            res.send({msg : '查询车辆详细信息成功' , code : 1072 ,result })
        }).catch(err => {
            console.log('err => ' ,err) ;
            res.send({msg : '查询车辆详细信息成功' , code: 1073});
        })
    }

    //编辑车辆详细信息
    editProduct(req ,res ){

        let cid = req.body.cid ;
        delete  req.body.cid ;

        //获取图片数据
        if(req.body.carPic){
            //上传完毕图片，再写数据进入数据库中
            let base64 = req.body.carPic.replace(/ /g , '+');

            //将base64转换成buffer，类似二进制文件
            let buffer = new Buffer(base64 , 'base64');

            //生成文件名
            let filename = Math.random().toString().slice(2) + '.' + req.body.carPicType;

            //使用文件系统将图片base64写入服务器
            fs.writeFile(__baseurl + '/upload/' + filename, buffer ,err => {
                if (err) {
                    //如果上传失败
                    res.send({msg: '添加车辆信息失败', code: 1081})
                } else {
                    //上传图片成功
                    req.body['carPic'] = filename;
                    delete req.body['carPicType'];

                    api.updateData('Car', req.body , {
                        cid
                    }).then(result => {
                        res.send({msg: '修改车辆信息成功', code: 1086})
                    }).catch(err => {
                        console.log('err ==> ', err);
                        res.send({msg: '修改车辆信息失败', code: 1087})
                    })
                }
            });

        }else{
            api.updateData('Car', req.body , {
                cid
            }).then(result => {
                res.send({msg: '修改车辆信息成功', code: 1086})
            }).catch(err => {
                console.log('err ==> ', err);
                res.send({msg: '修改车辆信息失败', code: 1087})
            })
        }
    }
}

module.exports  = new RouterController() ;