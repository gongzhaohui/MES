'use strict';
/**todo
 * 信用额度管理方式
 * 更新履历
 * */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var SupplierSchema = new Schema(
    {
        _id: String,
        name: {
            type: String,
            required: true,
            trim: true
        },
        tel: {
            type: String,
            match: [/^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/, '电话号码格式不正确。']
        },
        address: {
            street: String,
            city: String,
            province: String,
            zip: {
                type: String,
                match: [/^[1-9][0-9]{5}$/, '邮编格式不正确。'],
                trim: true
            }
        },
        contact: {
            name: {
                type: String,
                required: true,
                trim: true
            },
            gender: {
                type: String,
                enum: ['男', '女']
            },
            age: Number,
            mobile: {
                type: String,
                match: [/^(1[35][0-9]{9})$/, '手机号格式不准确。']
            },
            email: String,
            photo: String,
            hobbies: [String]
        },
        rating: {type: String, ref: 'creditrating'},
        buyer: {type: String, ref: 'Employee'},
        created: {
            date: {type: Date, default: Date.now},
            eId: {type: String, ref: 'Employee'}
        },
        updated: [
            {
                date: {type: Date, default: Date.now},
                eId: {type: String, ref: 'Employee'}
            }
        ]
    });


/**
 * Statics
 */
SupplierSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate('salesman', '_id username').exec(cb);
};

mongoose.model('Supplier', SupplierSchema);
