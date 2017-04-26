// User types url in address bar -> browser forms a request on behalf of user and sends it to the server -> server
// processes request and formulates a response and then sends it to client (usually HTML, CSS, JS) -> browser processes
// HTML, CSS and JS and builds page -> enters a loop waiting for effects to occur and starts invoking event handlers.

// Page building phase - parsing HTML and building the DOM (processing HTML nodes), executing JS code (happens whenever
// the <script> tag is encountered). Browser can switch between these two steps as many times as necessary.

// HTML is the blueprint for building the DOM, if there are mistakes, the browser can usually fix them.

// Event handling - processing events one at a time, relies on event queue

// global code vs function code - global code is executed first, line by line, function code must be called to be executed

// single threaded model - one event at a time -> to track events that have occured but still needs to be processed an
// event queue is used - browser checks head of the queue - if no events, keep checking - if there is an event take it,
// execute an associated handler then check again.

// document.body.onclick = function () {}; is dangerous, because it can be overwritten, use addEventListener instead.