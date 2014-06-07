'use strict';

/**
 * Created by gong on 14-3-31.
 * 把往来作为一个属性的角度看，可以将so与po放在一个表中，从别人买东西与别人从自己买东西的区别只是主体不同。订单的存储在一起，通过各自的controller分别处理
 * 好处是抹除customer与supplier的区别（partner）。概念上似乎单纯，所有订单的模型一致，供应商和客户平等。
 * 不好的地方：因果关系，po有时源于so，会不会增加复杂度？其他未知的复杂度？
 * mo虽然名为order，与so和po概念不同，单独处理
 * todo
 * ｛更新履历函数
 * 更新价格历史｝ to be move to controller
 * 订单类型
 *
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var OrderItemSchema = new Schema({
    row: {type: Number, index: true, unique: true},
    iId: {type: String, ref: 'Inventory', index: true},
    qty: {
        ordered: {type:Number,min:1},
        delivered: {type: Number, default: 0}
    },
    category: {type: String, ref: 'Category', index: true},
    way: {type: String, ref: 'Way', index: true},
    price: {
        nontax: Number,
        dutiable: Number,
        taxRate: Number
    },
    deuDate: Date,
    status:{type:String,ref:'Status'}
}, {autoId: false});
var OrderSchema = new Schema({
    _id: String,
    eId: {type: String, ref: 'Employee', index: true},
    cId: {type: String, ref: 'Customer', index: true},
    //Order,po
    orderType:String,
    //Order:test,regular,claim;//po;regular,outsourcing
    voucherType:String,
    deuDate: {type: Date, index: true},
    //taxed
    amount:Number,
    items: [OrderItemSchema],
    status: {type: String, ref: 'Status', index: true},
    created: {
        date: {type: Date, default: Date.now, index: true},
        eId: {type: String, ref: 'Employee', index: true}
    },
    updated: [
        {
            date: {type: Date, default: Date.now},
            eId: {type: String, ref: 'Employee'}
        }
    ]
});
OrderSchema.index({_id: 1, 'items.row': 1});
OrderSchema.index({orderType: 1});
OrderSchema.index({ voucherType:1});
OrderSchema.index({orderType: 1, voucherType:1});
/*
populate employee,inventory,customer*/
OrderSchema.statics = {
    load : function(id, cb) {
        this.findOne({
            _id: id
        })
            .populate('eId', 'name username')
            .populate('items.iId','toolNo drawingNo')
            .populate('cId','name _id')
            .exec(cb);
    }
};
OrderSchema.methods = {};
mongoose.model('Order', OrderSchema);
