'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var TaskSchema = new Schema({
    _id:number,
    task:{type:String,ref:'Task'},
    start:Date,
    //duration=setup+qty*jobtime+carrying
    duration:Number
});
var StationPoolSchema = new Schema({
    _id:Number,
    station:{type:String,ref:'Station'},
    shift:{type:String,ref:'Shift'},
    free:Number,
    tasks:[]
});
var DailySchema = new Schema({
    _id:Number,
    date:Date,
    pool:[]
});
var ScheduleSchema = new Schema({
    _id: String,
    date: Date,
    creator:{type:String,ref:'Employee'},
    period:{start:Date,end:Date},
    days:[]
});
ScheduleSchema.statics = {};
ScheduleSchema.methods = {};
mongoose.model('Schedule', ScheduleSchema);
