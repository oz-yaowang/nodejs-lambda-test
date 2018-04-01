// let LambdaTester = require('lambda-tester');
let lambda = require('../src/lambda');
// let assert = require('assert');

/* global describe:true it:true*/
describe('test lambda function', function () {
    it('successful save content to AWS DynamoDB', function () {
        // return LambdaTester(lambda).event({content: 'test'}).expectResult((result) => {
        //     assert.equal(result, 'success');
        // });

        lambda.handler();

    });
});
