// functions are first-class objects (citizens), can be assigned to variables, return from other functions, passed around, etc

// ability to create function anywhere an expression can appear

// example: sorting algorythm:
var values = [1, 5, 0, 34, -4, 3];
values.sort(function (val1, val2) { // callback function passed to sort function
    return val1 - val2; // positive - order reversed, negative - stays the same, 0 - values are equal
});

// can attach properties to functions
var speak = function () {};
speak.type = "shout";
// can be used to store functions in a collection - managing related functions, callbacks that have to be invoked when
// something of interest occurs;
// memoization - allows the function to remember previously computed values, improving performance of subsequent invocations

// Storing functions in a collection:
// check that it doesn't already exist - storing all functions in an array and looping performs very poorly, instead use
// function properties:
var store = {
    nextId: 1,
    cache: {},
    add: function (fn) {
        if (!fn.id) {
            fn.id = this.nextId++;
            this.cache[fn.id] = fn;
            return true;
        }
    }
};

function ninja() {};
assert(store.add(ninja), "function was safely added");
assert(!store.add(ninja), "but it can only be added once");

// Memoization (storing previously computed values):
// example: prime values
function isPrime(value) {
    if (!isPrime.answers) {
        isPrime.answers = {}; // create the cache as a property of the function
    }

    if (isPrime.answers[value] !== undefined) {
        return isPrime.answers[value]; // return if answer already exists without additional computations
    }

    var prime = value !== 1; // 1 is not a prime

    for (var i = 2; i < value; i++) {
        if (value % i === 0) {
            prime = false;
            break;
        }
    }

    return isPrime.answers[value] = prime; // store the computed value (true/false)
}
assert(isPrime(5), "5 is prime!");
assert(isPrime.answers[5], "the answer was cached!");
// increases performance, cache property is kept alive for as ling as the function is alive

// however such caching:
// - sacrifices memory in terms of performance;
// - caching is a concern that ideally shouldn't be mixed with business logic;
// - difficult to load-test or measure performance as results depend on previous inputs;


// functions expressions are functions that are part of another statement - useful as we can define them exactly where we need
// they are always placed on the expression level (like RHS references).

// for declarations function name is mandatory - for expressions it's not

// a parameter is a variable we list as part of function definition (declaration);
// an argument is a value that we pass to the function when invoking it;

// when a list of arguments is passed during function invokation, arguments are assigned to the parameters of the function
// definition in the same order;

// excess arguments are not assigne to parameters, if there are less arguments, undefined will be assigned to parameters
// for which arguments were not provided - no error raised in both cases;

// rest parameters:
function multiMax(first, ...remaining) {
    const sorted = remaining.sort((a, b) => b - a);
    return sorted[0] * first;
}
assert(multiMax(3, 1, 2, 3, 5) === 15, "3*5 = 15, first arg by largest");

// default parameters - no function overloading like in other languages - old style solution:
function performAction(ninja, action) {
    action = typeof action === "undefined" ? "skulking" : action;
    return ninja + " " + action;
}

// es6 approach
function performAction(ninja, action = "skulking") {
    return ninja + " " + action;
}
// evaluated from left to right, so even other previous parameters can be assigned to default parameters
function performAction(ninja, action = "skulking", message = ninja + " " + action) { // although should be avoided
    return message;
}