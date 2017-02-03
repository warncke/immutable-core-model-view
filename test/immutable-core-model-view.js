'use strict'

const ImmutableCoreModelView = require('../lib/immutable-core-model-view')
const chai = require('chai')

describe('immutable-core-model-view', function () {

    it('should create a new model view instance', function () {

        var sumModelView = new ImmutableCoreModelView({
            each: function (view, record, index, context) {

            },
            name: 'sum',
            type: 'collection',
        })

    })

})