module.exports = function (app) {
    var dataSource = app.dataSources["grape-mysql"];
    dataSource.autoupdate(null, function (err) {
        console.log(err);
    });
};