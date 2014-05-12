'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MenuSchema = new Schema({
    _id: String,
    func: String,
    title:String,
    link: String
});
MenuSchema.statics = {};
MenuSchema.methods = {};
mongoose.model('Menu', MenuSchema);