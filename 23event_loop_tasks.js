// Event loop has at least two queues that hold events and actions performed by the browser. These actions are called
// tasks and are grouped into two categories: macrotasks and microtasks.

// Macrotasks examples: creating main document object, parsing HTML, executing mainline JS code, changing URL, page
// loading events, input, network and timer events. Macrotask represents one discrete, self-contained unit of work, after
// which the browser can continue with other work, like re-rendering UI, garbage collecting, etc...

// Microtasks: smaller tasks, such as promise callbacks and DOM mutation changes, which should be executed as soon as
// possible in an asynchronous way, but without the cost of the macrotask. Microtasks enable us to execute actions
// before the UI is re-rendered, avoiding unnecessary UI rendering, which might show application state inconsistencies.
// Microtasks should be executed before the browser continues with other assignments (like UI re-rendering)

// Event loop implementation should use at least one queue for macrotasks and at least one queue for microtasks; usually
// they have more, which allows for prioritisation for different types of tasks (performance-sensitive tasks: user input)

// Event loop fundamental principles:
// - Tasks are handled one at a time;
// - A task runs to completion and can't be interrupted by another task;

// In a single loop iteration one macrotask at most is processed (others are waiting in the queue) and ALL microtasks
// are processed until the microtasks queue is empty; then event loop checks if UI render update is required and if it is
// the UI is re-rendered. This marks the end of a single iteration of the loop.

// Details:
// - both queues are outside the event loop -> this indicates that addition of tasks to the queues happens outside of the
// event loop. If this wasn't the case, any events occurring during the execution of JS code would be ignored. To avoid
// this, detection and addition of events is done separately from the event loop
// - both types of tasks are executed one at a time -> due to single-threaded execution model. Each task is executed to
// completion without being interrupted. Only the browser can stop the task execution (if it's too selfish or memory-hungry)
// - all microtasks should be executed before the next rendering -> as they update the application state before rendering occurs
// - browser tries to render the page at 60 fps -> this means that for a smooth application, a single task and all
// microtasks should ideally complete within 16ms

// Possible scenarios:
// - Event loop reaches "Is rendering required?" decision before 16ms elapsed. Updating UI is a complex operation, so if
// there isn't an explicit need to render the page - the browser might chose not to do it in this loop iteration;
// - Event loop reachis "Is rendering required?" decision roughly around 16ms elapsed since last rendering. The browser
// updates UI and user experiences smooth-running application;
// - Executing a task (and microtasks) takes much longer than 16ms. Browser won't be able to re-render the page at a
// target frame rate - UI is not updated. If the delay is not too long (couple of hundred milliseconds) and there isn't
// much motion on the page - the delay might not even be perceivable. If there are many animations or execution takes
// way too long - web page will be perceived as slow or unresponsive. Worst case - "Unresponsive script" message.


// Only macrotasks example:
// <button id="firstButton"></button>
// <button id="secondButton"></button>
const firstButton = document.getElementById('firstButton');
const secondButton = document.getElementById('secondButton');

firstButton.addEventListener('click', function firstHandler() {
    /* Some click handle code that runs for 8ms */
});
secondButton.addEventListener('click', function secondHandle() {
    /* Click handle code that runs for 5ms */
});
/* Code that runs for 15ms */

// Instructions:
// - mainline JS code takes 15ms to execute;
// - first click event handler runs for 8ms;
// - second click event handler runs for 5ms;

// Actions:
// - click the first button 5ms after our scripts start executing;
// - click second button 12ms after our scripts start executing;

// What happens:
// Immediately two elements are fetched from the DOM and two functions are registered as event handlers. First block of
// mainline JS executes for 15ms. As the user clicks on two buttons, the respective click events get placed in the task
// queue. The tasks get added while mainline JS is executed (addition happens outside of event loop). At 15ms the
// execution of the mainline JS code finishes and event loop proceeds to the microtasks queue. As there are no microtasks
// in the queue, event loop skips to updating the UI. After that event loop moves to the second iteration, where it
// processes firstHandler function for around 8ms, after that the browser can re-render the page if necessary. On the third
// iteration (23ms in) secondHandler function get processed (which was added 11ms earlier!) and the queue is finally empty
// and the browser can re-render the page again, if necessary.


// Macro + microtasks example:
// modify the firstHandler to add a microtask which runs for 4ms and is handled asynchronously for consistency sake,
// even though it's resolved immediately
firstButton.addEventListener('click', function firstHandler() {
    Promise.resolve().then(() => {
        /* Promise handling code that runs for 4ms */
    });
    /* click handle code that runs for 8ms */
});

// What happens:
// Until 15ms everything stays the same to the previous example. At 15ms event loop finishes mainline JS execution, checks
// microtask queue, which is still empty, and moves on to the second iteration, encountering firstHandler. firstHandler
// creates and immediately resolves a promise, which queues a microtask, and when the first click handler is finished,
// event loop moves on to the microtask queue and processes it (for 4ms in our case). Only after that the event loop
// moves on to the next iteration and processes secondHandler (this time at 27ms).

// If a microtask is queued in the microtask queue, it gets priority and is processed even if an older task is already
// waiting in the queue.

// Page can be re-rendered after macrotask if there are no microtasks, or after a microtask only if there are no other
// microtasks left in the queue.
