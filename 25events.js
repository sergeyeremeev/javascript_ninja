// within the event handler *this* refers to the element on which the event handler was registered. Often this is the
// element on which the event has occurred, but it's not always the case.

// Event propagation:

// Example 1:
// <div id="outerContainer"><div id="innerContainer"></div></div>
const outerContainer = document.getElementById('outerContainer');
const innerContainer = document. getElementById('innerContainer');

outerContainer.addEventListener('click', () => {
    report('Outer container click');
});

innerContainer.addEventListener('click', () => {
    report('Inner container click');
});

document.addEventListener('click', () => {
    report('document click');
});

// If we click on inner container, this should trigger all three event handlers, but in which order?

// Long ago, Netscape and Microsoft made opposing decisions:
// - In Netscape's event model the event handling starts with the top element: document -> outerContainer -> innerContainer
// which is called *event capturing*.
// - Microsoft decided to start with the targeted element and go up: innerContainer -> outerContainer -> document, which
// is called event bubbling.

// The standard set by the W3C embraces both approaches, so event is handled in two phases:
// 1) Capturing phase - event is captured at top element and trickled down to the target element (window-document...-target)
// 2) Bubbling phase - after the target event is reached in capturing phase the handling switches to bubbling and the
// event bubbles up again from the target element to the top one (target-parent-...-document-window)

// We can decide which event-handling order we want to use by adding another Boolean argument to the addEventListener method
// - true - means that the event will be captured;
// - false - means that the event will bubble (bubbling has been made the default option by W3C);

// all of this means that in our example the event handlers would be executed in the bubbling order: inner-outer-document


// Example 2:
document.addEventListener('click', () => {
    report('Document click');
});

outerContainer.addEventListener('click', () => {
    report('Outer container click');
}, true); // enable capturing

innerContainer.addEventListener('click', () => {
    report('Inner container click');
}, false); // enable bubbling

// The event first goes thorough capturing until it reaches the target element and then the bubbling mode is activated.
// Starting from the top capturing trickles down to the innerContainer with the goal of finding all elements that have
// an event handler for this click event in capturing mode. One element is found - outerContainer and the matching click
// handler is executed. As the event reaches the target element, the event moves on to the bubbling phase and bubbles to
// the top executing all bubbling event handlers on its path. So in this example the handler would be executed in the
// following order:
// outerContainer -> innerContainer -> document

// This example shows that although the event occurred on innerContainer, it still was handled on elements higher up in
// the DOM hierarchy. An element on which the event is handled doesn't have to be the element on which the event occurs

// This point is important in context of the *this* keyword: *this* keyword refers to the element on which the event
// handler is registered, not necessarily the element on which the event occurred.


// Example 3:
innerContainer.addEventListener('click', function (event) {
    report('innerContainer handler');
    assert(this === innerContainer, 'This refers to the innerContainer');
    assert(event.target === innerContainer, 'event.target refers to the innerContainer');
});

outerContainer.addEventListener('click', function (event) {
    report('outerContainer handler');
    assert(this === outerContainer, 'This refers to the outerContainer'); // refers to the element on which the handler
                                                                          // is registered
    assert(event.target === innerContainer, 'event.target refers to the innerContainer'); // refers to target of the event
});


// Delegating event to an ancestor for better performance:
const cells = document.querySelectorAll('td');
for (let n = 0; n < cells.length; n++) {
    cells[n].addEventListener('click', function () { // registering the same event handler on EVERY cell
        this.style.backgroundColor = 'yellow';
    });
}

// Efficient way:
const table = document.getElementById('someTable');
table.addEventListener('click', function (event) { // only one event handler to work with all cells
    if (event.target.tagName.toLowerCase() === 'td') {
        event.target.style.backgroundColor = 'yellow';
    }
});

// With event delegation we can apply an event handler only to the elements that are ancestors of our elements of interest
// which are the event targets. This way we can be sure that the event will bubble to the element on which the handler
// was registered.
