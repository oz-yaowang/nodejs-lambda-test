let LambdaTester = require('lambda-tester');
let lambda = require('../src/lambda').handler;
let assert = require('assert');

/* global describe:true it:true*/
describe('test lambda function', function () {


    it('call Lambda.js callback', function () {
        return LambdaTester(lambda).event({content: 'test'}).expectResult((result) => {
            assert.equal(result, 'some success message');
        });

    });

    it('call Lambda.js null callback branch', function () {
        lambda();
    });
});
