'use strict';

/**
 * Created by gong on 14-4-1.
 * 更新履历
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoleSchema = new Schema({
    role: {type: String, ref: 'Role'}
});
var DepartSchema = new Schema({
    //code
    _id: String,
    name:String,
    officer:{type:String,ref:'Employee'},
    //path:department level.Like:sales/sales 1/sales 1.1
    path: String,
    description: String,
    roles:[RoleSchema],
    created: {
        date: {type: Date, default: Date.now},
        eId: {type: String, ref: 'Employee'}
    },
    updated: [
        {
            date: {type: Date, default: Date.now},
            eId: {type: String, ref: 'Employee'}
        }
    ]
});

DepartSchema.index({_id: 1});
DepartSchema.statics = {
    load: function (id, cb) {
        this.findOne({
            _id: id
        })
            .populate('created.eid','username _id')
            .exec(cb);
    }
};
DepartSchema.methods = {};
mongoose.model('Depart', DepartSchema);