'use strict';


/**
 * exports
 *
 */

exports.test = function (req, res) {

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
    console.log('dbname: %s', db2.dbName);

    /*  mongoose.connect('localhost', dbname);
     mongoose.connection.on('error', function () {
     console.error('connection error', arguments);
     });
     */
    var user = new Schema({
        name: String, children: [
            { type: Schema.ObjectId, ref: 'User1' }
        ]
    });
    var User = db2.model('User1', user);
    var userIds = [new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId];
    var users = [];

    users.push({
        _id: userIds[0], name: 'p0', children: [userIds[1], userIds[2], userIds[3]]
    });
    users.push({
        _id: userIds[1], name: 'child1', children: [userIds[4]]
    });
    users.push({
        _id: userIds[2], name: 'child2', children: [userIds[5], userIds[6], userIds[7]]
    });
    users.push({
        _id: userIds[3], name: 'child3'
    });
    users.push({
        _id: userIds[4], name: 'child4'
    });

    users.push({
        _id: userIds[5], name: 'child5'
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

    User.create(users, function (err, docs) {
        assert.ifError(err);
        var BOM=[];

        var getChildren=function(parent,lvl){
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
         function out(s) {
         $("#out").append(s+'\n');
         }

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

// keep track of recursion count
        var count = 0;
// to be called when recursion is completed
        function last() {
            out('this should be last');
        }
// call 'last' when count is 0
        var done = function() {
            if (count==0) last();
        }
// the recursive function
        function recurse(node) {
            count++;
            out(node.id);
            var wait = node.len * 100;
            var walk = function() {
                for (var i=0; i<node.children.length; i++) {
                    recurse(node.children[i]);
                }
                count--;
                done();
            }
            // simiulate an asyncrhonous call to get children
            setTimeout(walk, wait);
        }
// kick off the recursion
        function run() {
            out('entering run');
            recurse(root);
            out('leaving run');
        }
// and begin
        run();
        */

    });


    function done(err) {
        if (err) console.error(err.stack);
        User.remove({}, function(err) {
            console.log('collection removed')
        });

    }
};
/* todo
 */
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
