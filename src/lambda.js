exports.handler = function (event, context, callback) {

    var responseBody = {data: 'some success message'};


    var response = {
        statusCode: 200,
        headers: {
            'x-custom-header': 'my custom header value'
        },
        body: JSON.stringify(responseBody)
    };

    if (callback)
        callback(null, response);

};
