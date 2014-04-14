'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ReceiptSchema = new Schema({
    id: String,
    date: Date,
    operator: {type: String, ref: 'Employee'},
    cId: {type: String, ref: 'Customer'},
    iId: {type: String, ref: 'Invoice'},
    iAmount: Number,
    rAmount: Number,
    VoucherStatus: {type: String, ref: 'VoucherStatus'},
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
ReceiptSchema.statics = {};
ReceiptSchema.methods = {};
mongoose.model('Receipt', ReceiptSchema);