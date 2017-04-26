// functions invocations are passed 2 additional parameters implicitely - arguments and this

// arguments - collection of arguments passed to a function. We can access all arguments even if matching parameters are
// not defined. This makes functions overloading possible. However the need for arguments parameter has been reduced with
// introduction of rest parameters. arguments is an array-like construct.

// example - calculate sum of arbitrary number of arguments:
function sum() {
    var sum = 0;
    for (var i = 0; i < arguments.length; i++) {
        sum += arguments[i];
    }

    return sum;
}

assert(sum(1, 2, 3, 4, 5) === 15, "It works!");

// es6
function sum(...values) {
    return values.reduce((a, b) => a + b, 0);
}

// arguments object is alias to function parameters - reassigning either one reflects on the other
// strict mode disables this aliasing


// this refers to an object which is associated with function's invocation
// for all, except explicit binding (.call and .apply methods), function invocation operator is a set of paretheses,
// following by expression which evaluates to function reference

// Invocations:
// - as a function - invoked with () operator and expression to which operator is applied doesn't reference the function
                    // as the property of an object - IIFE also invoked as functions => Default binding rule;
                    // *top-level functions (and properties) - not associated with any object;
// - as a method - object becomes the function context and this inside the function points at it => implicit binding;
// - as a constructor function (don't confuse with function constructor - new Function('a', 'b', 'return a + b'), which
// enables to construct new functions from strings). constructor functions are used to create and initialize object instances.
// new object is created -> passed to constructor as this parameter, becoming constructor's function context -> properties
// are added to this object -> this object is returned as the *new* expression;
// * if constructor function returns another object - that object will be returned as the *new* expression, and the newly
// created object passed as this to the constructor will be discarded; if constructor returns a non-object - the returned
// value is ignored and the newly created object is returned;
// - via function call/apply methods -> explicitely specify context and arguments => explicit binding;

// simple forEach implementation:
function forEach(list, callback) {
    for (var n = 0; n < list.length; n++) {
        callback.call(list[n], n); // set current item as the context of the function call
    }
}

var weapons = [{ type: 'shuriken' },
               { type: 'katana' },
               { type: 'nunchuks' }];

forEach(weapons, function (index) {
    assert(this === weapons[index], "got expected value of " + weapons[index].type);
});

// * constructor functions are named as a noun with first capital letter; normal function named as verbs lowercase;


// Solving binding issues:
// Arrow functions don't have thei own this value, instead they remember the value of this parameter at the time of definition:

// <button id="test">Click me!</button>
function Button() {
    this.clicked = false;
    this.click = () => { // arrow function - no implicit this parameter, therefore this is the newly constructed object
        this.clicked = true;
        assert(button.clicked, "The button has been clicked!");
    };
}

var button = new Button();
var elem = document.getElementById('test');
elem.addEventListener('click', button.click); // works now, because this value on line 71 is preserved

// if we change constructor function with an object literal this now refers to the scope in which the object literal was
// defined, which is global (window), and this in arrow function also refers to global object:
var button = {
    clicked: false,
    click: () => {
        this.clicked = true;
        assert(button.clicked, "The button has been clicked!"); // fails
        assert(this === window, "in arrow function this === window");
        assert(window.clicked, "clicked is stored in window");
    }
};

// bind is another way to solve the problem, it's designed to create and return a new function that is bound to the passed
// in object. this will always be set to the passed in object.
elem.addEventListener('click', button.click.bind(button)); // this will point at button object
// it doesn't modify the original function, but create a new one
var boundFn = button.click.bind(button);
assert(boundFn !== button.click, "Calling bind creates a new function!");