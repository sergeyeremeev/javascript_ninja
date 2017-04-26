const emperor = { name: "Komei" }; // target object
const representative = new Proxy(emperor, { // Proxy constructor takes in the object the proxy wraps (target object)
    get: (target, key) => {                                  // add an object with traps that will be called when
        report("reading " + key + " through a proxy");       // reading and writing (get/set) to properties.
        return key in target ? target[key]
                             : "Don't bother the emperor";
    },
    set: (target, key, value) => {
        report("Writing " + key + " through a proxy");
        target[key] = value;
    }
});

assert(emperor.name === "Komei", "The emperor's name is Komei");
assert(representative.name === "Komei", "We can get the name property through a proxy");

assert(emperor.nickname === undefined, "Emperor doesn't have a nickname");
assert(representative.nickname === "Don't bother the emperor", "proxy jumps in when we make inproper requests");

representative.nickname = "Tenno"; // add a property through the proxy activates set trap
assert(emperor.nickname === "Tenno", "emperor now has a nickname");
assert(representative.nickname === "Tenno", "nickname is also accessible through the proxy");

// other traps include:
// - apply - when calling a function; - construct - when using the new operator;
// - get - reading; - set - writing;
// - enumerate - activated for for-in loops;
// - getPrototypeOf/setPrototypeOf - activated for getting and setting the prototype value;

// * comparing 2 objects should always return the same value, however if the value is determined by user-specified function,
// we can't guarantee that this value will always be the same. Also, we shouldn't give access to any object, but this would
// be the case if equality could be trapperd -> therefore we can't override equality operator;
// We also can't override instanceof and typeof operators.


// logging with proxies:
// proxies allow to take away loggin logic from the getter/setter and prevent us from forgetting to add logging if more
// properties are added in the future, thus providing a much cleaner way of logging, which is specified once and in one place:
function makeLoggable(target) {
    return new Proxy(target, {
        get: (target, property) => {
            report("reading " + property);
            return target[property];
        },
        set: (target, property, value) => {
            report("writing value " + value + " to " + property);
            target[property] = value;
        }
    });
}

let ninja = { name: "Yoshi" };
ninja = makeLoggable(ninja); // setting ninja to proxy wrapping ninja object, ninja is kept alive as the target of proxy
assert(ninja.name === "Yoshi", "Our ninja is Yoshi"); // reads from proxy object -> action logged
ninja.weapon = "sword"; // writes to proxy object -> action logged by proxy trap

// measuring performance with proxies:
function isPrime(number) {
    if (number < 2) { return false; }
    for (let i = 2; i < number; i++) {
        if (number % i === 0) { return false; }
    }
    return true;
}

isPrime = new Proxy(isPrime, {
    apply: (target, thisArg, args) => {
        console.time('isPrime');
        const result = target.apply(thisArg, args);
        console.timeEnd('isPrime');
        return result;
    }
});
isPrime(231525);

// autopopulate properties with proxies:
function Folder() {
    return new Proxy({}, {
        get: (target, property) => {
            report("reading " + property);

            if (!property in target) {
                target[property] = new Folder(); // create new property if it doesn't exist
            }

            return target[property];
        }
    });
}

const rootFolder = new Folder();

try {
    rootFolder.ninjasDir.firstNinjaDir.ninjaFile = "yoshi.txt"; // get trap which creates a property if it doesn't exist is activated
    pass("An exception didn't occur");
} catch(e) {
    fail("An exception did occur");
}

// negative array indexes with proxies:
function createNegativeArrayProxy(array) {
    if (!Array.isArray(array)) {
        throw new TypeError("Expected an array");
    }

    return new Proxy(array, {
        get: (target, index) => {
            index = +index;
            return target[index < 0 ? target.length + index : index];
        },
        set: (target, index, value) {
            index = +index;
            return target[index < 0 ? target.length + index : index] = value;
        }
    });
}

const ninjas = ["Yoshi", "Kama", "Hattori"];
const proxiedNinjas = createNegativeArrayProxy(ninjas);
assert(proxiedNinjas[-2] === "Kama", "accessing negative indexed array items");

// * proxies add a layer of indirection - additional amount of processing that impacts performance:
function measure(items) {
    const startTime = new Date().getTime();
    for (let i = 0; i < 500000; i++) {
        items[0] === "Yoshi";
        items[1] === "Kama";
        items[2] === "Hattori";
    }
    return new Date().getTime() - startTime;
}

console.log("Proxies are roughly " + Math.round(measure(proxiedNinjas) / measure(ninjas)) + " times slower.");
// chrome currently shows that proxied version is 32 times slower!