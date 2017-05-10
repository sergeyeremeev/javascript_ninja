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
