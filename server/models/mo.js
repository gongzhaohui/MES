'use strict';

/**
 * Created by gong on 14-4-1.
 * 更新履历
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SourceSchema = new Schema({
    _id: {type: String, index: true},
    row: {type: Number},
    ref: {type: String}
});
var OperationSchema = new Schema({
    row: {type: Number, index: true},
    station: {type: String, index: true},
    job: String,
    tasktime: Number,
    comment: String,
    startDate: Date,
    dueDate: Date,
    receive: {
        date: Date,
        qty: Number,
        returnQty: Number,
        returnTo:  {type:String,ref:'Station'},
        operator: String
    },
    finish: {
        date: Date,
        operator: String,
        workhour: Number,
        qty: Number
    },
    fault: {
        date: Date,
        operator: String,
        qty: Number,
        reason: String,
        method: {type: String, ref: 'RepairMethod'}
    }
}, {autoId: false});
var MOItemSchema = new Schema({
    row: {type: Number, index: true},
    source: SourceSchema,
    iId: {type: String, ref: 'Inventory', index: true},
    qty: Number,
    dueDate: Date,
    way: {type: String, ref: 'Way'},
    status: {type: String, ref: 'Status', index: true},
    operations: [OperationSchema],
    check: {
        date: Date,
        operator: String,
        qty: Number
    },
    fault: {
        date: Date,
        operator: String,
        qty: Number,
        reason: String,
        method: {type: String, ref: 'RepairMethod'}
    }
});
var MOSchema = new Schema({
    _id: String,
    eId: {type: String, ref: 'Employee'},
    moDate: {type: Date, index: true},
    deuDate: {type: Date, index: true},
    Status: {type: String, ref: 'Status', index: true},
    items: [MOItemSchema],
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
MOSchema.index({'items.source': 1});
MOSchema.index({'_id': 1, 'items.row': 1});
MOSchema.index({'_id': 1, 'items.row': 1, 'items.operation.row': 1, 'items.operation.station': 1});
MOSchema.statics = {};
MOSchema.methods = {};
mongoose.model('MO', MOSchema);