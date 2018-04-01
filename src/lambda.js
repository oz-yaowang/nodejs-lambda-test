exports.handler = function (event, context, callback) {

    if (callback)
        callback(null, 'some success message');

};
