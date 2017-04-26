// Example - generating unique ids using generators instead of global counter variable, which can get messed up from
// anywhere in the code:
function* IdGenerator() {
    let id = 0;
    while (true) { // infinite loop is not dangerous inside generator as we produce only 1 value (1 iteration) per request
        yield ++id;
    }
}

const idIterator = IdGenerator();

const ninja1 = { id: idIterator.next().value };
const ninja2 = { id: idIterator.next().value };

assert(ninja1.id === 1, "First ninja has id 1");
assert(ninja1.id === 2, "First ninja has id 2");


// traversing the DOM:
// old way:
function traverseDOM(el, cb) {
    cb(el); // process the current node with a callback
    el = el.firstElementChild;
    while (el) {
        traverseDOM(el, cb); // recursive call to a function to traverse all descendants of the element
        el = el.nextElementSibling;
    }

    const subTree = document.getElementById('subTree');
    traverseDOM(subTree, function (el) {
        assert(el !== null, el.nodeName);
    });
}

// generators solution:
function* DomTraversal(el) {
    yield el;
    el = el.firstElementChild;
    while (el) {
        yield* DomTraversal(el); // transfer the iteration control to another instance of DomTraversal generator
        el = el.nextElementSibling;
    }
}

const subTree = document.getElementById('subTree');
for (let el of DomTraversal(subTree)) {
    assert(el !== null, el.nodeName);
}
// we create one generator function for each visited node and yield to it
// * for-of loop iterates until the generator says it's done (no more code or a return statement) WITHOUT including the
// value passed along with done (if we used while loop, the while (!done) would evaluate to false).


// Communicating with generator:
function* NinjaGenerator(action) {
    const imposter = yield ("Hattori " + action); // by yielding a value generator returns an intermediary calculation.
                                                  // by calling iterator's next() method with an argument - we send data
                                                  // back to the generator.
    assert(imposter === "Hanzo", "The generator has been infiltrated"); // calling next() the second time with "Hanzo"
                                                                        // passed as an argument, which becomes the value
                                                                        // of the yielded expression

    yield ("Yoshi (" + imposter + ") " + action);
}

const ninjaIterator = NinjaGenerator("skulk"); // generator can receive arguments like any other function

const result1 = ninjaIterator.next(); // request the first value from the generator
assert(result1.value === "Hattori skulk", "Hattori is skulking");

const result2 = ninjaIterator.next("Hanzo"); // request the second value AND send the argument into generator, which will
                                             // be used as the value of the whole yield expression.
assert(result2.value === "Yoshi (Hanzo) skulk", "We have an imposter!");

// you send the data to the waiting yield expression, if none is waiting - you can't pass value - that's why you can't
// pass an argument to the first call to the next() method. For initial value use function parameter.


// throwing exceptions to generators:
function* NinjaGenerator() {
    try {
        yield "Hattori";
        fail("The expected exception didn't occur"); // fail shouldn't be reached
    } catch(e) {
        assert(e === "Catch this!", "We caught an exception");
    }
}

const ninjaIterator = NinjaGenerator();

const result1 = ninjaIterator.next();
assert(result1.value() === "Hattori", "We got Hattori");

ninjaIterator.throw("Catch this!"); // throws exception to the generator


// Generator steps:
const ninjaIterator = NinjaGenerator(); // create a new generator -> Suspended Start State;
const result1 = ninjaIterator.next(); // activate generator -> move to Executing State -> execute up to yield "Hattori"
                                      // move to Suspended Yield State -> return new object { value: "Hattori", done: false }
const ninja2 = ninjaIterator.next(); // reactivate generator -> move to Executing State -> execute up to yield "Yoshi"
                                     // move back to Suspended Yield state -> return new object { value: "Yoshi", done: false }
const result3 = ninjaIterator.next(); // reactivate generator -> Executing State -> no more code to execute -> move to
                                      // Completed State -> return new object { value: undefined, done: true }

// Suspended Start - Executing - Suspended Yield - Executing - Completed


// Execution context:
const ninjaIterator = NinjaGenerator(); // - new stack item is created and placed at the top of the stack
                                        // at the same time a new ninjaIterator object is created with a reference to
                                        // the current generator context stack item

                                        // the NinjaGenerator is then popped from the stack, but unlike normal functions
                                        // is kept alive through the ninjaIterator object, which references its context

const result1 = ninjaIterator.next(); // reactivates the matching execution context (NinjaGenerator) and places in on top
                                      // of the stack (doesn't create a new context like normal functions) continuing
                                      // execution where it left off.

                                      // As it reaches the yield expression, it gets taken off the execution context stack
                                      // but is kept alive via ninjaIterator object reference.

// if generator function encounters a return statement, it returns the value and completes generator's execution by moving
// the generator into the Completed state.