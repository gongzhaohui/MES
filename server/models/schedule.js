'use strict';

/**
 * Created by gong on 14-4-1.
 * todo
 * check if task is duplicated when pushing tasks
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
var ShiftSchema = new Schema({
    _id:String,
    ref:String,
    //finite or infinite capacity
    finite:{type:Boolean,default:true},
    //k is a coefficient of capacity
    k:Number,
    //default ability=shift.duration*k(k<=1) when finite.Otherwise will be a large number on behalf of infinite.
    ability:Number,
    tasks:[TaskSchema]
});
var StationSchema = new Schema({
    _id: String,
    station: String,
    officer:{type:String,ref:'Employee'},
    depart:{type:String,ref:'Department'},
    shifts:[ShiftSchema]
});
var DailySchema = new Schema({
    _id:Number,
    date:Date,
    pool:[StationSchema]
});
var ScheduleSchema = new Schema({
    _id: String,
    date: Date,
    creator:{type:String,ref:'Employee'},
    period:{start:Date,end:Date},
    days:[DailySchema]
});
ScheduleSchema.statics = {};
ScheduleSchema.methods = {};
mongoose.model('Schedule', ScheduleSchema);
