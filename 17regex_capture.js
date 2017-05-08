// capturing transform value (using local regular expression and the match method):
// <div id="square" style="transform: translateY(15px);"></div>
function getTranslate(el) {
    const transformValue = el.style.transform;
    if (transformValue) {
        const match = transformValue.match(/translate([X|Y]*)\(([^\)]+)\)/);
        return match ? match[2] : "";
    }

    return "";
}

const square = document.getElementById('square');
assert(getTranslateY(square) === "15px", "we've extracted translateY value");


// capturing using global expressions:
const html = '<div class="test"><b>Hello</b><i>world!</i></div>';
const results = html.match(/<(\/?)(\w+)([^>]*?)>/); // without global flag
assert(results[0] === '<div class="test">', "opening div tag");
assert(results[1] === "", "missing slash");
assert(results[2] === "div", "tag name");
assert(results[3] === 'class="test"', "attributes until >");
// a single instance is matched and the captures within that instance are returned

const all = html.match(/<(\/?)(\w+)([^>]*?)>/g); // with global flag
assert(all[0] === '<div class="test">', 'opening div tag');
assert(all[1] === '<b>', 'opening b tag');
assert(all[2] === '</b>', 'closing b tag');
assert(all[3] === '<i>', 'opening i tag');
assert(all[4] === '</i>', 'closing i tag');
assert(all[5] === '</div>', 'closing div tag');
// global match returns a list of matches. If we need captures with global search -> we should use the 'exec' command
const tag = /<(\/?)(\w+)([^>]*?)>/g;
let match, num = 0;
while ((match = tag.exec(html)) !== null) { // each call returns the next match and its captures
    assert(match.length === 4, 'every match finds each tag and 3 matches');
    num++;
}
assert(num === 6, "3 opening and 3 closing tags");


// referencing captures:
const html_new = '<b class="hello">Hello</b> <i>world!</i>';
const pattern = /<(\w+)([^>]*)>(.*?)<\/\1>/g; // use capture backreference to reference the contents of the first capture
                                              // to match the opening tag in this case (if no same tags inside the tag)
match = pattern.exec(html_new);
assert(match[0] === '<b class="hello">Hello</b>', "the entire tag from start to finish");
assert(match[1] === "b", "tag name");
assert(match[2] === ' class="hello"', "attributes");
assert(match[3] === 'Hello', "contents");

match = pattern.exec(html_new); // move to the next match
assert(match[0] === '<i>world!</i>', "entire match");
assert(match[1] === 'i', 'tag name');
assert(match[2] === '', 'no attributes');
assert(match[3] === 'world!', 'contents of the tag');


// we can get capture references within the replace string of a call to replace() method:
assert("fontFamily".replace(/([A-Z])/g, "-$1").toLowerCase() === "font-family", "convert camelCase to dashed");
// value of the first capture (F) is referenced in the replace string via $1, which allows to add a dash before it


// all sets of parentheses in regex are treated as both, captures and groups, which can result in more captures than
// intended initially:
let pattern_new = /((ninja-)+)sword/; // we want to allow prefix ninja- to appear 1 or more times and we want to capture
                                        // the entire prefix -> we need 2 sets of parentheses.
// this results in more than 1 capture, to avoid it we can use ?: immediately after opening parentheses, to indicate a
// noncapturing group. This is known as *passive subexpression*:
pattern_new = /((?:ninja-)+)sword/; // inner set of parentheses has been converted to passive subexpression, the outer
                                    // set remains a capture. This technique prevents unnecessary captures!!!


// Replacing using function:
// we can provide a function as the replacement value which will be invoked for each match found with a variable list of parameters:
// - the full text of the match;
// - the captures of the match, one parameter for each;
// - the index of the match within the original string;
// - the source string;

// value returned from the function serves as the replacement value:

// Example - converting dashed string to camel case:
function upper(all, letter) { // declare a helper function
    return letter.toUpperCase();
}
assert('border-bottom-width'.replace(/-(\w)/g, upper) === 'borderBottomWidth', "camel cased a hyphenated string");

// Example - compressing a querry string:
function compress(source) {
    const keys = {};
    source.replace(/([^=&]+)=([^&]*)/g, function (full, key, value) { // function here used as a means of searching
        keys[key] = (keys[key] ? keys[key] + "," : "") + value;
        return "";
    });
    const result = [];
    for (let key in keys) {
        result.push(key + "=" + keys[key]);
    }
    return result.join('&');
}

assert(compress('foo=1&foo=2&blah=a&blah=b&foo=3') === "foo=1,2,3&blah=a,b", "compression works");
