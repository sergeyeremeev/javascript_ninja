// example - creating translations for different languages (object approach):
const dictionary = {
    "ja": {
        "Ninjas for hire": "レンタル用の忍者"
    },
    "zh": {
        "Ninjas for hire": "忍者出租"
    },
    "ko": {
        "Ninjas for hire": "고용 닌자"
    }
};
// what if we need translation for the word constructor, which we forgot to define:
assert(typeof dictionary.ja["constructor"] === "undefined", dictionary.ja["constructor"]); // function Object() {[...]}
// however the above line logs function Object() {[native code]}, because all objects have Prototypes with constructor
// property, which is what is being logged in this case!

// also with objects keys can only be string values, mapping to other values, will implicitly convert it to string
const firstElement = document.getElementById("firstElement");
const secondeElement = document.getElementById("secondName");

const map = {}; // object that we will use as a map to store additional information about html elements

map[firstElement] = { data: "firstElement" };
assert(map[firstElement].data === "firstElement", "the first element is correctly mapped");

map[secondeElement] = { data: "secondElement" };
assert(map[secondeElement].data === "secondElement", "the second element is correctly mapped");

assert(map[firstElement].data === "firstElement", "This no longer works!!!"); // the first element mapping was overridden

// this happens because when we use non-string values as object properties, they are implicitly converted to strings
// with .toString() method, which results in "[object HTMLDivElement]" in this case. So we set to the same property both
// times, as both html objects get converted to the same string value.

// Maps to the rescue:
const ninjaIslandMap = new Map(); // Map constructor to create a map

const ninja1 = { name: "Yoshi" };
const ninja2 = { name: "Hattori" };
const ninja3 = { name: "Kuma" };

ninjaIslandMap.set(ninja1, { homeIsland: "Honshu" });
ninjaIslandMap.set(ninja2, { homeIsland: "Hokkaido" });

assert(ninjaIslandMap.get(ninja1).homeIsland === "Honshu", "first mapping works");
assert(ninjaIslandMap.get(ninja2).homeIsland === "Hokkaido", "second mapping works");
assert(ninjaIslandMap.get(ninja3) === undefined, "no mapping for ninja3");
assert(ninjaIslandMap.size === 2, "two mappings exist");
assert(ninjaIslandMap.has(ninja1) && ninjaIslandMap.has(ninja2), "we have mappings for first 2 ninjas");

ninjaIslandMap.delete(ninja1);
assert(!ninjaIslandMap.has(ninja1) && ninjaIslandMap.size === 1, "no more mapping for the first ninja");

ninjaIslandMap.clear();
assert(ninjaIslandMap.size === 0, "all mappings have been cleared");


// key equality in maps:
const map = new Map();
const currentLocation = location.href;

const firstLink = new URL(currentLocation);
const secondLink = new URL(currentLocation);

map.set(firstLink, { description: "firstLink" });
map.set(secondLink, { description: "secondLink" });

assert(map.get(firstLink).description === "firstLink", "first link mapping");
assert(map.get(secondLink).description === "secondLink", "second link mapping");
assert(map.size === 2, "there are two distinct mappings, even though the objects are the same");

// when creating mapping these two object are not considered equal because 2 objects are always considered different in
// JavaScript, even if they have exactly the same content


// map iteration:
// we can use for-of loops which visit items in the order they were inserted (something that for-in loops can't provide):
const directory = new Map();

directory.set("Yoshi", "+81 11 2385");
directory.set("Hattori", "+81 34 8934 7823");
directory.set("Hiro", "+81 23 9034 43 9");

for (let item of directory) { // each item is a 2-item array: key and value
    assert(item[0] !== null, "Key: " + item[0]);
    assert(item[1] !== null, "Value: " + item[1]);
}

for (let key of directory.keys()) { // iterating over keys
    assert(key !== null, "Key: " + key); // getting keys from iteration
    assert(directory.get(key) !== null, "Value: " + directory.get(key)); // get value from key
}

for (let value of directory.values()) { // iterating over values
    assert(value !== null, "Value: " + value); // gets us values of the map
}
