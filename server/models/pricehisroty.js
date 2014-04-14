'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TempSchema = new Schema({
    date: Date,
    iId: {type: String, ref: 'Inventory'},
    price: {
        origin: Number,
        new: Number
    }
});
TempSchema.statics = {};
TempSchema.methods = {};
mongoose.model('Temp', TempSchema);