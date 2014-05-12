'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ShiftSchema = new Schema({
    _id: String,
    shift: String,
    start:Number,
    end:Number
});
ShiftSchema.statics = {};
ShiftSchema.methods = {};
mongoose.model('Shift', ShiftSchema);
