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

