'use strict';

/**
 * Created by gong on 14-3-31.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * RoleMenu Schema
 */

var MenuSchema = new Schema({
    menu: {type: String, ref: 'Menu'}
});
//maybe need a group model
var GroupSchema = new Schema({
    group:String,
    menus:[MenuSchema]
});
var RoleMenuSchema = new Schema({
    role:{type: String,ref:'role'},
    groups: [GroupSchema]
});
RoleMenuSchema.index({role:1})
mongoose.model('RoleMenu', RoleMenuSchema);