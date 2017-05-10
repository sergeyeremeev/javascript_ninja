// 2 types of scope - global and function;

// each module should:
// - define an interface -> through which we can access functionality offered by module
// - hide module internals -> protect them from modifications from outside + hiding unimportant information from user


// specifying modules using objects, closures and immediate functions:
// calling a function creates a new scope in which variables are only visible within the current function -> hiding;
// by returning an object we make a public interface for our module.

// simple example:
(function countClicks() {
    let numClicks = 0; // local variable which will store clicks value
    document.addEventListener("click", () => {
        alert(++numClicks); // click counter is incremented on each click
    });
})();
// numClicks is kept alive through the closure of the click handler function and can be referenced only within the click
// handler and nowhere else;
// countClicks is called only in this one place;

// module pattern: augmenting function as modules with objects as interfaces
const MouseCounterModule = function () {
    let numClicks = 0; // "private" module variable. kept alive via closures created by the interface
    const handleClick = () => { // "private" module function
        alert(++numClicks);
    };

    return { // returns an object representing module's interface
        countClicks: () => {
            document.addEventListener("click", handleClick);
        }
    };
}();

assert (typeof MouseCounterModule.countClicks === "function" && typeof MouseCounterModule.numClicks === "undefined",
    "We can access module functionality, but can't access internal module details");
// this is known as module pattern popularized by Douglas Crockford

// augmenting modules:
(function (module) {
   let numScrolls = 0;
   const handleScroll = () => {
       alert(++numScrolls);
   };

   module.countScrolls = () => { // extend the module interface
       document.addEventListener("wheel", handleScroll);
   }
})(MouseCounterModule); // pass in the module we want to extend

assert (typeof MouseCounterModule.countScrolls === "function", "we can access augmented module functionality");


// AMD (Asynchronous module definition) and CommonJS
// AMD was designed explicitly with browser in mind; CommonJS - general-purpose environment (eg, servers with Node.js)
// without being bound to the browser's limitations

// currently RequireJS is the most popular AMD implementation
// example:
define('MouseCounterModule', ['jQuery'], $ => { // uses define function to specify a module, its dependencies and module
                                                // factory function that will create the module
    let numClicks = 0;
    const handleClick = () => {
        aleart(++numClicks);
    };

    return {
        countClicks: () => {
            $(document).on("click", handleClick);
        }
    };
});
// *define* function accepts the ID of the newly created module, which can be later required by other parts of the application,
// list of module IDs on which current module depends (required modules) and a factory function which will initialize the
// module and which accepts the required modules as arguments.
// module factory function is called after all required modules have been loaded.

// AMD offers:
// - automatic resolving of dependencies, so we don't have to think about the order in which we include our modules
// - modules can be asynchronously loaded which helps to avoid blocking
// - multiple modules can be defined in one file


// CommonJS
// Its biggest following is in the Node.js community;
// file-based modules -> one module per file;
// variable *module* with a property *exports* for each module -> module.exports is module's public interface;

// example:
//MouseCounterModule.js
const $ = require('jQuery'); // synchronously require jQuery
let numClicks = 0;
const handleClick = () => {
    alert(++numClicks);
};

module.exports = { // modifies module.exports property to specify the public interface of a module
    countClicks: () => {
        $(document).on('click', handleClick);
    }
};

// to include it in a different file:
const MouseCounterModule = require('MouseCounterModule.js');
MouseCounterModule.countClicks();

// 1 module per file means that any code in the file is part of the module - no need to wrap variables in immediate function
// only contents of module.exports are available from outside

// CommonJS has simple syntax and is default module format for Node.js with access to thousands of packages from npm.
// no support for the module variable and export property in a browser -> have to package CommonJS modules either with
// Browserify or RequireJS. Alternative is to use UMD, which allows the file to be used by both, AMD and CommonJS.
