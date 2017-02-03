'use strict'

/* native modules */
const assert = require('assert')

/* npm modules */
const _ = require('lodash')
const mergeArgs = require('merge-args')()

/* exports */
module.exports = ImmutableCoreModelView

/* constants */

const defaultOptions = {
    /* class options */

    // allow globally registered model views to be redefined
    allowOverride: false,
    // model view name - should be globally unique
    name: '',
    // records must be processed in sequence
    sequential: true,
    // view functions (pre,post,each) are synchronous
    synchronous: true,
    // type from validTypes (e.g. collection, record)
    type: '',

    /* class functions */

    // function that is executed on each record in result set. each must
    // modify the record and context objects as needed.
    each: undefined,
    // function that is executed on context object prior to iteration. pre
    // must return an object that will be used as the context for the
    // execution of each.
    pre: undefined,
    // function that is executed on context after iteration. when sequential
    // is true then context will be a single object. when sequential is false
    // then context will be an array of context objects that are the result
    // of running each out-of-order on blocks of records and the post function
    // must combine these contexts into a single context object. the return
    // value from post will be returned by the model view.
    post: undefined,

    /* instance options */

    // arguments for model view instance. e.g. a sumModelView class would
    // be instantiated with sumModelView(columnName) to provide a specific
    // model view instance that would sum the values in columnName
    args: undefined,

}

const validTypes = {
    // collection views return a single object calculated by calling the
    // view function on each record in the collection
    collection: true,
    // record views are applied to each record in the collection and modify
    // the records before returning them
    record: true,
}

/**
 * @function ImmutableCoreModelView
 *
 * create/register a new model view instance
 *
 * @param {object} args
 *
 * @returns {ImmutableCoreModelView}
 *
 * @throws {Error}
 */
function ImmutableCoreModelView (args) {
    // require function
    assert.ok(typeof args.each === 'function', 'function required')
    // require name
    assert.ok(typeof args.name === 'string' && args.name.length, 'name required')
    // require valid type
    assert.ok(validTypes[args.type], 'invalid type '+args.type)
    // create new model view object
    var meta = _.clone(defaultOptions)
    // merge arguments over defaults
    mergeArgs(meta, args)
    // return function that will generate the actual view function with the
    // arguments passed to it
    var modelViewGeneratorFunction = function () {
        // create new instance based on class meta data
        var instance = _.clone(meta)
        // get number of args
        var numArgs = arguments.length
        // if function is passed a single object then these arguments will
        // be passed directly to the view instance func
        if (numArgs === 1 && typeof arguments[0] === 'object') {
            instance.args = arguments[0]
        }
        // otherwise create args as empty object
        else {
            instance.args = {}
            // if there are arguments then they must be string column names
            if (numArgs > 0) {
                // create columns arg
                instance.args.columns = []
                // check that all args are strings
                for (var i=0; i < numArgs; i++) {
                    assert(typeof arguments[i] === 'string', 'invalid argument '+arguments[i])
                    // add argument to list of columns
                    instance.args.columns[i] = arguments[i]
                }
            }
        }
        // return instance object
        return instance
    }
    // set options on model view function
    modelViewGeneratorFunction.meta = meta
}