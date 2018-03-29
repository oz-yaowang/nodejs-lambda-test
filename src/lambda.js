const AWS = require('aws-sdk');
const TABLE_NAME = 'CKEditorContent';

exports.handler = function (event, context, callback) {

    AWS.config.update({
        region: 'us-east-2',
        endpoint: 'dynamodb.us-east-2.amazonaws.com',
        credentials: {
            accessKeyId: 'AKIAI3QWQY3ZJLS5T4LA',
            secretAccessKey: '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',
        },
    });
    this.dynamoDBDocClient = new AWS.DynamoDB.DocumentClient();

    this.dynamoDBDocClient.put({
        TableName: TABLE_NAME,
        Item: {
            content: event.content,
        },
    }, (err) => {
        if (err) {
            throw new Error(err.message);
        } else {
            callback(null, 'success');
        }
    });

};
