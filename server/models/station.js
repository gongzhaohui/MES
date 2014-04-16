'use strict';

/**
 * Created by gong on 14-4-1.
 * a station is treat as a work center
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ShiftSchema = new Schema({
    shift:{type:String,ref:'Shift'},
    //finite or infinite capacity
    finite:{type:Boolean,default:true},
    //k is a coefficient of capacity
    k:Number,
    //default ability=shift.duration*k(k<=1) when finite.Otherwise will be a large number on behalf of infinite.
    ability:Number
});
var StationSchema = new Schema({
    _id: String,
    station: String,
    officer:{type:String,ref:'Employee'},
    depart:{type:String,ref:'Department'},
    shifts:[ShiftSchema]
});
StationSchema.statics = {};
StationSchema.methods = {};
mongoose.model('Station', StationSchema);