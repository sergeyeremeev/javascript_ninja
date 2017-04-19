// generator is a function that generates a sequence of values on a per request basis. After value is produced a generator
// is suspended until a further request.
function* WeaponGenerator() {
    yield "Katana"; // generator executes it's code until it reaches yield keyword that produces intermediary result
                    // and returns a new object that encapsulates this result and tells us whether its work is done.
                    // the execution is paused without blocking. generator waits for another value request.
    yield "Wakizashi";
    yield "Kusarigama";
}

for (let weapon of WeaponGenerator()) { // new for of loop to work with generators is one way of getting values from it
    assert (weapon !== undefined, weapon);
}

// calling a generator doesn't execute a function, instead it creates an iterator object through which we can communicate
// with the generator
function* WeaponGenerator() {
    yield "Katana";
    yield "Wakizashi";
}

const weaponsIterator = WeaponGenerator(); // calling generator creates an iterator through which we can control the
                                           // generator's execution
const result1 = weaponsIterator.next(); // call next() method to request a new value from the generator
assert(typeof result1 === "object" && result1.value === "Katana" && !result1.done, "Katana received!");
// result is an object with a returned value and an indicator telling us that the generator has more values

const result2 = weaponsIterator.next();
assert(typeof result2 === "object" && result2.value === "Wakizashi" && !result2.done, "Wakizashi received");
// get another value from the generator

const result3 = weaponsIterator.next();
assert(typeof result3 === "object" && result3.value === undefined && result3.done, "No more results!");
// when there is no more code to execute, the generator returnes "undefined" and indicates that it's done

// iterating over the generator results
function* WeaponGenerator() {
    yield "Katana";
    yield "Wakizashi";
}

const weaponsIterator = WeaponGenerator();
let item;
while (!(item = weaponsIterator.next()).done) {
    assert(item !== null, item.value);
}

// instead of manually calling the iterator's next() method to check whether we are finished, we can use for... of loop
for (item of WeaponGenerator()) {
    assert(item !== null, item);
}

// we can also yield to another generator to delegate all next() method calls to another generator by using yield*:
function* WarriorGenerator() {
    yield "Sun Tzu";
    yield* NinjaGenerator();
    yield "Genghis Khan";
}

function* NinjaGenerator() {
    yield "Hattori";
    yield "Yoshi";
}

for (let warrior of WarriorGenerator()) {
    assert(warrior !== null, warrior); // "Sun Tzu", "Hattori", "Yoshi", "Genghis Khan"
}




// A promise is a placeholder for a value we don't have, but will have later.
const ninjaPromise = new Promise((resolve, reject) => { // we pass an *executor* function to the Promise constructor
                                                        // with two parameters - resolve and reject. Executor is called
                                                        // immediately when constructing a promise
    resolve("Hattori"); // promise is resolved by calling the passed-in resolve function or rejected by calling reject fn.
    // reject("An error resolving a promise!");
});

ninjaPromise.then(ninja => { // by using then() method we can pass 2 callbacks, the first is called if the promise is 
                             // successfully resolved.
    assert(ninja === "Hattori", "We were promised Hattori!");
}, err => { // the second is called if an error occurs
    fail("There shouldn't be an error");
});


// Problems with callbacks:
// - difficult error handling
// can't use try-catch statements like:
try {
    getJSON("data/ninjas.json", function () {
        // handle results
    });
} catch(e) { /* handle results */ }
// because code invoking the callback usually isn't executed in the same step of the event loop as the code that starts
// the long running task, as a result - errors usually get lost

// - pyramid of doom
// sometimes you want to execute another long running task after obtaining data from the first one, and then another:
getJSON("data/ninjas.json", function (err, ninjas) {
    getJSON(ninjas[0].location, function (err, locationInfo) {
        sendOrder(locationInfo, function (err, status) {
            // and so on
        })
    })
});
// performing sequences of steps is tricky, error handling complicates the code significantly

// - performing steps in parallel is tricky
// if we want to fetch few pieces of data in parallel, after receiving each one we would have to check that the other
// data has already arrived, because we don't know the order in which these pieces will be downloaded

// many libraries try to solve these problems, promises provide a standardised approach.
