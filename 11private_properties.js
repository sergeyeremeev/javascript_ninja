function Ninja() {
    let skillLevel; // private skill variable, can only be obtained from the getter

    this.getSkillLevel = () => { // getter method
        report("getting skill level value"); // log read attempts
        return skillLevel;
    }

    this.setSkillLevel = value => { // setter method
        report("modifying skill level from: ", skillLevel, " to: ", value);
        skillLevel = value;
    }
}

const ninja = new Ninja();
ninja.setSkillLevel(19); // have to explicitly call associated methods, which is awkward
assert(ninja.getSkillLevel() === 19, "getter and setter are working");

// built in getters and setters
const ninjaCollection = {
    ninjas: ["Yoshi", "Kuma", "Hattori"],
    get firstNinja() { // define a getter method with keyword get (no arguments)
        report("getting firstNinja");
        return this.ninjas[0];
    },
    set firstNinja(value) { // setter method with keyword set (one argument)
        report("setting firstNinja");
        this.ninjas[0] = value;
    }
}

assert(ninjaCollection.firstNinja === "Yoshi", "Yoshi is first"); // implicitly call getter by reading property value
ninjaCollection.firstNinja = "Hachi"; // implicitly call setter by assigning a value to a property
assert(ninjaCollection.firstNinja === "Hachi" && ninjaCollection.ninjas[0] === "Hachi", "now Hachi is first");

// getter and setter accessed/assigned like a standard object property, not a method, the associated method is implicitly 
// called with all noram side effects, like creating a matching execution context, placing it on top of the stack, etc.

// in classes:
class NinjaCollection {
    constructor() {
        this.ninjas = ["Yoshi", "Hattori", "Kuma"];
    }

    get firstNinja() {
        report("Getting first ninja");
        return this.ninjas[0];
    }

    set firstNinja(value) {
        report("Setting first ninja");
        this.ninjas[0] = value;
    }
}

// non-strict mode - assigning a value to a property with only a getter does nothing, strict mode - throws type error

// with classes and object literals getters and setters aren't created within the same function scope as variables that
// we can use for private object properties -> use Object.defineProperty method if private property is needed:
function Ninja() {
    let _skillLevel = 0; // private variable

    Object.defineProperty(this, 'skillLevel', {
        get: () => { // both methods create a closure over the "private" variable
            report("get method is called");
            return _skillLevel;
        },
        set: value => {
            report("set method is called");
            _skillLevel = value;
        }
    });
}

const ninja = new Ninja();
assert(typeof ninja._skillLevel === "undefined", "can't access private property");
assert(ninja.skillLevel === 0, "works fine");
ninja.skillLevel = 10;
assert(ninja.skillLevel === 10, "getter and setter are working");


// validate property values
function Ninja() {
    let _skillLevel = 0;

    Object.defineProperty(this, 'skillLevel', {
        get: () => _skillLevel,
        set: value => {
            if (!Number.isInteger(value)) {
                throw new TypeError("Skill level should be a number!");
            }
            _skillLevel = value;
        }
    });
}

const ninja = new Ninja();
ninja.skillLevel = 20;
assert(ninja.skillLevel === 20, "all good");

try {
    ninja.skillLevel("Great");
    fail("Shouldn't be here");
} catch(e) {
    pass("Setting a non-integer value throws an exception");
}


// computed properties (don't store a value, provide get and/or set methods to set other properties indirectly):
const shogun = {
    name: "Yoshiaki",
    clan: "Ashikaga",
    get fullTitle() {
        return this.name + " " + this.clan;
    },
    set fullTitle(value) {
        const segments = value.split(" ");
        this.name = segments[0];
        this.clan = segments[1];
    }
}

assert(shogun.fullTitle === "Yoshiaki Ashikaga", "get works");
shogun.fullTitle = "Ieyasu Tokugawa";
assert(shogun.name === "Ieyasu", "set works as intended");