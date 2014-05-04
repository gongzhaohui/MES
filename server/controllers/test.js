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
        name: String, friends: [
            { type: Schema.ObjectId, ref: 'User1' }
        ]
    });
    var User = db2.model('User1', user);

    var blogpost = Schema({
        title: String, tags: [String], author: { type: Schema.ObjectId, ref: 'User1' }
    });
    var BlogPost = db2.model('BlogPost', blogpost);


    var userIds = [new ObjectId, new ObjectId, new ObjectId, new ObjectId];
    var users = [];

    users.push({
        _id: userIds[0], name: 'mary', friends: [userIds[1], userIds[2], userIds[3]]
    });
    users.push({
        _id: userIds[1], name: 'bob', friends: [userIds[0], userIds[2], userIds[3]]
    });
    users.push({
        _id: userIds[2], name: 'joe', friends: [userIds[0], userIds[1], userIds[3]]
    });
    users.push({
        _id: userIds[3], name: 'sally', friends: [userIds[0], userIds[1], userIds[2]]
    });

    User.create(users, function (err, docs) {
        assert.ifError(err);

        var blogposts = [];
        blogposts.push({ title: 'blog 1', tags: ['fun', 'cool'], author: userIds[3] });
        blogposts.push({ title: 'blog 2', tags: ['cool'], author: userIds[1] });
        blogposts.push({ title: 'blog 3', tags: ['fun', 'odd'], author: userIds[2] });

        BlogPost.create(blogposts, function (err, docs) {
            assert.ifError(err);

            BlogPost.find({ tags: 'fun' }).lean().populate('author').exec(function (err, docs) {
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
        })
    });


    function done(err) {
        if (err) console.error(err.stack);
        db2.dropDatabase(function () {
            console.log('dropped');
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
