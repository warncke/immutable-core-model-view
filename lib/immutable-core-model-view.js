'use strict'

/* native modules */
const assert = require('assert')

/* npm modules */
const _ = require('lodash')
const defined = require('if-defined')
const immutable = require('immutable-core')
const mergeArgs = require('merge-args')()
const stableId = require('stable-id')

/* exports */
module.exports = ImmutableCoreModelView

/* public methods */
ImmutableCoreModelView.modelView = getModelView
ImmutableCoreModelView.hasModelView = hasModelView
ImmutableCoreModelView.reset = reset

/* global variables */

// get reference to global singleton instance
var immutableCoreModelView
// initialize global singleton instance if not yet defined
if (!global.__immutable_core_model_view__) {
    reset()
}
// use existing singleton instance
else {
    immutableCoreModelView = global.__immutable_core_model_view__
}

/* constants */
const defaultOptions = {
    /* class options */

    // allow globally registered model views to be redefined
    allowOverride: false,
    // cache view results
    cache: true,
    // create immutable functions/modules/methods
    immutable: true,
    // pass record with meta data to each instead of just record data
    meta: false,
    // model view name - should be globally unique
    name: '',
    // add model view to global register
    register: true,
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
    // require name
    assert.ok(typeof args.name === 'string' && args.name.length, 'name required')
    // require valid type
    assert.ok(validTypes[args.type], 'invalid type '+args.type)
    // do not allow pre/post function with record type view
    if (args.type === 'record' && (args.post || args.pre)) {
        throw new Error('pre and post functions not allowed with record views')
    }
    // require function
    assert.ok(typeof args.each === 'function', 'each function required')
    // validate post function if passed
    if (args.post) {
        assert.ok(typeof args.post === 'function', 'post must be function')
    }
    // validate pre function if passed
    if (args.pre) {
        assert.ok(typeof args.pre === 'function', 'pre must be function')
    }
    // create new model view object
    var modelView = _.clone(defaultOptions)
    // set record type views to be parallel and out-of-order by default
    if (args.type === 'record') {
        modelView.sequential = false
    }
    // merge arguments over defaults
    mergeArgs(modelView, args)
    // if model view is being registered and override is not allowed then
    // it must not be defined
    if (modelView.register && !modelView.allowOverride && hasModelView(modelView.name)) {
        throw new Error('model view '+modelView.name+' already defined')
    }
    // make each, post, pre functions immutable
    if (modelView.immutable) {
        makeImmutable(modelView)
    }
    // return constructor function that will generate a custom model
    // view instance based on the parent model view class
    var modelViewConstructor = function () {
        // create new instance based on class meta data
        var instance = _.clone(modelView)
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
            // if there are arguments then they must be string property names
            if (numArgs > 0) {
                // create properties
                instance.args.properties = []
                // check that all args are strings
                for (var i=0; i < numArgs; i++) {
                    assert(typeof arguments[i] === 'string', 'invalid argument '+arguments[i])
                    // add argument to list of properties
                    instance.args.properties[i] = arguments[i]
                }
            }
        }
        // set modelViewInstanceId on instance
        setModelViewInstanceId(instance)
        // set class properties
        instance.class = 'ImmutableCoreModelViewInstance'
        instance.ImmutableCoreModelViewInstance = true
        // return instance object
        return instance
    }
    // store class data on constructor function
    modelViewConstructor.modelView = modelView
    // add model view to global register
    if (modelView.register) {
        immutableCoreModelView.modelViews[modelView.name] = modelViewConstructor
    }
    // set class properties
    modelViewConstructor.class = 'ImmutableCoreModelView'
    modelViewConstructor.ImmutableCoreModelView = true
    // set modelViewId on modelView
    setModelViewId(modelViewConstructor)
    // return constructor function
    return modelViewConstructor
}

/* public functions */

/**
 * @function reset
 *
 * reset global instance register
 */
function reset () {
    immutableCoreModelView = global.__immutable_core_model_view__ = {
        modelViews: {},
    }
}

/**
 * @function getModelView
 *
 * if modelViewName passed return model view by name. otherwise return object
 * with all global model views indexed by name. if name is passed and model
 * view is not defined error will be thrown.
 *
 * @param {string|undefined} modelViewName
 *
 * @returns {ImmutableCoreModelView|object}
 */
