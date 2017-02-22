# immutable-core-model-view

ImmutableCoreModelView provides a class for creating and managing Model
Views for use with immutable-core-model.

Simple model views allow model results to be formatted or summarized for
further processing or display.

ImmutableCoreModelView provides only the methods for creating and managing
model views and is dependent on the execution engine provided by
immutable-core-model for applying model view operations to models.

## Native async/await

Immutable Core Model View requires Node.js v7.6.0 or greater with native
async/await support.

## Creating a simple model view

    // create model view constuctor
    var FooModelView = new ImmutableCoreModelView({
        each: function (modelView, record) {
            record.foo = true
        },
        name: 'foo',
        type: 'record',
    })

    // create model view instance
    var fooModelView = FooModelView()

Calling new ImmutableCoreModelView returns a function that can then be called
to created individual model view instances.

More complex model views will have options, such as properties to apply to,
which can differ between instances.

In this simple example FooModelView has no options so every instance will be
the same.

When the fooModelView instance is applied to an immutable-core-model result
set the each function will be execute for every record in the result set.

Model views are synchronous by default and asynchronous model views have a
different interface.

This example is a synchronous model view and so the arguments for the each
function are: the model view instance, the record object to operate on, the
number of the object in the result set, and the context object provided by
the result set iterator which is shared between all invocations of each.

For synchronous model views the each function must make any desired changes
to the record object that is passed to it and any return value will be ignored.

By default when a synchronous model view is created the each function, and
optional post and pre functions, will be created as immutable-core functions.
This can be disabled by setting the immutable: false option.

## Creating an asynchronous model view

    var FooModelView = new ImmutableCoreModelView({
        each: function (args) {
            var modelView = args.modelView
            var record = args.record

            return {
                foo: true,
            }
        },
        name: 'foo',
        synchronous: false,
        type: 'record',
    })

Asynchronous model views are created as immutable-core modules by default and
follow immutable-core semantics.

All of the same arguments that are passed to the each function with a
synchronous model view will be passed as named properties to a single args
object for asynchronous model views.

Because the args to an immutable-core method are immutable the record passed to an an asynchronous each function cannot be modified.

For type: 'record' asynchronous model views the value returned by the each
function will be merged over the original record value.

If multiple asynchronous model views are applied to a single result set then
their each methods will be applied concurrently while operating on the same
record.

## Type: collection vs. record

There are two fundamental types of model views: collection views and record
views.

Record views can modify each record in a result set but each modified record
will be returned.

Collection views are applied to each record in a result set but only a single
object with the summary results is returned at the end.

Collection views can perform summaries of large record sets or format record
sets - e.g. transform an array of records into object keyed by property.

Record view functions can be executed in parallel and out-of-order by default
while collection view functions are executed sequentially by default.

Collection views have access to a context object and a number that identifies
the position of the record in the result set. Record views do not.

Collection views have optional post and pre functions that can be used to
initialize and finalize the context. Record views do not.

## Creating a collection model view to sum values

    // create model view constuctor
    var SumModelView = new ImmutableCoreModelView({
        each: function (modelView, record, number, context) {
            // add value for each property to sum
            _.each(modelView.properties, property => {
                // skip non-numbers
                if (typeof record[property] !== 'number') {
                    return
                }
                // add value to sum
                context.sum[property] += record[property]
            })
        },
        name: 'sum',
        pre: function (modelView) {
            // create context
            var context = {
                sum: {}
            }
            // get the properties that model view applies to which were
            // passed as arguments to the constuctor (e.g. foo, bar)
            _.each(modelView.properties, property => {
                // initalize sum for each property to zero
                context.sum[property] = 0
            })
            // return context which will be passed to each
            return context
        },
        type: 'record',
    })

### Creating a sum model view instance

    var sumModelView = SumModelView('foo', 'bar')

In this example the `pre` function will be executed before applying the each
function to any records. The object returned by the pre function will be used
as the context that is passed to the each function for each record.

The result of the sum model view is the context object which contains a sum
object with the sums for each property.

### Creating another sum model view instance

    var sumModelView = SumModelView('bam', 'baz')

Different instances of the sum model view can be created depending on which
columns need to be summed.

## Creating a model view to sum values in parallel

    // create model view constuctor
    var SumModelView = new ImmutableCoreModelView({
        each: function (modelView, record, number, context) {
            ...
        },
        name: 'sum',
        post: function (modelView, contexts) {
            // create result object that will be returned with final sum
            var result = {
                sum: {}
            }
            // initalize sum for each property to zero
            _.each(modelView.properties, property => {
                result.sum[property] = 0
            })
            // sum values from all contexts
            _.each(contexts, context => {
                _.each(context.sum, (val, property) => {
                    result.sum[property] += val
                })
            })
            // return result which is sum of sums from multiple contexts
            return result
        },
        pre: function (modelView) {
            ...
        },
        sequential: false,
        type: 'record',
    })

In this example the each and pre functions are the same as the example above
but with the sequential: false option set the execution engine can execute
each functions out-of-order and in parallel.

When sequential: false is set the return value for the view will be an array
of one or more contexts unless a `post` function is specified.

The `post` function takes an array of contexts and performs additional
operations, in this case to create a single object return value with the sums
for all contexts.

## Model View Options

Option Name   | Type    | Description                                |
--------------|---------|--------------------------------------------|
allowOverride | boolean | allow redefining model view with same name |
immutable     | boolean | create immutable function/module/methods   |
meta          | boolean | each function gets record with meta data   |
name          | string  | name of model view                         |
register      | boolean | add model view to global register by name  |
sequential    | boolean | execute each functions in order            |
synchronous   | boolean | each function is async                     |
type          | string  | collection | record                        |

## Model View Functions

Function Name | Description                                             |
--------------|---------------------------------------------------------|
each          | called once for each record in result set               |
post          | called once after all each calls (collection view only) |
pre           | called once before each calls (collection view only)    |