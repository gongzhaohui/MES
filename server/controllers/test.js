'use strict';
/**
 * exports
 *
 */
exports.testRecursive = function (req, res) {

    var assert = require('assert');
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = mongoose.Types.ObjectId;

    console.log('\n===========');
    console.log('    mongoose version: %s', mongoose.version);
    console.log('========\n\n');

    var dbname = 'testing_populateAdInfinitum';
    console.log('dbname: %s', dbname);
    var db = mongoose.connection;
    var db2 = db.useDb(dbname);
    console.log('dbname: %s', db2.name);

    /*  mongoose.connect('localhost', dbname);
     mongoose.connection.on('error', function () {
     console.error('connection error', arguments);
     });
     */
    var user = new Schema({
        name: String, children: [
            { seq:Number,child:{type: Schema.ObjectId, ref: 'User'} ,qty:Number}
        ]
    });
    var User = db2.model('User', user);
    var userIds = [new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId];
    var users = [];

    users.push({
        _id: userIds[0], name: 'p0', children: [{seq:1,child:userIds[1],qty:2}, {seq:2,child:userIds[2],qty:2}, {seq:3,child:userIds[3],qty:3}]
    });
    users.push({
        _id: userIds[1], name: 'child1', children: [{seq:1,child:userIds[4],qty:2}]
    });
    users.push({
        _id: userIds[2], name: 'child2', children: [{seq:1,child:userIds[5],qty:2}, {seq:2,child:userIds[6],qty:2}, {seq:3,child:userIds[7],qty:1}]
    });
    users.push({
        _id: userIds[3], name: 'child3'
    });
    users.push({
        _id: userIds[4], name: 'child4'
    });

    users.push({
        _id: userIds[5], name: 'child5', children:[{seq:1,child:userIds[11],qty:2}]
    });
    users.push({
        _id: userIds[6], name: 'child6'
    });
    users.push({
        _id: userIds[7], name: 'child7'
    });
    users.push({
        _id: userIds[8], name: 'child8'
    });
    users.push({
        _id: userIds[9], name: 'child9'
    });
    users.push({
        _id: userIds[10], name: 'child10'
    });
    users.push({
        _id: userIds[11], name: 'child11'
    });


    User.create(users, function (err, docs) {
        assert.ifError(err);
        var BOM=[];
        var root='p0';
// keep track of recursion count
        var count = 0;
// to be called when recursion is completed
        function out(obj) {
            BOM.push(obj);
        }
        function last() {
            res.jsonp(BOM);
  //          console.log(User);

            User.remove( function(err) {
                console.log('collection removed')
            });
        }
// call 'last' when count is 0
        var done = function() {
            if (count==0) last();
        };
// the recursive function
        function recurse(parent,lvl,qty,seq) {
            count++;
 //           out({lvl:lvl,user:parent});
            //console.log(parent);
            User.findOne({ name: parent}).lean().populate({path:'children.child',select:'name'}).exec(function(err,user) {
                console.log('finded',user);
                if (user) {
                    seq=lvl==0?'1':seq;
                    out({lvl: lvl, user: user.name,seq:seq ,qty:qty});
//                    console.log(user, user.children.length);
                   lvl++;
                    if (user.children.length > 0) {
                        for (var i = 0; i < user.children.length; i++) {

                            recurse(user.children[i].child.name, lvl,qty*user.children[i].qty,seq+'.'+user.children[i].seq);
                        }
                    }
                    lvl--;
                }
                count--;
                console.log('lvl',lvl);
                done();
            });
            // simiulate an asyncrhonous call to get children
           // setTimeout(walk, wait);
        }
// kick off the recursion
        function run() {
            console.log('entering run');
            recurse(root,0,2,1);
            console.log('leaving run');
        }
// and begin
        run();
 /*       var getChildren=function(parent,lvl){
             var promise=User.find({ name: parent }).lean().exec();
            promise.then(function(inv){
                BOM.push({lvl:lvl,parent:inv.name});
                if (inv.children.exists){
                    lvl++;
                    children.each(function(child){
                        getChildren(child.name,lvl)
                    })
                }
            })
        };
        getChildren('po',0).then(res.jsonp(BOM));


        /*  User.find({ name: 'p0' }).lean().exec(function (err, docs) {
              assert.ifError(err);

              var opts = {
                  path: 'author.friends', select: 'name', options: { limit: 3 }
              };

              User.populate(docs, opts, function (err, docs1) {
                  assert.ifError(err);
                  console.log();
                  console.log(docs);
                  res.jsonp(docs1);
                  done();
              })
          })

         /* tree visualization
         root
         a
         b
         c
         d
         e
         f
         g
         */
/*
// tree data
        var c = { id:3, len:2, children: []};
        var d = { id:4, len:4, children: []};
        var g = { id:7, len:1, children: []};
        var f = { id:6, len:3, children: []};
        var e = { id:5, len:2, children: [f]};
        var b = { id:2, len:3, children: [c,d]};
        var a = { id:1, len:1, children: [b,e]};
        var root = {id:0, len:0, children: [a,g]};


        */

    });


    function done(err) {
        if (err) console.error(err.stack);
        User.find({ name: 'p0'}).populate({path:'children',select:'name'}).exec(function(user) {
            console.log(user);
        });
             //       User.remove({}, function(err) {
   //         console.log('collection removed')
     //   });

    }
};
/* todo
 */

