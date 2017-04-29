// Sets are collections of distinct values
// Pre ES6:
function Set() {
    this.data = {};
    this.length = 0;
}

Set.prototype.has = function(item) {
    return typeof this.data[item] !== undefined;
};

Set.prototype.add = function(item) {
    if (!this.has(item)) {
        this.data[item] = true;
        this.length++;
    }
};

Set.prototype.remove = function(item) {
    if (this.has(item)) {
        delete this.data[item];
        this.length--;
    }
};

const ninjas = new Set();
ninjas.add("Hattori");
ninjas.add("Hattori");

assert(ninjas.has("Hattori") && ninjas.length === 1, "only 1 Hattori was added");
ninjas.remove("Hattori");
assert(!ninjas.has("Hattori") && ninjas.length === 0, "no more Hattori in ninjas");

// Can't store objects, only strings and numbers, also always a risk of accessing prototype objects.

// Sets to the rescue:
const ninjasSet = new Set(["Kuma", "Hattori", "Iggy", "Hattori"]);
assert(ninjasSet.has("Hattori") && ninjasSet.size === 3, "Only 1 Hattori in set");
assert(ninjasSet.has("Kuma"), "already has Kuma");
ninjas.add("Kuma"); // has no effect as it's already in the set

for (let ninja of ninjasSet) {
    assert(ninja !== null, ninja);
}

// union of sets, excluding all duplicates:
const ninjas1 = ["Kuma", "Hattori", "Yagyu"];
const ninjas2 = ["Hattori", "Yoshi", "Oda"];

const warriors = new Set([...ninjas1, ...ninjas2]); // creates a new set by spreading arrays - merges arrays then removes
                                                    // duplicates if there are any
assert(warriors.size === 5, "no duplicates");

// intersection of sets:
const set1 = new Set(["Kuma", "Hattori", "Yagyu"]);
const set2 = new Set(["Hattori", "Yoshi", "Oda"]);

const intersectionSet = new Set(
    [...set1].filter(ninja => set2.has(ninja)) // transform set1 into array with spread operator, use filter, pass to Set
);

assert(intersectionSet.has("Hattori") && intersectionSet.size === 1, "intersecting worked");

// difference of sets:
const differenceSet = new Set(
    [...set1].filter(ninja => !set2.has(ninja)) // items in set1 that are not in set2
);
assert(differenceSet.has("Kuma") && differenceSet.has("Yagyu"), "difference worked");

