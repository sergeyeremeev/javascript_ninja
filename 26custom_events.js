// close coupling disadvantages: the code that detects the conditions has to know about the code that will react to such
// condition. On the other hand loose coupling occurs when the code that triggers the condition doesn't know anything
// about the code that will react to condition or if there is anything that will react at all.

// Event handling is a good example of loose coupling - the code triggering the event doesn't know about the handlers
// we've established on the page. The click event is pushed onto the task queue by the browser.


// Ajax-y example:
// ideally we want something like this:
document.addEventListener('ajax-start', e => {
    document.getElementById('spinWheel').style.display = 'inline-block'; // rotating pinwheel
});
document.addEventListener('ajax-complete', e => {
    document.getElementById('spinWheel').style.display = 'none'; // hide pinwheel on ajax complete
});

// such methods don't exist but we can fix that:

// Custom event are a way of simulating the experience of a real event, but the one that has a business sense within the
// context of our application

// example:
// <button type="button" id="clickMe">Start</button>
// <img id="spinWheel" src="spin-wheel.gif">
function triggerEvent(target, eventType, eventDetail) {
    const event = new CustomEvent(eventType, { // CustomEvent constructor to create a new event
        detail: eventDetail // information to the event object through the detail property
    });
    target.dispatchEvent(event);
}

function performAjaxOperation() {
    triggerEvent(document, 'ajax-start', {url: 'my-url'});
    setTimeout(() => {
        triggerEvent(document, 'ajax-complete');
    }, 5000);
}

const button = document.getElementById('clickMe');
button.addEventListener('click', () => {
    performAjaxOperation();
});

document.addEventListener('ajax-start', e => { // handle the ajax-start event
    document.getElementById('spinWheel').style.display = 'inline-block';
    assert(e.detail.url === 'my-url', 'We can pass in event data'); // check that we can access additional event data
});

document.addEventListener('ajax-complete', e => { // handle the ajax-complete event
    document.getElementById('spinWheel').style.display = 'none';
});

// the three handlers (2 on document and 1 on button) know nothing of each other's existence. Button handler doesn't show
// or hide the image.

// All code is separated into small independent modules that react to certain conditions or don't react at all, so there
// is a high degree of decoupling. This makes it easier to share portions of code and move them around without violating
// any coupled dependency between code fragments. Decoupling is a great advantage of writing custom events to develop
// applications in a highly expressive and flexible manner.
