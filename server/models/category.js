'use strict';

/**
 * Created by gong on 14-4-1.
 * 更新履历
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
    _id: String,
    path: String,
    description: String,
    defaultWh: {type: String, ref: 'Warehouse', index: true},
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
CategorySchema.statics = {};
CategorySchema.methods = {};
mongoose.model('Category', CategorySchema);