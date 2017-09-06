'use strict'

const ImmutableCoreModelView = require('../lib/immutable-core-model-view')
const chai = require('chai')
const immutable = require('immutable-core')

const assert = chai.assert

describe('immutable-core-model-view - ids', function () {

    beforeEach(function () {
        // clear global data
        immutable.reset()
        ImmutableCoreModelView.reset()
    })

    it('should have same modelViewIds for identical model view', function () {

        // create constructor instance
        var sumModelView1 = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })
        
        // clear global data
        immutable.reset()
        ImmutableCoreModelView.reset()

        var sumModelView2 = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })

        // both should have ids
        assert.match(sumModelView1.modelView.modelViewId, /^[a-f0-9]{32}$/)
        assert.match(sumModelView2.modelView.modelViewId, /^[a-f0-9]{32}$/)
        // ids should not match
        assert.strictEqual(sumModelView1.modelView.modelViewId, sumModelView2.modelView.modelViewId)
    })

    it('should create different modelViewIds for different names', function () {

        // create constructor instance
        var sumModelView1 = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })

        // clear global data
        immutable.reset()
        ImmutableCoreModelView.reset()

        var sumModelView2 = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum2',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })

        // both should have ids
        assert.match(sumModelView1.modelView.modelViewId, /^[a-f0-9]{32}$/)
        assert.match(sumModelView2.modelView.modelViewId, /^[a-f0-9]{32}$/)
        // ids should not match
        assert.notStrictEqual(sumModelView1.modelView.modelViewId, sumModelView2.modelView.modelViewId)
    })

    it('should create different modelViewIds for different types', function () {

        // create constructor instance
        var sumModelView1 = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })

        // clear global data
        immutable.reset()
        ImmutableCoreModelView.reset()

        var sumModelView2 = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            type: 'record',
        })

        // both should have ids
        assert.match(sumModelView1.modelView.modelViewId, /^[a-f0-9]{32}$/)
        assert.match(sumModelView2.modelView.modelViewId, /^[a-f0-9]{32}$/)
        // ids should not match
        assert.notStrictEqual(sumModelView1.modelView.modelViewId, sumModelView2.modelView.modelViewId)
    })

    it('should create different modelViewIds for different each', function () {

        // create constructor instance
        var sumModelView1 = new ImmutableCoreModelView({
            each: function () { var x = 1 },
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })

        // clear global data
        immutable.reset()
        ImmutableCoreModelView.reset()

        var sumModelView2 = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })

        // both should have ids
        assert.match(sumModelView1.modelView.modelViewId, /^[a-f0-9]{32}$/)
        assert.match(sumModelView2.modelView.modelViewId, /^[a-f0-9]{32}$/)
        // ids should not match
        assert.notStrictEqual(sumModelView1.modelView.modelViewId, sumModelView2.modelView.modelViewId)
    })

    it('should create different modelViewIds for different pre', function () {

        // create constructor instance
        var sumModelView1 = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () { var x = 1 },
            post: function () {},
            type: 'collection',
        })

        // clear global data
        immutable.reset()
        ImmutableCoreModelView.reset()

        var sumModelView2 = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })

        // both should have ids
        assert.match(sumModelView1.modelView.modelViewId, /^[a-f0-9]{32}$/)
        assert.match(sumModelView2.modelView.modelViewId, /^[a-f0-9]{32}$/)
        // ids should not match
        assert.notStrictEqual(sumModelView1.modelView.modelViewId, sumModelView2.modelView.modelViewId)
    })

    it('should create different modelViewIds for different post', function () {

        // create constructor instance
        var sumModelView1 = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () { var x = 1 },
            type: 'collection',
        })

        // clear global data
        immutable.reset()
        ImmutableCoreModelView.reset()

        var sumModelView2 = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })

        // both should have ids
        assert.match(sumModelView1.modelView.modelViewId, /^[a-f0-9]{32}$/)
        assert.match(sumModelView2.modelView.modelViewId, /^[a-f0-9]{32}$/)
        // ids should not match
        assert.notStrictEqual(sumModelView1.modelView.modelViewId, sumModelView2.modelView.modelViewId)
    })

    it('should have same modelViewInstanceIds for identical instances - single string arg', function () {

        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })
        
        // create instances
        var sum1 = sumModelView('foo')
        var sum2 = sumModelView('foo')

        // both should have ids
        assert.match(sum1.modelViewInstanceId, /^[a-f0-9]{32}$/)
        assert.match(sum2.modelViewInstanceId, /^[a-f0-9]{32}$/)
        // ids should not match
        assert.strictEqual(sum1.modelViewInstanceId, sum2.modelViewInstanceId)
    })

    it('should have same modelViewInstanceIds for identical instances - multiple string arg', function () {

        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })
        
        // create instances
        var sum1 = sumModelView('foo', 'bam', 'bar')
        var sum2 = sumModelView('foo', 'bam', 'bar')

        // both should have ids
        assert.match(sum1.modelViewInstanceId, /^[a-f0-9]{32}$/)
        assert.match(sum2.modelViewInstanceId, /^[a-f0-9]{32}$/)
        // ids should not match
        assert.strictEqual(sum1.modelViewInstanceId, sum2.modelViewInstanceId)
    })

    it('should have same modelViewInstanceIds for identical instances - object arg', function () {

        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })
        
        // create instances
        var sum1 = sumModelView({foo: 'bar'})
        var sum2 = sumModelView({foo: 'bar'})

        // both should have ids
        assert.match(sum1.modelViewInstanceId, /^[a-f0-9]{32}$/)
        assert.match(sum2.modelViewInstanceId, /^[a-f0-9]{32}$/)
        // ids should not match
        assert.strictEqual(sum1.modelViewInstanceId, sum2.modelViewInstanceId)
    })

    it('should have different modelViewInstanceIds for different instance args - single string arg', function () {

        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })
        
        // create instances
        var sum1 = sumModelView('foo')
        var sum2 = sumModelView('bar')

        // both should have ids
        assert.match(sum1.modelViewInstanceId, /^[a-f0-9]{32}$/)
        assert.match(sum2.modelViewInstanceId, /^[a-f0-9]{32}$/)
        // ids should not match
        assert.notStrictEqual(sum1.modelViewInstanceId, sum2.modelViewInstanceId)
    })

    it('should have different modelViewInstanceIds for different instance args - multiple string arg', function () {

        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })
        
        // create instances
        var sum1 = sumModelView('foo', 'bam', 'bar')
        var sum2 = sumModelView('foo', 'baz', 'bar')

        // both should have ids
        assert.match(sum1.modelViewInstanceId, /^[a-f0-9]{32}$/)
        assert.match(sum2.modelViewInstanceId, /^[a-f0-9]{32}$/)
        // ids should not match
        assert.notStrictEqual(sum1.modelViewInstanceId, sum2.modelViewInstanceId)
    })

    it('should have different modelViewInstanceIds for different instance args - object arg', function () {

        // create constructor instance
        var sumModelView = new ImmutableCoreModelView({
            each: function () {},
            name: 'sum',
            pre: function () {},
            post: function () {},
            type: 'collection',
        })
        
        // create instances
        var sum1 = sumModelView({foo: 'bar'})
        var sum2 = sumModelView({foo: 'bam'})

        // both should have ids
        assert.match(sum1.modelViewInstanceId, /^[a-f0-9]{32}$/)
        assert.match(sum2.modelViewInstanceId, /^[a-f0-9]{32}$/)
        // ids should not match
        assert.notStrictEqual(sum1.modelViewInstanceId, sum2.modelViewInstanceId)
    })

})