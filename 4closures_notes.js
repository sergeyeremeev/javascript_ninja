// closures can be used to approximate private variables
function Ninja() {
    var feints = 0; // private variable as scope is limited to constructor function
    this.getFeints = function () { // accessor function to get private variable feints value (getter method)
        return feints; // read the private variable
    };
    this.feint = function () { // increment variable for feints value (could be a business method in real-world example)
        feints++;
    };
}

var ninja1 = new Ninja();
ninja1.feint(); // change the private variable via method
assert(ninja1.feints === undefined, "private data is inacessable");
assert(ninja1.getFeints() === 1, "we're able to access the internal faint count");

var ninja2 = new Ninja();
assert(ninja2.getFeints() === 0, "ninja2 gets a separate feints variable");
// the variable is available to methods via closures but not to the code outside the constructor

// another use of closures is with callbacks:
//<div id="box1">First Box</div>
function animateIt(element) {
    var elem = document.getElementById(element);
    var tick = 0;
    var timer = setInterval(function () { // callback to the interval function
        if (tick < 100) {
            elem.style.left = elem.style.top = tick + "px";
            tick++;
        } else {
            clearInterval(timer); // stop the timer after 100 ticks
            assert(tick = 100, "tick accessed via closure");
            assert(elem, "elem accessed via closure");
            assert(timer, "timer reference also obtained via closure");
        }
    }, 10);
}
amimateIt("box1"); // set everything in motion
// three variables must be maintained across the steps of animation, closure makes this possible
// if we had three variables in the global scope (to not rely on closure), we would need three variables for each element's
// animation, otherwise they would step all over each other. Defining variables inside function makes sure that each
// animation gets its own set of variables. Closures make doing multiple things at once much easier, by creating variables
// inside the function we create an implied closure. This values not only can be accessed, but also modified, because
// closure is not just a snapshot of the state of the scope at the moment of function creation, but an active encapsulation
// of that state that we can modify while the closure exists.


// 2 contexts - global execution context and function execution context (created on each function invocation)
// not the same as function context (object on which function is invoked - this);
// when function execution is invoked - current execution context has to be stopped and a new function execution context
// is created. After the function performs its task its context is usually discarded and the caller execution context is
// restored - this is managed by call stack - put new items on top and take items only from the top.
function skulk(ninja) {
    report(ninja + " skulking");
}

function report(message) {
    console.log(message);
}

skulk("Kuma");
// Global execution context -> skulk ex cont -> report ex cont -> skulk ex cont -> global ex cont.

// execution context is vital to the *identifier resolution*. It does it via the *lexical environment* (scopes).

// Lexical environment is an internal JS engine construct used for mapping identifiers to specific variables.
// in es6 lexical environment can be associate with a function, catch part of the try-catch statement and block of code

// on each execution of a function a new function lexical environment is created

// whenever a function is created a reference to the lexical environment in which it was created is stored in an internal
// property (can't access or manipulate it directly) called [[Environment]] (brakets mean internal property).

// function called -> function execution context created and pushed onto the execution context stack, and also a new
// associated lexical environment is created -> JS engine sets the outer environment reference of the newly created lexical
// environment by the called function's internal [[Environment]] property - environment in which the now-called function
// was created.
var ninja = "Muneyoshi";
function skulk() {
    var action = "Skulking";
    function report() {
        var intro = "Aha";
        assert(intro === "Aha", "Local"); // check the environment of the currently running execution context
                                          // report environment has reference to intro - identifier is resolved
        assert(action === "Skulking", "Outer"); // not found in report environment -> check skulk environment -> resolved
    }
}


// 3 ways to define variables: var, let, const - differ in mutability and relationship toward the lexical environment

// const - value can be set only once, we have to provide an initialization value when it's declared, can't assigne a
// completely new value afterward - specify variables that shouldn't be reassigned or referencing a fixed value
// if assigned an object - we can modify this object but can't assign a completely new one, same with arrays;
// global const variables are usually written in uppercase;

// let and const both specify block scoped variables


// execution of JS occurs in 2 phases: first, wheneve a new lexical environment is created - JS engine visits and registers
// all declared variables and function within the current lexical scope, second - JS execution, after everything has been registered

// Details of this process:
// - if creating a function environment - implicit arguments identifier is created along with formal function parameters
// and their argument values; this step is skipped if dealing with non-functional environment;
// - in global or function environment the current code is scanned (not going into bodies of other functions) for function 
// declarations (no expressions or arrow functions), a new function is created for each and bound to identifier in the
// environment with the function's name. If identifier with this name exists - it's overwritten. Step is skipped for block envs;
// - current code is scanned for variable declarations - register let and const variables inside current blocks, register
// var variables outside functions and let/const outside blocks in the current function lexical environment. For each
// discovered identifier if it doesn't exist yet, the identifier is registered and its value assigned to undefined. If
// identifier already exists - it's left with its value.