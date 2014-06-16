'use strict';

/**
 * Created by gong on 14-3-31.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Role Schema
 */
var MenuSchema = new Schema({
    menu: {type: String, ref: 'Menu'}
});
var RoleSchema = new Schema({
    _id: String,
    menus: [MenuSchema]
});

mongoose.model('Role', RoleSchema);