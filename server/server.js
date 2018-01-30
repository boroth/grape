'use strict';

var loopback = require('loopback');
var LoopBackContext = require('loopback-context');
var boot = require('loopback-boot');
var PassportConfigurator =
    require('loopback-component-passport').PassportConfigurator;

var app = module.exports = loopback();


app.use(LoopBackContext.perRequest());
app.use(loopback.token());
app.use(function setCurrentUser(req, res, next) {
  if (!req.accessToken) {
    return next();
  }
  app.models.GrapeUser.findById(req.accessToken.userId, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('No user with this access token was found.'));
    }
    var ctx = LoopBackContext.getCurrentContext();
    if (ctx) {
      ctx.set('currentUser', user);
    }
    next();
  });
});

app.start = function() {

  // Setup relationships
  var User = app.models.User;
  var Grape = app.models.Grape;
  User.hasMany(Grape, { as: 'grapes', foreignKey: 'userId' });
  Grape.hasMany(User, { as: 'users', foreignKey: 'grapeId' });

  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;


  // start the server if `$ node server.js`
  if (require.main === module) {

    // Start app
    app.io = require('socket.io')(app.start());

    // Handle socket connections
    app.io.on('connection', function (socket) {
      console.log('a user connected');

      socket.on('subscribe', function (room) {
        console.log('joining room', room);
        socket.join(room);
      });
      socket.on('disconnect', function () {
        console.log('user disconnected');
      });
    });
  }
});
