class Ninja {
    constructor(name, level) { // constructor function to be called, when we call the class with keyword new
        this.name = name;
        this.level = level;
    }

    swingSword() { // method accessible to all Ninja instances
        return true;
    }

    static compare(ninja1, ninja2) { // class level method - not accessible from instances
        return ninja1.level - ninja2.level;
    }
}

var ninja = new Ninja("Yoshi", 5);
var ninja2 = new Ninja("Hattori", 3);

assert(ninja instanceof Ninja, "ninja is a Ninja");
assert(ninja.name === "Yoshi", "name is Yoshi");
assert(ninja.swingSword(), "can swing a sword");
assert(!("compare" in ninja1) && !("compare" in ninja2), "instances have no access to compare method");
assert(Ninja.compare(ninja, ninja2) > 0, "Ninja class can do the comparison");

// same as:
function Ninja(name, level) {
    this.name = name;
    this.level = level;
}
Ninja.prototype.swingSword = function () {
    return true;
};
Ninja.compare = function (ninja1, ninja2) {
    return ninja1.level - ninja2.level;
};


// simlified inheritance with es6 classes:
class Person {
    constructor(name) {
        this.name = name;
    }

    dance() {
        return true;
    }
}

class Ninja extends Person { // elegant inheritance without having to reset constructor
    constructor(name, weapon) {
        super(name);
        this.weapon = weapon;
    }

    wieldWeapon() {
        return true;
    }
}

var ninja = new Ninja("Yoshi", "Katana");

assert(ninja.name === "Yoshi", "ok");
assert(ninja.weapon === "Katana", "ok");
assert(ninja instanceof Ninja, "ninja is a Ninja");
assert(ninja instanceof Person, "ninja is a Person");
assert(ninja.wieldWeapon(), "can wield");
assert(ninja.dance(), "can dance");