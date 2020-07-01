//车辆详细信息表(数据表结构)
const Sequelize = require('sequelize');

let Model = Sequelize.Model;

//Car模型继承Model
class Car extends Model {

}

//创建car数据表结构
Car.init({
    //id字段
    id: {
        //数据类型, INTEGER: 整型, UNSIGNED: 无符号
        type: Sequelize.INTEGER.UNSIGNED,

        //是否允许为null
        allowNull: false,

        //主键
        primaryKey: true,

        //自动递增
        autoIncrement: true,

        //备注
        comment: '表id'
    },

    //用户id
    userId : {
        type : Sequelize.STRING(30),
        allowNull : false ,
        defaultValue : '' ,
        comment : '用户id'
    },

    //车辆id
    cid : {
        type : Sequelize.STRING(30),
        allowNull : false ,
        defaultValue : '' ,
        comment : '车辆id'
    },

    //品牌ID
    brand: {
        type: Sequelize.STRING(30),
        allowNull: false,
        //默认值
        defaultValue: '',
        comment: '品牌ID'
    },

    //汽车型号
    model: {
        type: Sequelize.STRING(30),
        allowNull: false,
        //默认值
        defaultValue: '',
        comment: '汽车型号'
    },

    //车身颜色
    color: {
        type: Sequelize.STRING(10),
        allowNull: false,
        //默认值
        defaultValue: '',
        comment: '车身颜色'
    },

    //车辆库存
    num: {
        type: Sequelize.INTEGER,
        allowNull: false,
        //默认值
        defaultValue: 0,
        comment: '车辆库存'
    },

    //汽车价格
    price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        //默认值
        defaultValue: 0,
        comment: '汽车价格'
    },

    //车辆图片
    carPic: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '车辆图片 '
    },

    //备注信息
    desc : {
        type :Sequelize.STRING,
        allowNull : false ,
        defaultValue: '',
        comment : '备注信息'
    } ,

    //是否已经下架
    isDismount: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '已下架: 1, 未下架：0'
    }

}, {
    //配置
    // 默认为类的名称，即在这种情况下为`Car`。 这将控制自动生成的`foreignKey`（外键）的名称和关联命名
    modelName: 'car',

    //是否添加时间戳属性 (updatedAt, createdAt)
    timestamps: true,

    //是否开启假删除
    //不实际删除数据库记录，而是设置一个新 deletedAt 属性，其值为当前日期
    paranoid: false ,

    //自动设置字段为蛇型（以_方式命名）命名规则
    underscored: true,

    //是否禁止修改表名
    //默认情况下，sequelize 会自动将所有传递的模型名称转换为复数形式。
    freezeTableName: true,

    //定义表名
    tableName: 'car',

    //连接实例
    sequelize

})

//force: true, 如果存在该表，则先删除该表，再创建新表，否则直接创建新表
//force: false, 如果存在该表，则不创建新表，否则创建新表
Car.sync({force: false });

//导出模型
module.exports = Car;