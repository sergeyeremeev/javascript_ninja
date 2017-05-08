// matching newlines:
const html = "<b>Hello</b>\n<i>world!</i>";
assert(/.*/.exec(html)[0] === '<b>Hello</b>', "normal capture does not handle newlines");

// use whitespace matching to match everything (optimal solution due to its simplicity)
assert(/[\S\s]*/.exec(html)[0] === "<b>Hello</b>\n<i>world!</i>", "matching everything with a character set");

assert(/(?:.|\s)*/.exec(html)[0] === "<b>Hello</b>\n<i>world!</i>", "using non-capturing group to mach everything" +
    "using alteration.");


// matching unicode:
const text = "\u5FCD\u8005\u30D1\u30EF\u30FC"; // expand the set to include unicode characters
// match all the normal word characters and a range that spans the entire set of Unicode characters above U+0080
const matchAll = /[\w\u0080-\uFFFF_-]+/;
assert(text.match(matchAll), "Our regex matches non-ASCII!");


// matching escaped characters
const pattern = /^((\w+)|(\\.))+$/; // any sequence composed of word characters, backslash followed by any character or both
const test = [
    "formUpdate",
    "form\\.update\\.whatever",
    "form\\:update",
    "\\f\\o\\r\\m\\u\\p\\d\\a\\t\\e",
    "form:update"
];

for (let n = 0; n < test.length; n++) {
    assert(pattern.test(test[n]), test[n] + " is a valid identifier");
}
