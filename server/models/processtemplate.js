'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProcessTemplateSchema = new Schema({
    name: {type: String, unique: true,index:true},
    Operations: [
        {
            row: Number,
            mustBefore:Number,
            mustAfter:Number,
            station: String,
            job: String,
            setuptime:Number,
            tasktime: Number,
            carrytime:Number,
            comment: String
        }
    ],
    created: {
        date: {type: Date, default: Date.now},
        eId: {type: String, ref: 'Employee'}
    },
    updated: [
        {
            date: {type: Date, default: Date.now},
            eId: {type: String, ref: 'Employee'}
        }
    ]});
ProcessTemplateSchema.statics = {};
ProcessTemplateSchema.methods = {};
mongoose.model('ProcessTemplate', ProcessTemplateSchema);