'use strict';

/**
 * Created by gong on 14-4-1.
 * 更新履历
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DepartSchema = new Schema({
    _id: String,
    path: String,
    description: String,
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
DepartSchema.statics = {};
DepartSchema.methods = {};
mongoose.model('Depart', DepartSchema);