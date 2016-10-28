'use strict';

module.exports = function(Grape) {
    Grape.beforeRemote('create', function(ctx, modelInstance, next) {
        ctx.args.data.userId = ctx.req.accessToken.userId;
        next();
    });

    Grape.join = function (name, password, cb) {
        console.log(name);
        console.log(password);

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
                // Grape.addUser()
                console.log('success');
                console.log(grape);
            }

            // Return
            cb(null, grape);
        });

    };

    Grape.remoteMethod('join', {
        accepts: [
            {arg: 'name', type: 'string'},
            {arg: 'password', type: 'string'}
        ],
        returns: {arg: 'grape', type: 'Grape'}
    });
};
