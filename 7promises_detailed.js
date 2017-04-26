// A promise is an object that serves as a placeholder for a result of an asynchronous task
// Promise starts in an unresolved state - pending - then becomes either fulfilled or rejected (both are resolved states)
// depending on whether we resolve() or reject() it. Promise in resolved state can't switch between fulfilled or rejected
// states - once it's resolved, it's resolved for good.

// promise order of execution:
report("At code start");

var ninjaDelayedPromise = new Promise((resolve, reject) => { // executor function called immediately
    report("ninjaDelayedPromise executor");
    setTimeout(() => {
        report("Resolving ninjaDelayedPromise");
        resolve("Hatori");
    }, 500);
});

assert(ninjaDelayedPromise !== null, "After creating ninjaDelayedPromise");

ninjaDelayedPromise.then(ninja => {
    assert(ninja === "Hatori", "ninjaDelayedPromise resolve handled with Hatori");
});

const ninjaImmediatePromise = new Promise((resolve, reject) => { // executor function called immediately
    report("ninjaImmediatePromise executor. Immediate resolve");
    resolve("Yoshi");
});

ninjaImmediatePromise.then(ninja => {
    assert(ninja === "Yoshi", "ninjaImmediateResolve resolve handled with Yoshi");
});
// promise already settled by the time we call then() method to register a callback - is the callback immediately called
// or is it ignored? NEITHER! JS engine ALWAYS resotrs to asynchronous handling to make the promise behavior predictable,
// so then() callbacks are executed after all the code in the current step of the event loop are executed

report("At code end");

// Results in the following order:
// - "At code start"
// - "ninjaDelayedPromise executor"
// - "After creating ninjaDelayedPromise"
// - "ninjaImmediatePromise executor. Immediate resolve"
// - "At code end"
// - "ninjaImmediateResolve resolve handled with Yoshi"
// - "Resolving ninjaDelayedPromise"
// - "ninjaDelayedPromise resolve handled with Hatori"


// Rejecting promises - explicitly by calling passed-in reject method, or implicitely - if during the handling of a 
// promise and unhandled exception occurs
const promise = new Promise((resolve, reject) => {
    reject("Explicitly rejected promise!"); // explicitly rejecting a promise with a passed-in reject function.
});

promise.then(
    () => fail("Happy path, won't be called"),
    error => pass("A promise was explicitly rejected") // if the promise is rejected the error callback is invoked
);

// we can also use the catch method to handle promise rejection:
promise.then(() => fail("Happy path, won't be called"))
       .catch(() => pass("Promise was also rejected")); // instead of the second, error, callback we can chain the catch
                                                        // method and pass it to the error callback.

// implicit rejection
const promise2 = new Promise((resolve, reject) => {
    undeclaredVariable++; // undeclared variable with no try catch statement results in implicitly rejecting the promise
});

promise2.then(() => fail("Happy path, won't be called"))
        .catch(error => pass("Third promise is also rejected"));


// Creating a JSON promise:
function getJSON(url) {
    return new Promise((resolve, reject) => { // create and return a new promise
        const request = new XMLHttpRequest(); // create and XMLHttpRequest object

        request.open("GET", url); // initialize the request

        request.onload = function () { // register onload handler that will be called if the server responds
            try { // try-catch statement to make sure the JSON is properly parsed - saves from JSON syntax errors
                if (this.status === 200) {
                    resolve(JSON.parse(this.response)); // parse the JSON string; if succeeds - resolve promise with parsed object
                } else {
                    reject(this.status + " " + this.statusText); // reject if different status
                }
            } catch(e) {
                reject(e.message); // reject if there is an exception parsing the JSON string
            }
        };

        request.onerror = function () { // reject if there is an error in communication with the server
            reject(this.status + " " + this.statusText);
        };

        request.send(); // send the request
    });
}

getJSON("data/ninjas.json").then(ninjas => { // use created promise to register resolve and reject callbacks
    assert(ninjas !== null, "ninjas obtained!");
}).catch(e => fail("shouldn't be here: " + e));


// Chaining promises - calling the then() method doesn't only register a callback which will be executed if a promise
// is successfully resolved, but also returns a new promise, which allows us to chain then() methods:
getJSON("data/ninjas.json")
    .then(ninjas => getJSON(ninjas[0].missionsUrl))
    .then(missions => getJSON(missions[0].detailsUrl))
    .then(mission => assert(mission !== null, "Ninja mission obtained"))
    .catch(error => fail("Ar error has occured"));
// if we only care about success vs fail - we don't need an error callback for each step, which would be tideous to write
// instead we can chain the catch() method which will ba called if an error in any step occurs.


// Waiting for multiple promises with Promise.all:
Promise.all([getJSON("data/ninjas.json"), // pass an array of promises to Promise.all method
             getJSON("data/mapInfo.json"), // a new promise is created that succeeds if all promises have succeeded
             getJSON("data/plan.json")]).then(results => { // result is an array of succeed values in the right order
                 const ninjas = results[0], mapInfo = results[1], plan = results[2];

                 assert(ninjas !== undefined && mapInfo !== undefined && plan !== undefined,
                    "The plan is ready to be set in motion!");
             }).catch(error => {
                 fail("An error has occured");
             });

// Waiting for the first promise to resolve with Promise.race:
Promise.race([
    getJSON("data/yoshi.json"),
    getJSON("data/hatori.json")
]).then(ninja => {
    assert(ninja !== null, ninja.name + " responded first");
}).catch(error => fail("Failure!"));