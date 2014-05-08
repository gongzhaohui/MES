'use strict';

// The Package is past automatically as first parameter
module.exports = function(Mo, app, auth, database) {

    app.get('/mo/example/anyone', function (req,res,next) {
      res.send('Anyone can access this');
    });

    app.get('/mo/example/auth',auth.requiresLogin, function (req,res,next) {
      res.send('Only authenticated users can access this');
    });

    app.get('/mo/example/admin',auth.requiresAdmin, function (req,res,next) {
      res.send('Only users with Admin role can access this');
    });    

    app.get('/mo/example/render', function (req,res,next) {
      Mo.render('index', {package:'mo'}, function (err, html) {
        //Rendering a view from the Package server/views
        res.send(html);
      });
    });
};