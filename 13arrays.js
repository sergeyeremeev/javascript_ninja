// Array constructor like almost anything else in JavaScript can be overwritten. Array literals also provide better readability
// trying to access an item out of bounds returns undefined because arrays are objects in JavaScript
const ninjas = ["Yoshi", "Hattori", "Ishi"];
assert(ninjas[4] === undefine, 'nothing at index 4 of ninjas array');
ninjas[4] = "Yagyu"; // extended array to length 5, ninjas[3] is undefined
assert(ninjas[3] === undefined, "proved point");
ninjas.length = 7; // created 2 more items with value set to undefined
ninjas.length = 2; // trimmed ninjas array to 2 items

// standard methods: push, pop, unshift, shift
const ninjas = [];
ninjas.push("Hattori"); // ["Hattori"]
ninjas.unshift("Yoshi"); // ["Yoshi", "Hattori"]
ninjas.unshift("Yagyu"); // ["Yagyu", "Yoshi", "Hattori"]
const lastNinja = ninjas.pop();
const firstNinja = ninjas.shift();
ninjas.length === 1; // ninjas === ["Yoshi"];

// unshift and shift affect first item of the array -> all subsequent indexes have to be changed -> much slower than
// push and pop methods

// deleting an item from an array with delete creates a hole in it:
ninjas.push("Yoshi"); // ["Hattori", "Yoshi"]
delete ninjas[0];
ninjas.length === 2; // [undefined, "Yoshi"]

// use splice for adding and removing array items, splice also returns a new array of removed items:
const ninjas = ["Yagyu", "Kuma", "Hattori", "Fuma"];
let removedItems = ninjas.splice(1, 1); // ["Kuma"] - start at index 1, remove 1 items (1, 1)
removedItems = ninjas.splice(1, 2, "Mochizuki", "Yoshi", "Momochi"); // ninjas === ["Yagyu", "Mochizuki", "Yoshi", "Momochi"]
                                                                     // removedItems === ["Hattori", "Fuma"]


// Common operations:
// - iterating:
// for-loops can be substituted with forEach
ninjas.forEach(ninja => { // instead of for (let i = 0; i < ninjas.length; i++)
    assert(ninja !== null, ninja);
});

// - mapping (extracting certain object field example):
const ninjas = [
    {name: "Yoshi", weapon: "shuriken"}, {name: "Yagyu", weapon: "katana"}, {name: "Kuma", weapon: "wakizashi"}
];

const weapons = ninjas.map(ninja => ninja.weapon);
assert(weapons[0] === "shuriken" && weapons[1] === "katana" && weapons[2] === "wakizashi" && weapons.length === 3, "success");
// map constructs a new array and iterates over the input array. For each item in the input array, map places 1 item in new array.

// - testing array items:
const allNinjasAreNamed = ninjas.every(ninja => "name" in ninja); // every method takes a callback that's called for each
                                                                  // item of the array. True if callback returns true for
                                                                  // every item of the array. If one callback returns false
                                                                  // subsequent items are not examined

const someNinjasAreArmed = ninjas.some(ninja => "weapon" in ninja); // true if callback returned true for at least one item
                                                                    // if one callback returns true, subsequent items are
                                                                    // not examined

// - search arrays:
const ninjaWithWakizashi = ninjas.find(ninja => { // finds the first item which satisfies the callback's condition
    return ninja.weapon === "wakizashi"; // if no items satisfy condition - returns undefined
});

const ninjasWithWeapons = ninjas.filter(ninja => "weapon" in ninja); // finds all items that satisfy callback's condition
                                                                     // and returns them as a new array (empty array if none)

// - finding array indexes:
const yoshiIndex = ninjas.findIndex(ninja => ninja === "Yoshi"); // returns index of the first matching item, useful when
                                                                 // we don't have reference to the exact item of interest
assert(ninjas.indexOf("Yoshi") === 0, "also returns index of the first matching item");
assert(ninjas.lastIndexOf("Kuma") === 2, "returns the last index of matching item"); // useful for getting the last item
                                                                                     // if there are multiple matches

// - sorting arrays:
ninjas.sort((a, b) => a - b); // compares 2 items. if the result of return statement is less than 0 -> a should come before b
                              // if the result of the return statement is 0 -> a and b are equal in sorting algorithm's view
                              // if the result of the return statement is more than 0 -> a should come after b

ninjas.sort((ninja1, ninja2) => {
    if (ninja1.name < ninja2.name) { return -1; }
    if (ninja1.name > ninja2.name) { return 1; }
    return 0;
});

// - aggregating array items
const numbers = [1, 2, 1, 5];
const sum = numbers.reduce((aggregated, number) => aggregated + number, 0);
assert(sum === 9, "reduce takes in the initial value and calling the callback on each item with the result of previous" +
    "previous callback invokation.");


// reusing built-in array functions:
// simulating array-like methods:
const elems = {
    length: 0, // array needs a place to store the number of items it's storing. Tricking methods to think it's an array
    add: function (elem) {
        Array.prototype.push.call(this, elem); // use array method to add elements to the object
    },
    gather: function (id) {
        this.add(document.getElementById(id)); // use previously implemented add method
    },
    find: function (cb) {
        return Array.prototype.find.call(this, cb); // use array find method to query object properties
    }
};

elems.gather('some-element-id');
elems.find(elem => elem.id === 'some-element-id');