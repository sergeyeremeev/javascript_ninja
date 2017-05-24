// due to the nature of event loop, the timer's delay is not guaranteed!

// example:
// <button id="myButton"></button>
setTimeout(function timeoutHandler() {
    /* Some timeout handle code that runs for 6ms */
}, 10);

setInterval(function intervalHandler() {
    /* Some interval handle code that runs for 8ms */
}, 10);

const myButton = document.getElementById('myButton');
myButton.addEventListener('click', function clickHandler() {
    /* Some click handle code that runs for 10ms */
});

/* Code that runs for 18ms */

// Instructions:
// - click a button 6ms into the application execution

// What happens:
// At 0ms a time-out timer is initiated with a 10ms delay, an interval timer is initiated with 10ms delay. Their references
// are kept by the browser. At 6ms the mouse is clicked and the click event is added to the queue. At 10ms the time-out
// timer expires and the first interval event fires, their matching task are placed on the task queue in the order in
// which they were registered. At 18ms mainline JS finishes executing and because there are no microtasks the browser can
// re-render the page and move onto the second iteration of the event loop. There are three queued tasks at this point.
// Click handler starts being processed for the next 10ms. At 20ms mark the second interval fires, however as there already
// is an interval task queued and awaiting execution, the second invocation is dropped.
// ***** The browser doesn't queue up more than one instance of a specific interval handler!!!!!! *****
// Click handler completes at 28ms, browser is allowed to re-render the page and event loop moves onto the third iteration
// where it processes the timeout event 28ms after it was registered with a 10ms delay!!!!! This shows that a correct
// way to think about time-outs and intervals delays is the *minimal* amount of time until their execution. We can only
// control when the timer task is added to the queue, not when it's processed. At 30ms mark another interval fires and again
// no additional task is queued. At 34ms time-out handler finishes and the browser gets a chance to re-render the page.
// Finally, at 34ms the interval handler starts its execution (24ms after the mark at which it was added to the queue).
// At 40ms a new interval task is added to the queue, because another one is being processed at the moment and none are
// queued up. At 42ms mark another interval starts being processed and at 50ms mark it is finally stabilized and gets
// executed every 10ms. In the end we have missed two interval handlers completely and had two executed at odd times -
// 34ms and 42ms, before getting to the stable point of executing every 10ms after 50ms mark.


// Difference between time-out and interval:
setTimeout(function repeatMe() {
    /* Long block of code */
    setTimeout(repeatMe, 10);
}, 10);
// Sets up a timeout that reschedules itself every 10ms

setInterval(() => {
    /* Long block of code */
}, 10);
// Sets up an interval that triggers every 10ms

// setTimeout will always have at least a 10ms delay after the previous callback execution!
// It will reschedule itself only when it actually gets around to executing.
// setInterval will attempt to execute a callback every 10ms regardless of when the last callback was executed.
