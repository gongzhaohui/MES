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
var POItemSchema = new Schema({
    row: {type: Number, index: true},
    source: SourceSchema,
    iId: {type: String, ref: 'Inventory', index: true},
    sId: {type: String, ref: 'Supplier', index: true},
    qty: Number,
    dueDate: Date,
    way: {type: String, ref: 'Way'},
    status: {type: String, ref: 'Status', index: true},
    wId: {type: String, ref: 'Warehouse', index: true},
    receive: {
        date: Date,
        qty: Number,
        operator: String
    }

});
var POSchema = new Schema({
    _id: String,
    eId: {type: String, ref: 'Employee'},
    PODate: {type: Date, index: true},
    deuDate: {type: Date, index: true},
    Status: {type: String, ref: 'Status', index: true},
    items: [POItemSchema],
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
POSchema.index({'items.source': 1});
POSchema.index({'_id': 1, 'items.row': 1});
POSchema.statics = {};
POSchema.methods = {};
mongoose.model('PO', POSchema);