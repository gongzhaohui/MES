'use strict';

// The Package is past automatically as first parameter
module.exports = function(Mes, app, auth, database) {

    app.get('/mes/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/mes/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/mes/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/mes/example/render', function(req, res, next) {
        Mes.render('index', {
            package: 'mes'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
