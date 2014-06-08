'use strict';

/**
 * Created by gong on 14-3-31.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Role Schema
 */

var RoleSchema = new Schema({
    _id: String,
    description:String
});

mongoose.model('Role', RoleSchema);