exports.testPromise = function (req, res) {
    /*var list = ['a', 'b', 'c', 'd', 'e'];

    var execute = function (x) {
        var d = $.Deferred();

        console.log('Begin ' + x);

        setTimeout(function () {
            console.log('End ' + x);
            d.resolve();
        }, 1000);

        return d;
    };


    (function recurse(i, l) {
        execute(l[i]).then(function () {
            if (i + 1 < l.length) {
                recurse(i + 1, l);
            }
        });
    })(0, list);*/
    var assert = require('assert');
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = mongoose.Types.ObjectId;
    var dbname = 'testing_populateAdInfinitum';
    var db = mongoose.connection;
    var db2 = db.useDb(dbname);
    console.log('dbname: %s', db2.name);

    var user = new Schema({
        name: String, children: [
            { seq:Number,child:{type: Schema.ObjectId, ref: 'User'} ,qty:Number}
        ]
    });
    var User = db2.model('User', user);
    var userIds = [new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId];
    var users = [];

    users.push({
        _id: userIds[0], name: 'p0', children: [{seq:1,child:userIds[1],qty:2}, {seq:2,child:userIds[2],qty:2}, {seq:3,child:userIds[3],qty:3}]
    });
    users.push({
        _id: userIds[1], name: 'child1', children: [{seq:1,child:userIds[4],qty:2}]
    });
    users.push({
        _id: userIds[2], name: 'child2', children: [{seq:1,child:userIds[5],qty:2}, {seq:2,child:userIds[6],qty:2}, {seq:3,child:userIds[7],qty:1}]
    });
    users.push({
        _id: userIds[3], name: 'child3'
    });
    users.push({
        _id: userIds[4], name: 'child4'
    });

    users.push({
        _id: userIds[5], name: 'child5', children:[{seq:1,child:userIds[11],qty:2}]
    });
    users.push({
        _id: userIds[6], name: 'child6'
    });
    users.push({
        _id: userIds[7], name: 'child7'
    });
    users.push({
        _id: userIds[8], name: 'child8'
    });
    users.push({
        _id: userIds[9], name: 'child9'
    });
    users.push({
        _id: userIds[10], name: 'child10'
    });
    users.push({
        _id: userIds[11], name: 'child11'
    });
    User.create(users, function (err, docs) {
        var bom=[];
        var getChildren=function(parent,qty,lvl) {
            var promise = User.find({ name: parent }).lean().exec();
            promise.then(function (inv) {
                bom.push({lvl: lvl, parent: inv.name});
                if (inv.children.exists) {
                    lvl++;
                    children.each(function (child) {
                        getChildren(child.name, lvl)
                    })
                }
            })
        }
    });

};


exports.create = function (req, res) {
};
/* todo

 */
exports.all = function (req, res) {
};
/* todo

 */
exports.update = function (req, res) {
};
/* todo

 */
exports.remove = function (req, res) {
};
