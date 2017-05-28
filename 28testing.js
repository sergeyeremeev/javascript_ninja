// Normal browser debugging consists of logging and breakpoints:
// Logging allows to output messages containing information about the current state of the program without impeding the
// normal flow of the application (console.log);
// Breakpoints allow to completely pause/freeze the application at a certain position and to explore all aspects of its
// current state. We can also do things like stepping into a function, step over and step out of the function. Especially
// useful are the conditional breakpoint which trigger only if a certain condition is met, for example a certain value
// of iterator in a long for-loop.

// Test:
// Tests should possess three important characteristics:
// - Repeatability - tests should be highly reproducible and should produce the same results when run repetitively (this
// also ensures against dependency on external factors);
// - Simplicity - each test should test only ONE thing;
// - Independence - tests should execute in isolation, results of one test must not depend on another one. Tests should
// be broken into as small piece of unit as possible;

// Two primary test construction approaches:
// - Deconstructive test cases - code is deconstructed to eliminate anything not related to the issue, thus isolating the
// problem. This achieves three characteristics outlined above;
// - Constructive test cases - start from a working code and build up until non-working code is reached, ie until we can
// reproduce the bug. We need a couple of simple test files from which to build up tests and a way to generate these new
// tests with a clean copy of our code.

// Tests should cover all the little details of our application, that's why we need automated testing;

// Testing framework starts with an assertion:
// a method, usually named *assert* or similar takes a value and a description of the purpose of the assertion. If the
// value evaluates to true - the assertion passes and the description message is logged with the pass identifier

// simple JS assertion implementation:
function assert(value, desc) {
    var li = document.createElement('li');
    li.className = value ? 'pass' : 'fail';
    li.appendChild(document.createTextNode(desc));
    document.getElementById('results').appendChild(li);
}

window.onload = function () {
    assert(true, 'The test suite is running');
    assert(false, 'Fail!');
};

// <style>#results li.pass { color: green; } #results li.fail { color: red; }</style>
// <body><ul id="results"></ul></body>


// for a quick solution the console.assert() method can be used:
console.assert(true, 'This assertion passes');
console.assert(false, 'This assertion fails'); // a message will be logged to the console


// QUnit
// Originally build to test jQuery. Distinguishable features:
// - Simple API;
// - Support asynchronous testing;
// - Well suited for regression testing;

// Example:
// <script src="qunit/qunit-git.js"></script>
// <body><div id="qunit"></div>
function sayHiToNinja(ninja) {
    return "Hi " + ninja;
}

QUnit.test("Ninja hello test", function (assert) { // specify QUnit test case
    assert.ok(sayHiToNinja('Hattori') == 'Hi Hattori', 'Passed'); // test a passing assertion
    assert.ok(false, 'Failed'); // test a failing assertion
});


// Jasmine
// Principal parts:
// - describe function describing the test suites
// - it function specifying individual tests
// - expect function checking individual assertions

// Example:
// <link rel="stylesheet" href="lib/jasmine-2.2.0/jasmine.css">
// <script src="lib/jasmine-2.2.0/jasmine.js"></script>
// <script src="lib/jasmine-2.2.0/jasmine-html.js"></script>
// <script src="lib/jasmine-2.2.0/boot.js"></script>

// use same function from above

describe('Say Hi Suite', function () { // define a test suite with a name 'Say Hi Suite'
    it('should say hi to a ninja', function () { // single test checking our function
        expect(sayHiToNinja('Hattori')).toBe('Hi Hattori'); // truthy assertion
    });

    it('should fail', function () {
        expect(false).toBe(true); // fails on purpose
    })
});


// To test code coverage of the test suites several libraries can be used, for examle:
// - Blanket.js;
// - Instabul
