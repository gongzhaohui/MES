'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OperationSchema = new Schema({
    row: Number,
    station: String,
    job: String,
    tasktime: Number,
    mustBefore:Number,
    mustAfter:Number,
    comment: String
});
var ProcessSchema = new Schema({
    iId: {type: String, ref: 'Inventory'},
    date: Date,
    Operations: [OperationSchema ],
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
ProcessSchema.statics = {};
ProcessSchema.methods = {};
mongoose.model('Process', ProcessSchema);