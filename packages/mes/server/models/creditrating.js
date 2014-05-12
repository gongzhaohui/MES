'use strict';

/**
 * Created by gong on 14-4-1.
 * 更新履历
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CreditRatingSchema = new Schema({
    //code
    _id: String,
    //months
    period: Number,
    amount: Number

});
CreditRatingSchema.statics = {};
CreditRatingSchema.methods = {};
mongoose.model('CreditRating', CreditRatingSchema);
