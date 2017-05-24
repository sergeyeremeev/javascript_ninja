// accessing attribute values via DOM methods and DOM object properties
// <div></div>
document.addEventListener('DOMContentLoaded', () => {
    const div = document.querySelector('div');
    div.setAttribute('id', 'ninja-1');
    assert(div.getAttribute('id') === 'ninja-1', 'attribute successfully changed');

    div.id = 'ninja-2';
    assert(div.id === 'ninja-2', 'property successfully changed');

    assert(div.getAttribute('id') === 'ninja-2', 'attribute successfully changed via property');

    div.setAttribute('id', 'ninja-3');
    assert(div.id === 'ninja-3', 'property successfully changed via attribute');
});
// although this test shows that attributes and corresponding properties are linked, they aren't always identical!!!

// not all attributes are represented by element properties. if we want to access a value of a custom attribute we have
// to use getAttribute() and setAttribute() DOM methods.

// if not sure that property for an attribute exists:
const value = element.someValue ? element.someValue : element.getAttribute('someValue');

// in HTML5 data- prefixed custom attributes keep them valid in HTML5's eyes and clearly separates them from native ones


// Styling attributes:
// most commonly used - style - element property, which is an object holding styling properties

// there's a method for accessing computed style information - style which will be applied to the element after evaluating
// all inherited and applied style information

// style only has access to element's style attribute in the element markup - no access from on-page <style> or external
// stylesheets

// example:
// <style>div {font-size: 1.8em; border: 0 solid gold; }</style>
// <div style="color: #000;" title="Ninja power!">Hello</div>
document.addEventListener("DOMContentLoaded", () => {
    const div = document.querySelector('div');
    assert(div.style.color === 'rgb(0, 0, 0)' || div.style.color === '#000', 'color was recorded');
    assert(div.style.fontSize === '1.8em', 'fontSize wasn\'t recorded'); // this fails
    assert(div.style.borderWidth === '0', 'borderWidth wasn\'t recorded'); // this fails too

    div.style.borderWidth = '4px';
    assert(div.style.borderWidth === '4px', 'borderWidth was replaced');
});


// style property naming:
// hyphen prevents property being accessed via dot operator where JS parses would see it as a subtraction operator:
let fontSize = el.style.font-size;
// multiword CSS style names are converted to camel case to avoid such problem:
fontSize = el.style.fontSize; // or el.style['font-size']

// alternative is to write a method for accessing styles:
function style(el, name, value) {
    name = name.replace(/-([a-z])/ig, (all, letter) => {
        return letter.toUpperCase(); // convert to upperCase by replacing hyphen and next letter with uppercased one.
    });
    if (typeof value !== 'undefined') { // set the value if one is provided
        el.style[name] = value;
    }
    return el.style[name]; // get property's value
}


// computed styles:
function fetchComputedStyle(element, property) {
    const computedStyles = getComputedStyle(element); // obtain a descriptor object
    if (computedStyles) {
        property = property.replace(/([A-Z])/g, '-$1').toLowerCase(); // replace camel case with dashes and lowercase letters
        return computedStyles.getPropertyValue(property); // retrieve the computed style of specific style property
    }
}

fetchComputedStyle(document.querySelector('div'), 'background-color');

// when working with amalgam properties, such as border: 1px solid grey; we need to use computed styles to fetch the
// low-level individual properties.


// Heights and Widths:
// when not specified their values default to auto; offsetHeight and offsetWidth provide a fairly reliable way to access
// width and height of the element. They include padding of the element!
// When element is not displayed (display: none;) offsetHeight and offsetWidth return 0. One trick is possible:
// - change display to block;
// - set visibility to hidden;
// - set position to absolute;
// - grab the dimensions;
// - restore the changed properties;
(function () {
    const PROPERTIES = { // target properties
        position: 'absolute',
        visibility: 'hidden',
        display: 'block'
    };
    window.getDimensions = element => {
        const previous = {}; // remembering initial state
        for (let key in PROPERTIES) {
            previous[key] = element.style[key]; // remember settings
            element.style[key] = PROPERTIES[key];// change to new properties for fetching dimensions
        }
        const result = { // fetch dimensions
            width: element.offsetWidth,
            height: element.offsetHeight
        };
        for (let key in PROPERTIES) { // revert back to initial state
            element.style[key] = previous[key];
        }
        return result; // return dimensions
    }
})();

const dimensions = getDimensions(element);
elWidth = dimensions.width;
elHeight = dimensions.height;

// getting 0 from offsetWidth and offsetHeight can be a good way to determining the visibility of an element.


// Layout thrashing:
// Performing a series of consecutive reads and writes to DOM, not allowing the browser to perform layout optimizations

// Usually browser tries to delay working with the layout as much as possible to batch as many changes as possible. But
// sometimes it has to do many recalculations (often needless) which causes layout thrashing.

// Whenever we do a read, the browser has to do a recalculation to provide the most up to date information:
let ninja = document.getElementById('ninja');
let ninjaWidth = ninja.clientWidth;
ninja.style.width = ninjaWidth / 2 + 'px';
let ronin = document.getElementById('ronin');
let roninWidth = ronin.clientWidth;
ronin.style.width = roninWidth / 2 + 'px';
// by performing consecutive reads and writes we don't allow browser to be lazy and smart;

// instead we could write our code like this:
ninjaWidth = ninja.clientWidth;
roninWidth = ronin.clientWidth;

ninja.style.width = ninjaWidth / 2 + 'px';
ronin.style.width = roninWidth / 2 + 'px';
// by batching reads and writes we can reduce layout thrashing

// This is where virtual DOM is especially strong!
