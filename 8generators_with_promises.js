// - put the code which uses asynchronous task in the generator
// - execute that generator function
// - when we reach the call to async task, create a promise which represents the value of this async task
// - yield from generator to avoid blocking
// - when the promise is resolved, call the iterator's next method to continue generator's execution
// - do this as many times as necessary
async(function* () { // pass generator function as an argument to our helper async function
    try { // luxury of using synchronous exception handling due to generator function
        const ninjas = yield getJSON("data/ninjas.json"); // this call creates a promise, which will eventually contain
                                                          // a list of ninjas. the generator yields control, which
                                                          // returns the control flow to the *handle* function
        const missions = yield getJSON(ninjas[0].missionUrl); // by this time we have called the next() method with
                                                              // the received data as an argument and now ninjas is a list
                                                              // of objects received from the first async call
        const missionDesc = yield getJSON(missions[0].detailsUrl);
    } catch(e) {
        // something happened
    }
});

function async(generator) {
    var iterator = generator();

    function handle(iteratorResult) {
        if (iteratorResult.done) {
            return;
        }

        const iteratorValue = iteratorResult.value;

        if (iteratorValue instanceof Promise) { // check that the yielded value is a promise
            iteratorValue.then(res => handle(iterator.next(res))) // register success and error callbacks
                         .catch(err => iterator.throw(err));
        }
    }

    try {
        handle(iterator.next());
    } catch(e) {
        iterator.throw(e);
    }
}


// async/await (es7, but can be used with babel):
(async function () { // async keyword to specify that this function relies on asynchronous values
    try {
        const ninjas = await getJSON("data/ninjas.json"); // await keyword tells JS engine to wait for this value in a
                                                          // non-blocking manner
        const missions = await getJSON(ninjas[0].missionsUrl);

        console.log(missions);
    } catch(e) {
        console.log("Error ", e);
    }
})();