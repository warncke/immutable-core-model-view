'use strict'

const ImmutableCoreModelView = require('../lib/immutable-core-model-view')
const chai = require('chai')
const immutable = require('immutable-core')

const assert = chai.assert

describe('immutable-core-model-view - looks like', function () {

    // clear global data
    immutable.reset()
    ImmutableCoreModelView.reset()

    // create constructor
    var FooModelView = new ImmutableCoreModelView({
        each: function () {},
        name: 'foo',
        type: 'record',
    })

    // create instance
    var fooModelView = FooModelView()

    describe('looksLikeConstructor', function () {

        it('should return true for constructor', function () {
            assert.isTrue(ImmutableCoreModelView.looksLikeConstructor(FooModelView))
        })

        it('should return false for non-constructor', function () {
            assert.isFalse(ImmutableCoreModelView.looksLikeConstructor(fooModelView))
        })

    })

    describe('looksLikeInstance', function () {

        it('should return true for instance', function () {
            assert.isTrue(ImmutableCoreModelView.looksLikeInstance(fooModelView))
        })

        it('should return false for non-instance', function () {
            assert.isFalse(ImmutableCoreModelView.looksLikeInstance(FooModelView))
        })

    })

})