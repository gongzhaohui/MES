'use strict';

/**
 * Created by gong on 14-4-1.
 * v-voucher,accomplish,pause,cancel,drew,putin,...
 * j-job,scheduled,accomplish,pause,cancel,...
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StatusSchema = new Schema({
    _id: String,
    Status: String
});
StatusSchema.statics = {};
StatusSchema.methods = {};
mongoose.model('Status', StatusSchema);