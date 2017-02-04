'use strict'

const ImmutableCoreModelView = require('../lib/immutable-core-model-view')
const chai = require('chai')
const immutable = require('immutable-core')

const assert = chai.assert

describe('immutable-core-model-view', function () {

    beforeEach(function () {
        // clear global data
        immutable.reset()
        ImmutableCoreModelView.reset()
    })

    it('should create a new model view instance', function () {

        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })

        // get immutable functions which should have been created
        var eachFunction = immutable.function('sumModelViewEach')
        var postFunction = immutable.function('sumModelViewPost')
        var preFunction = immutable.function('sumModelViewPre')

        // validate constructor
        assert.isFunction(sumModelView)
        assert.deepEqual(sumModelView.modelView, {
            allowOverride: false,
            immutable: true,
            moduleName: 'sumModelView',
            name: 'sum',
            sequential: true,
            synchronous: true,
            type: 'collection',
            each: eachFunction,
            pre: preFunction,
            post: postFunction,
            register: true,
            args: undefined,
        })

        // create a new model view instance with constructor
        var sum = sumModelView('foo')

        // validate instance
        assert.deepEqual(sum, {
            allowOverride: false,
            immutable: true,
            moduleName: 'sumModelView',
            name: 'sum',
            sequential: true,
            synchronous: true,
            type: 'collection',
            each: eachFunction,
            pre: preFunction,
            post: postFunction,
            register: true,
            args: {properties: ['foo']},
        })

    })

    it('should create a new non-immutable model view instance', function () {

        var eachFunction = function () {}
        var postFunction = function () {}
        var preFunction = function () {}

        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: eachFunction,
            immutable: false,
            name: 'sum',
            pre: preFunction,
            post: postFunction,
            type: 'collection',
        })

        // validate constructor
        assert.isFunction(sumModelView)
        assert.deepEqual(sumModelView.modelView, {
            allowOverride: false,
            immutable: false,
            name: 'sum',
            sequential: true,
            synchronous: true,
            type: 'collection',
            each: eachFunction,
            pre: preFunction,
            post: postFunction,
            register: true,
            args: undefined,
        })

        // create a new model view instance with constructor
        var sum = sumModelView('foo')

        // validate instance
        assert.deepEqual(sum, {
            allowOverride: false,
            immutable: false,
            name: 'sum',
            sequential: true,
            synchronous: true,
            type: 'collection',
            each: eachFunction,
            pre: preFunction,
            post: postFunction,
            register: true,
            args: {properties: ['foo']},
        })

    })

    it('should create an immutable module and methods for async model view', function () {

        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            synchronous: false,
            type: 'collection',
        })

        // get model view module
        var module = immutable.module('sumModelView')
        // get immutable functions which should have been created
        var eachFunction = immutable.method('sumModelView.each')
        var postFunction = immutable.method('sumModelView.post')
        var preFunction = immutable.method('sumModelView.pre')

        // validate constructor
        assert.isFunction(sumModelView)
        assert.deepEqual(sumModelView.modelView, {
            allowOverride: false,
            immutable: true,
            module: module,
            moduleName: 'sumModelView',
            name: 'sum',
            sequential: true,
            synchronous: false,
            type: 'collection',
            each: eachFunction,
            pre: preFunction,
            post: postFunction,
            register: true,
            args: undefined,
        })

        // create a new model view instance with constructor
        var sum = sumModelView('foo')

        // validate instance
        assert.deepEqual(sum, {
            allowOverride: false,
            immutable: true,
            module: module,
            moduleName: 'sumModelView',
            name: 'sum',
            sequential: true,
            synchronous: false,
            type: 'collection',
            each: eachFunction,
            pre: preFunction,
            post: postFunction,
            register: true,
            args: {properties: ['foo']},
        })

    })

    it('should default record view to sequential: false', function () {
        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            type: 'record',
        })
        assert.isFalse(sumModelView.modelView.sequential)
    })

    it('should create a new model view instance with multiple column args', function () {
        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            type: 'collection',
        })
        // create a new model view instance with constructor
        var sum = sumModelView('bam', 'bar', 'foo')
        // validate instance
        assert.deepEqual(sum.args, {properties: ['bam','bar','foo']})
    })

    it('should create a new model view instance with object arg', function () {
        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            type: 'collection',
        })
        // create a new model view instance with constructor
        var sum = sumModelView({foo: 'bar'})
        // validate instance
        assert.deepEqual(sum.args, {foo: 'bar'})
    })

    it('should throw error redefining existing model view', function () {
        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            type: 'collection',
        })
        assert.throws(function () {
            // attempting to create model view with same name should throw
            var sumModelView = new ImmutableCoreModelView({
                each: function () {},
                name: 'sum',
                type: 'collection',
            })
        })
    })

    it('should not throw error redefining existing model view and allowOverride set', function () {
        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            type: 'collection',
        })
        assert.doesNotThrow(function () {
            // attempting to create model view with same name should throw
            var sumModelView = new ImmutableCoreModelView({
                allowOverride: true,
                each: function () {},
                name: 'sum',
                type: 'collection',
            })
        })
    })

    it('should not throw error redefining existing model view and allowOverride set for async model view', function () {
        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            synchronous: false,
            type: 'collection',
        })
        assert.doesNotThrow(function () {
            // attempting to create model view with same name should throw
            var sumModelView = new ImmutableCoreModelView({
                allowOverride: true,
                each: function () {},
                name: 'sum',
                synchronous: false,
                type: 'collection',
            })
        })
    })

    it('should not create immutable module/methods when immutable false', function () {
        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            immutable: false,
            name: 'sum',
            type: 'collection',
        })
        assert.isFalse(immutable.hasFunction('sumModelViewEach'))
    })

    it('should not create immutable module/methods when immutable false', function () {
        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            immutable: false,
            name: 'sum',
            synchronous: false,
            type: 'collection',
        })
        assert.isFalse(immutable.hasModule('sumModelView'))
    })

    it('should have model view when register true', function () {
        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            type: 'record',
        })
        assert.isTrue(ImmutableCoreModelView.hasModelView('sum'))
    })

    it('should not have model view when register false', function () {
        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            register: false,
            type: 'record',
        })
        assert.isFalse(ImmutableCoreModelView.hasModelView('sum'))
    })

    it('should throw error on invalid name', function () {
        assert.throws(function () {
            // attempting to create model view with same name should throw
            var sumModelView = new ImmutableCoreModelView({
                each: function () {},
                name: '',
                type: 'collection',
            })
        })
        assert.throws(function () {
            // attempting to create model view with same name should throw
            var sumModelView = new ImmutableCoreModelView({
                each: function () {},
                name: 0,
                type: 'collection',
            })
        })
    })

    it('should throw error on invalid type', function () {
        assert.throws(function () {
            // attempting to create model view with same name should throw
            var sumModelView = new ImmutableCoreModelView({
                each: function () {},
                name: 'foo',
                type: 'xxx',
            })
        })
    })

    it('should throw error on missing each function', function () {
        assert.throws(function () {
            // attempting to create model view with same name should throw
            var sumModelView = new ImmutableCoreModelView({
                each: undefined,
                name: 'sum',
                type: 'collection',
            })
        })
    })

    it('should throw error on invalid post function', function () {
        assert.throws(function () {
            // attempting to create model view with same name should throw
            var sumModelView = new ImmutableCoreModelView({
                each: function () {},
                name: 'sum',
                type: 'collection',
                post: 1,
            })
        })
    })

    it('should throw error on invalid pre function', function () {
        assert.throws(function () {
            // attempting to create model view with same name should throw
            var sumModelView = new ImmutableCoreModelView({
                each: function () {},
                name: 'sum',
                type: 'collection',
                pre: 1,
            })
        })
    })

    it('should throw error on record view with pre function', function () {
        assert.throws(function () {
            // attempting to create model view with same name should throw
            var sumModelView = new ImmutableCoreModelView({
                each: function () {},
                name: 'sum',
                type: 'record',
                pre: function () {},
            })
        })
    })

    it('should throw error on record view with post function', function () {
        assert.throws(function () {
            // attempting to create model view with same name should throw
            var sumModelView = new ImmutableCoreModelView({
                each: function () {},
                name: 'sum',
                type: 'record',
                post: function () {},
            })
        })
    })

})