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


// Computationally expensive processing:
// A long running script can suspend the browser and give it an unresponsive feel for a long time. Some browsers might
// kill a script if it's running for more than 5s, others produce a dialog box telling us about an unresponsive script
// Timers can come to the rescue when we need to perform expensive computations (eg manipulating thousands of DOM elements)

const tbody = document.querySelector('tbody');
for (let i = 0; i < 20000; i++) {
    const tr = document.createElement('tr');
    for (let t = 0; t < 6; t++) {
        const td = document.createElement('td');
        td.appendChild(document.createTextNode(i + "," + t));
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
}

// a total of 240000 DOM nodes are created which will likely hang the browser for a long period of time. What we can do
// is to break up the long running task, so other tasks can can be processed too:
const rowCount = 20000;
const divideInto = 4;
const chunkSize = rowCount / divideInto;
let iteration = 0;
const table = document.getElementsByTagName('tbody')[0];

setTimeout(function generateRows() {
    const base = chunkSize * iteration; // where we left off last time
    for (let i = 0; i < chunkSize; i++) {
        const tr = document.createElement('tr');
        for (let t = 0; t < 6; t++) {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode((i + base) + "," + t + "," + iteration));
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    iteration++;
    if (iteration < divideInto) {
        setTimeout(generateRows, 0); // schedule the next phase
    }
}, 0); // next iteration should execute as soon as possible, but after the UI has been updated

// by breaking up long running operations into smaller chunks, they are less likely to interrupt the flow of the browser
// This allows rendering between the execution of each chunk and prevents UI blocking (doesn't clog the event loop)
