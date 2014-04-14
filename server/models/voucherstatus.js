'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VoucherStatusSchema = new Schema({
    _id: String,
    VoucherStatus: String
});
VoucherStatusSchema.statics = {};
VoucherStatusSchema.methods = {};
mongoose.model('VoucherStatus', VoucherStatusSchema);