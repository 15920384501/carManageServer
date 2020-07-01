//服务层

class API {

    //添加数据
    createData(name ,obj ){

        //name 模型名称
        //obj  需要添加的数据

       return  model[name].create(obj) ;
    }

    //查询数据
    findData(name , condition , attrs ){

        //name  查询的模型名称
        //condition  查询条件  object
        //attrs    想要查询的字段 array
        //orderBy   排序 array ==> [排序的字段 , 降序：DESC 或 升序：ASC]

        return model[name].findAll({
            where : condition ,
            attributes : attrs ,
        })
    }

    //查询所有数据
    findDataByLimit(name , condition , attrs , orderBy , offset , limit ){

        //name  查询的模型名称
        //condition  查询条件  object
        //attrs    想要查询的字段 array
        //orderBy   排序 array ==> [排序的字段 , 降序：DESC 或 升序：ASC]
        //offset   便宜数据量  number
        //limit    查询数据量  number

        return model[name].findAll({
            where : condition ,
            attributes : attrs ,
            order : [orderBy] ,
            offset ,
            limit
        })
    }


    //更新数据
    updateData(name , value , condition ){
        //value  想要更新的值
        //condition 更新的条件
        return model[name].update(value,{
            where : condition ,
        }) ;
    }

    //删除数据
    destroyData(modelName , condition ){
        //condition 删除的条件
        return model[modelName].destroy({
            where: condition
        })
    }

    //查询数据表的记录数
    count(modelName , condition ){
        return model[modelName].count({
            where : condition
        });
    }

    //原始查询
    query(sql , replacements){
        //sql : 原始sql语句
        //replacements : sql语句预处理字段
        return sequelize.query(sql , {
            replacements ,
            type : sequelize.QueryTypes.SELECT
        });
    }

}

//导出
module.exports = new API() ;