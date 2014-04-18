'use strict';

/**
 * Created by gong on 14-4-1.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CounterSchema = new Schema({
    _id: String,
    seq: Number
});
CounterSchema.statics = {
    getNextSequence: function (code, inc, callback) {
        var i = inc ? inc : 1;
        this.findOneAndUpdate({ _id: code }, { $inc: { seq: i } }, {new: true, upsert: true}, callback);
    },
    getNewId: function (code, inc) {
        var i = inc ? inc : 1;
        this.findOneAndUpdate({ _id: code }, { $inc: { seq: i } }, {new: true, upsert: true}, function(err, result){
            if (!err) {
                var seqStr = '000000000' + result.seq;
                return code+seqStr.slice(seqStr.length - 9)
            }
            return err
        });
    }
};
mongoose.model('Counter', CounterSchema);