function getModelView (modelViewName) {
    // if name is not passed then return all
    if (!modelViewName) {
        return immutableCoreModelView.modelViews
    }
    // if model view is passed then model view must be defined
    assert.ok(immutableCoreModelView.modelViews[modelViewName], 'model view '+modelViewName+' not found')
    // return model view
    return immutableCoreModelView.modelViews[modelViewName]
}

/**
 * @function hasModelView
 *
 * checks whether model view of given name is defined
 *
 * @param {string} modelViewName
 *
 * @returns {boolean}
 */
function hasModelView (modelViewName) {
    return immutableCoreModelView.modelViews[modelViewName] ? true : false
}

/* private functions */

/**
 * @function makeImmutable
 *
 * make immutable functions if the model view is synchronous or create an
 * immutable module with methods if the model view is asynchronous.
 *
 * each, post, and pre functions on the modelView will be replaced with
 * appropriate immutable versions.
 *
 * @param {ImmutableCoreModelView} modelView
 *
 * @throws {Error}
 */
function makeImmutable (modelView) {
    // give model view a module name - this will be used for immutable module
    // for async  model views or for the base of function name for sync
    modelView.moduleName = modelView.name+'ModelView'
    // create immutable functions/module/methods
    return modelView.synchronous
        ? makeImmutableSynchronous(modelView)
        : makeImmutableAsynchronous(modelView)
}

/**
 * @function makeImmutableAsynchronous
 *
 * make immutable module and methods for model view.
 *
 * @param {ImmutableCoreModelView} modelView
 *
 * @throws {Error}
 */
function makeImmutableAsynchronous (modelView) {
    // create new immutable module - pass allowOverride arg which if true
    // will allow module to be redefined
    modelView.module = immutable.module(modelView.moduleName, {}, {
        allowOverride: modelView.allowOverride,
    })
    // create each method
    modelView.each = immutable.method(modelView.moduleName+'.each', modelView.each)
    // create post method if defined
    if (modelView.post) {
        modelView.post = immutable.method(modelView.moduleName+'.post', modelView.post)
    }
    // create pre method if defined
    if (modelView.pre) {
        modelView.pre = immutable.method(modelView.moduleName+'.pre', modelView.pre)
    }
}

/**
 * @function makeImmutableSynchronous
 *
 * make immutable functions for model view.
 *
 * @param {ImmutableCoreModelView} modelView
 *
 * @throws {Error}
 */
function makeImmutableSynchronous (modelView) {
    // create each function
    modelView.each = immutable.function(modelView.moduleName+'Each', modelView.each, {
        allowOverride: modelView.allowOverride,
    })
    // create post method if defined
    if (modelView.post) {
        modelView.post = immutable.function(modelView.moduleName+'Post', modelView.post, {
            allowOverride: modelView.allowOverride,
        })
    }
    // create pre method if defined
    if (modelView.pre) {
        modelView.pre = immutable.function(modelView.moduleName+'Pre', modelView.pre, {
            allowOverride: modelView.allowOverride,
        })
    }
}

/**
 * @function setModelViewId
 *
 * calculate and set modelViewId for model view object
 *
 * @param {function} modelViewConstructor
 */
function setModelViewId (modelViewConstructor) {
    // get clone of model view spec definition
    var modelView = _.clone(modelViewConstructor.modelView)
    // get function def of constructor
    modelView.constructor = modelViewConstructor.toString()
    // get each function def and meta if set
    if (typeof modelView.each === 'function') {
        modelView.each = {
            function: modelView.each.toString(),
            meta: modelView.each.meta,
        }
    }
    // get post function def and meta if set
    if (typeof modelView.post === 'function') {
        modelView.post = {
            function: modelView.post.toString(),
            meta: modelView.post.meta,
        }
    }
    // get pre function def and meta if set
    if (typeof modelView.pre === 'function') {
        modelView.pre = {
            function: modelView.pre.toString(),
            meta: modelView.pre.meta,
        }
    }
    // set id on model view
    modelViewConstructor.modelView.modelViewId = stableId(modelView)
}

/**
 * @function setModelViewInstanceId
 *
 * calculate and set modelViewInstanceId for model view instance object
 *
 * @param {object} modelViewInstance
 */
function setModelViewInstanceId (modelViewInstance) {
    // data to calculate unique id from
    var idData = {
        args: modelViewInstance.args,
        name: modelViewInstance.name,
        modelViewId: modelViewInstance.modelViewId,
    }
    // set id on model view instance
    modelViewInstance.modelViewInstanceId = stableId(idData)
}