'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var SourceSchema = new Schema({
    _id: {type: String, index: true},
    row: {type: Number},
    ref: {type: String}
});
var OutboundItemSchema = new Schema({
    row: {type: Number, index: true},
    source: SourceSchema,
    iId: {type: String, ref: 'Inventory', index: true},
    qty: Number
});
var OutboundSchema = new Schema({
    _id: String,
    wId: {type: String, ref: 'Warehouse', index: true},
    cId: {type: String, ref: 'Customer', index: true},
    items: [OutboundItemSchema],
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
OutboundSchema.index({'items.source': 1});
OutboundSchema.index({'items._id': 1, 'items.row': 1});
OutboundSchema.statics = {};
OutboundSchema.methods = {};
mongoose.model('Outbound', OutboundSchema);