'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/*
 *  @deprecated
 *  move into Inventory Schema 2014.4.11
 */
var BomSchema = new Schema({
    _id: String,
    date: Date,
    iId: {type: String, ref: 'Inventory'},
    name: {type: String, required: true},
    toolNo: {type: String, required: true},
    drawingNo: {type: String, required: true},
    children: [
        {
            seq: Number,
            iId: {type: String, ref: 'Inventory'},
            way: {type: String, ref: 'Way'},
            quantity: Number
        }
    ]

});
BomSchema.statics = {};
BomSchema.methods = {};

mongoose.model('Bom', BomSchema);