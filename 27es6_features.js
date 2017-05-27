// Template literals:
const ninja = {
    name: 'Yoshi',
    action: 'subterfuge'
};

const concatMessage = 'Name: ' + ninja.name + ' Action: ' + ninja.action;
const templateMessage = `Name: ${ninja.name} Action: ${ninja.action}`;
assert(concatMessage === templateMessage, 'Result is the same, but much prettier');

// we can place a simple variable, object property or even a function call inside the ${} templates. Also, template strings
// aren't limited to a single line:
const multilineString = `Name:  ${ninja.name}
                         Yoshi: ${ninja.action}`;


// Destructuring:
// extracting data from arrays and object by using patterns:
const warrior = { name: 'Yoshi', action: 'skulk', weapon: 'shuriken' };

// old way to assign
const nameOld = warrior.name;
const actionOld = warrior.action;
const weaponOld = warrior.weapon;

const { name, action, weapon } = ninja; // object destructuring - assign each property to a variable of the same name

assert(name === 'Yoshi', 'name is correct');
assert(action === 'skulk', 'action is correct');
assert(weapon === 'shuriken', 'weapon is correct');

const { name: myName, action: myAction, weapon: myWeapon } = ninja; // we can explicitly name the variables to which we
                                                                    // want to assign properties' values

assert(myName === 'Yoshi', 'name is correct');
// etc...


// Destructuring arrays:
const ninjas = ['Yoshi', 'Kuma', 'Hattori'];
const [firstNinja, secondNinja, thirdNinja] = ninjas;

assert(firstNinja === 'Yoshi', 'Yoshi is indeed the first ninja');
// etc...

const [, , third] = ninjas; // skipping array items
assert(third === 'Hattori', 'We can skip items');

const [first, ...remaining] = ninjas; // capturing trailing items
assert(remaining.length === 2, '2 remaining ninjas');
assert(remaining[0] === 'Kuma', 'Kuma is the first remaining ninja');


// Enhanced object literals:
const name = 'Yoshi';

const oldNinja = {
    name: ninjaName,
    getName: function () {
        return this.name;
    }
};

oldNinja['old' + name] = true; // property who's name is dynamically calculated

assert(oldNinja.name === 'Yoshi' && typeof oldNinja.getName === 'function' && 'oldYoshi' in oldNinja,
    'a ninja has a name, a method and a dynamically calculated property');

const newNinja = {
    name, // property value shorthand syntax - assign the value of the same named variable to the property
    getName() { // method definition shorthand - parentheses after the property name indicate that it's a method
        return this.name;
    },
    ['new' + name]: true
};

assert(newNinja.name === 'Yoshi', 'Shorthand syntax is working');
assert(typeof newNinja.getName === 'function', 'Shorthand for method definition is working');
assert('newYoshi' in newNinja, 'has a dynamically created property');
