const yoshi = { skulk: true };
const hattori = { sneak: true };
Object.setPrototypeOf(yoshi, hattori);
assert("sneak" in yoshi, "yoshi can now sneak!");
// internal prototype property is not directly accessible, instead we use Object.setPrototypeOf to delegate search for
// properties which an object doesn't have to it's prototype ([[Prototype]]) - forming a prototype chain
// * CHANGING prototype via Object.setPrototypeOf is a very slow operation - use Object.create() instead

// every function has a built in prototype object which we can freely modify - when the function is created it immediately
// get a new object assigned to its prototype object which we can extend just like any other object

// initially function's prototype object has only 1 property - constructor, which references back to the function
// when using function as a constructor the prototype of the newly constructed object is set to the object referenced
// by the constructor function's prototype

function Ninja() {
    this.swung = false; // instance method, which will be a property of the newly created object
    this.swing = function () { // new object will contain this method -> no need to delegate to prototype
        return !this.swung; // every instance will get their own version of the properties created within the constructor
    }                       // this results in more memory consumption, should be careful with that
}                           // defining properties inside constructor can be used for mimicking private object variables
Ninja.prototype.swing = function () {
    return this.swung;
}
const ninja = new Ninja();
assert(ninja.swing(), "called the instance method"); // instance method will hide properties of the same name defined in
                                                     // prototype, because new instance won't need to consult its prototype

// if we reassign prototype to a new object, old instances will keep their reference to the old prototype which will keep it alive:
function Ninja() {
    this.swung = true;
}
const ninja1 = new Ninja(); // ninja1's [[prototype]] only has a constructor property at this point
Ninja.prototype.swingSword = function () { // add a method to prototype
    return this.swung;
};
assert(ninja1.swingSword(), "method exists"); // ninja1 has acces to prototype's method created after ninja1
Ninja.prototype = { // assign Ninja.prototype to a new object
    pierce: function () {
        return true;
    }
};
assert(ninja1.swingSword(), "still referencing old prototype object"); // this reference keeps that old prototype alive
const ninja2 = new Ninja();
assert(ninja2.pierce() && !ninja2.swingSword(), "references only the new prototype");

// checking constructor function:
const ninja = new Ninja();
assert(typeof ninja === "object", "type of the instance is object");
assert(ninja instanceof Ninja, "instanceof identifies the constructor");
assert(ninja.constructor === Ninja, "ninja object was created by the Ninja function");

// instantiating a new object via a reference to a constructor:
const ninja = new Ninja();
const ninja2 = new ninja.constructor(); // ninja2 instanceof Ninja -> true
// we can use the reference even if the original constructor is no longer in scope


// inheritance (SubClass.prototype = new SuperClass();) :
function Person() {}
Person.prototype.dance = function () {};
function Ninja() {};
Ninja.prototype = new Person(); // old prototype is not referenced anymore - it will be Garbage Collected
const ninja = new Ninja(); // ninja instanceof Ninja && ninja instanceof Person && typeof ninja.dance === "function"

// * don's set prototype directly to the "superclass's" prototype like Ninja.prototype = Person.prototype, because
// changing Ninja.prototype will automaticall change Person.prototype which is almost always undesirable


// fixing up constructor property after inheriting from another object's prototype:
// every object property is described with a *property descriptor* through which we can configure folliwing keys:
// - configurable: true - property's descriptor can be changed/ property can be deleted; false - can't do anything
// - enumerable: true - property shows up in for-in loop over object's properties
// - value: value of the property (defaults to undefined)
// - writable: true - can be changed via assignment; false - can't
// - get: defines getter function, which is called when accessing the property
// - set: defines setter function, which is called when assignment is made to the property
// * getter, setter can't be defined in conjunction with value and writable
// example:
ninja.name = "Yoshi"; // configurable, enumerable, writable, value set to 'Yoshi', get and set are undefined
// to fine-tune property, we can use Object.defineProperty(object, property, property descriptor object):
Object.defineProperty(ninja, "sneaky", {
    configurable: false,
    enumerable: false,
    value: true,
    writable: true
});
// fixing Ninja.prototype's constructor:
Object.defineProperty(Ninja.prototype, "constructor", {
    enumerable: false,
    value: Ninja,
    writable: true
});
assert(Ninja.constructor === Ninja, "connection from ninja instances to Ninja constructor reestablished");


// instanceof operator:
ninja instanceof Ninja; // checks whether the current prototype of Ninja function is in the prototype chain of ninja instance
// it doesn't necessarily checks whether an instance was created by a particular function constructor, but checks if
// this function's prototype is in the instance's prototype chain. This means that if we change Ninja.prototype to a new
// object and check again ninja instanceof Ninja, the return will be false
