'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var SourceSchema = new Schema({
    _id: {type: String, index: true},
    moRow: {type: Number},
    opRow: {type: Number},
    ref: {type: String, default: 'MO'}
});
/*
var jobSchema = new Schema({
    date: Date,
    operator: String,
    jobtime: Number,
    qty: Number
});
*/
var TaskSchema = new Schema({
    _id: String,
    source: SourceSchema,
    station: {type: String, ref: 'station'},
    task: String,
    status:String,
    order: {
        start:Date,
        durDate:Date,
        qty: Number,
        jobtime: Number
    },
    assign: {
        start: Date,
        qty:Number
    },
    receive: {
        date: Date,
        qty: Number,
        returnQty: Number,
        returnTo: {type:String,ref:'Station'},
        operator: String
    },
    finish: {
        date: Date,
        operator: String,
        jobtime: Number,
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
TaskSchema.index(source);
TaskSchema.statics = {};
TaskSchema.methods = {};
mongoose.model('Task', TaskSchema);
