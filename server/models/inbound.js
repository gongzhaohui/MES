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
var InboundItemSchema = new Schema({
    row: {type: Number, index: true},
    source: SourceSchema,
    iId: {type: String, ref: 'Inventory', index: true},
    qty: Number
});
var InboundSchema = new Schema({
    _id: String,
    wId: {type: String, ref: 'Warehouse', index: true},
    items: [InboundItemSchema],
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
InboundSchema.index({'source': 1});
InboundSchema.index({'items._id': 1, 'items.row': 1});
InboundSchema.statics = {};
InboundSchema.methods = {};
mongoose.model('Inbound', InboundSchema);