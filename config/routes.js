var express = require("express");

module.exports = function (app, passport, auth) {
    //User Routes
    var applications = require('../app/controllers/applications');
    var userdata = require('../app/controllers/userdata');
    var users = require('../app/controllers/users');
    var rooms = require('../app/controllers/rooms');
    var apps = require('../app/controllers/apps');

    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);

    //Setting up the users api
    app.post('/users', users.create);  //register
    app.get('/users', users.all);
    app.get('/users/:userId', users.show);
    app.del('/users/:userId', users.destroy);
    app.get('/users/:userId/rooms', users.rooms);

    app.get('/rooms', rooms.all);
    app.post('/rooms', rooms.create);
    app.get('/rooms/:roomId', rooms.show);
    app.del('/rooms/:roomId', rooms.destroy);
    app.get('/rooms/:roomId/users', rooms.users);
    app.post('/rooms/:roomId/users', rooms.joinRoom);
    app.del('/rooms/:roomId/users/:userId', rooms.exitRoom);

    app.get('/apps', applications.all);
    app.post('/apps', applications.install);
    app.del('/apps/:appId', applications.uninstall);

    app.get('/apps/:appId', apps.show);
    app.get('/apps/:appId/rooms', apps.rooms);
    app.get('rooms/:roomId/apps', rooms.apps);
    app.post('/rooms/:roomId/apps', rooms.addApp);
    app.del('/rooms/:roomId/apps/:appId', rooms.removeApp);

    app.get('/userdata/:appId/:entityId', auth.requiresLogin, userdata.read);
    app.post('/userdata/:appId/:entityId', auth.requiresLogin, userdata.write);

    app.post('/sync', applications.sync);


    app.get('/register', users.register);
    app.get('/login', users.login);
    //Liu 
    //Setting the local strategy route
    app.post('/login', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true,
        successRedirect: '/',
        successFlash: '登陆成功！'
    }));

    app.post('/register', users.create);  //register
    app.get('/auth', users.auth);


/*    app.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), users.session);
*/




    //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'user_about_me'],
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Finish with setting up the userId param
    app.param('userId', users.user);
    app.param('roomId', rooms.room);
    app.param('appId', applications.app);
//    app.param('entityId', );

    //Article Routes
    var articles = require('../app/controllers/articles');
    app.get('/articles', articles.all);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:articleId', articles.show);
    app.put('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.update);
    app.del('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);

    //Finish with setting up the articleId param
    app.param('articleId', articles.article);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', auth.requiresLogin, index.home);

    app.post('/sync', applications.sync);
};
