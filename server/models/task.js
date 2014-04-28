'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/*
var SourceSchema = new Schema({
    moId: {type: String},
    moRow: {type: Number},
    opRow: {type: Number},
    ref: {type: String, default: 'MO'}
},{autoId:false});

var jobSchema = new Schema({
    date: Date,
    operator: String,
    jobtime: Number,
    qty: Number
});
*/
var TaskSchema = new Schema({
    source: String, //source=moId.moRow.opRow
    station: {type: String, ref: 'station'},
    job: String,
    mustBefore:Number,
    mustAfter:Number,
    comment: String,
    status:{type:String,ref:'Status'},
    order: {
        start:Date,
        durDate:Date,
        qty: Number,
        setuptime:Number,
        tasktime: Number,
        carrytime:Number,
        comment: String
    },
    schedule: {
        //schedul.date.station.shift._id
        poolpath:String,
        start: Date,
        end:Date
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
TaskSchema.index(TaskSchema.source);
TaskSchema.statics = {};
TaskSchema.methods = {};
mongoose.model('Task', TaskSchema);
