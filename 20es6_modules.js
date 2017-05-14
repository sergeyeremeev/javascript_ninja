// simple syntax, file based, provide support for asynchronous loading.

// only the identifiers explicitly exported from a module are accessible from outside, all other identifiers are accessible
// only from within the module;

// 2 keywords - export and import
// example:
const ninja = "Yoshi"; // top level variable
export const message = "Hello"; // defines and exports variable

export function sayHiToNinja() {
    return message + " " + ninja; // accesses inner module variable from the module's public API
}

// alternative way to export: export { message, sayHiToNinja };

// to import:
import { message, sayHiToNinja } from "Ninja.js";
assert(message === "Hello", "we can access imported variable");
assert(typeof ninja === "undefined", "can't access variable which was not exported/imported");

// to import all exported identifier we can * notation:
import * as ninjaModule from "Ninja.js";
assert(ninjaModule.sayHiToNinja() === "Hello Yoshi", "we can access exported identifiers through property notation");


// Default exports - if we want to represent the whole module through single export:
export default class Ninja {
    constructor(name) {
        this.name = name;
    }
}

export function compareNinjas(ninja1, ninja2) {
    return ninja1.name === ninja2.name;
}

// importing:
import ImportedNinja from "Ninja.js"; // we can name default export whatever we want
import { compareNinjas } from "Ninja.js"; // we can still import named exports
// shorthand:
import ImportedNinja, { compareNinjas } from "Ninja.js";


// Renaming exports and imports:
// Greetings.js
function sayHi() {
    return "Hello";
}

assert(typeof sayHi === "function" && typeof sayHello === "undefined", "we can access only sayHi within the module");

export { sayHi as sayHello }; // the only export way if we want to use an alias for exported identifier

// main.js
import { sayHello } from "Greetings.js";

assert(typeof sayHi === "undefined" && typeof sayHello === "function", "when importing we can only access the alias");

// same with importing:
import { sayHello as greet } from "Greetings.js";
assert(typeof greet === "function", "import alias works in similar way to export alias");
