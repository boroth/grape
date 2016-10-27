'use strict';

module.exports = function(Grape) {
    Grape.beforeRemote('create', function(ctx, modelInstance, next) {
        ctx.args.data.userId = ctx.req.accessToken.userId;
        next();
    });
};
