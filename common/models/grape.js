'use strict';
module.exports = function(Grape) {
    var LoopBackContext = require('loopback-context');

    var statuses = {
        "open": 1,
        "ready": 2,
        "elimination": 3
    };

    Grape.beforeRemote('create', function(ctx, modelInstance, next) {
        ctx.args.data.userId = ctx.req.accessToken.userId;
        next();
    });

    Grape.join = function (name, password, cb) {
        var ctx = LoopBackContext.getCurrentContext().active;

        // Find grape by name
        Grape.findOne({
            where: {
                name: name
            },
            fields: {
                id: true,
                name: true,
                password: true
            }
        }, function (err, grape) {

            if (err) {
                console.log(err);
            }

            // Make sure password is correct
            if (!grape || grape.password != password) {
                cb('Incorrect username or password.', err);
                return false;
            }
            // Add user to Grape
            else {
                Grape.app.models.GrapeUser.findById(ctx.currentUser.id, function (err, user) {
                    user.grapesjoined.add(grape, function (err, response) {
                        console.log('Server: User ' + user.username + ' has joined Grape ' + grape.name + '.');

                        // Return
                        cb(null, grape);
                    });
                });
            }
        });

    };

    Grape.remoteMethod('join', {
        accepts: [
            {arg: 'name', type: 'string'},
            {arg: 'password', type: 'string'}
        ],
        returns: {arg: 'grape', type: 'Grape'}
    });

    Grape.ready = function (id, cb) {
        Grape.findById(id, function (err, grape) {
            // Move grape to next status
            grape.status.updateAttribute('status', statuses.ready, function (err, grape) {
                cb(grape)
            });
        })
    };

    Grape.remoteMethod('ready', {
        http: {
            path: '/:id/ready'
        },
        returns: {arg: 'grape', type: 'Grape'}
    });
};
