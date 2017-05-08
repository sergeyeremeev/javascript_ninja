// testing pattern in a string:
function isThisAZipCode(candidate) {
    if (typeof candidate !== "string" || candidate.length !== 10) {
        return false;
    }

    for (let n = 0; n < candidate.length; n++) {
        let c = candidate(n);

        switch (n) {
            case 0: case 1: case 2: case 3: case 4: case 6: case 7: case 8: case 9:
                if (c < '0' || c > '9') { return false; }
                break;
            case 5:
                if (c !== '-') { return false; }
            break;
        }
    }
    return true;
}

// regex way:
function isThisAZipCode(candidate) {
    return /^\d{5}-\d{4}$/.test(candidate);
}

// regex literals are delimited with forward slashes. We can also pass a regex as a string to a regex construct:
const pattern = new RegExp("text"); // vs const patter = /test/;
// construct is preferred when regex is constructed dynamically at runtime. If it's know at development time - use literal
// regex in a string also means that backslash has to be doubled to avoid conflict with backslash in strings, which is an escape

// 5 flags are associated with regex:
// - i -> makes regex case sensitive -> /test/i matches test, Test, teST, etc;
// - g -> matches all instances of the pattern, as opposed to local which matches only the first occurrence;
// - m -> matches across multiple lines, as might be obtained from textarea value;
// - y -> enables sticky matching in the target string by attempting to match from last match position;
// - u -> enables the use of Unicode point escapes
// flags are appended to the end of the literal or passed as a second parameter to a construct

// regex expressions are made up of terms and operators:
// - exact matching:
// any non-special character (and non-operator) much appear literally in expression in the correct order:
/test/ // means t followed by e followed by s followed by t

// - matching from a class of characters (using set operator, also called the character class operator):
/[abc]/ // matches a, b, or c - only a single character
/[^abc]/ // matches any character but a, b, or c
/[a-m]/ // matches any character from a to m

// - escaping is done with a single backslash:
/^\[$/ // escapes literal [

// - begins/ends:
// caret character when used as the first character of regex - anchors the match at the beginning of the string:
/^test/ // matches if test is a substring at the beginning of the string.
// This is an overload of caret character - it's used to negate a character set
// $ signifies that the pattern must appear at the end of the string:
/test$/ // matches if test is a substring at the end of the string
/^test$/ // specified pattern must encompass the entire candidate string

// - repeated occurrences:
// character followed with ? -> /t?est/ - t is optional (can appear 0 or 1 times) (test, est)
// character followed with + -> /t+est/ - t should appear >= 1 times (test, ttest, tttest... )
// character followed with * -> /t*est/ - t should appear >= 0 times (est, test, ttest...)
// character followed with {n} -> /a{3}/ - a should appear n consecutive times (aaa)
// character followed with {n, n} -> /a{4, 10}/ - a should appear 4-10 times consecutively (aaaaaa)
// character followed with {n,} -> /a{3,}/ - a should appear at least 3 times consecutively (aaaaaaaaaaaaaaaaaaaaaaaa)

// greedy vs non-greedy:
// by default repetition operators are greedy - the consume all the possible characters that make up a match;
// for non-greedy use ? (overload of ? operator), eg /a+?/ to consume only enough characters to make up a match:
// 'aaa' -> /a+/ matches all three characters; /a+?/ matches only the first one - enough to satisfy a+ term

// there are many predefined character classes and character terms which can't be matched with literal characters, like
// tab, backspace, carriage return, any character (no whitespace), any digit, etc.

// grouping can be used to apply operators to multiple characters and also to create a capture:
/(ab)+/ // matches 1 or more consecutive occurrences of ab

// alternatives expressed with pipe character:
/a|b/ // matches a or b
/(ab)+|(cd)+/ // matches 1 or more ab or 1 or more cd

// backreferencing:
// portion of a string that is successfull matched against a term in regular expression;
// backslash followed by the number of capture to be referenced
/^([dtn])a\1/ // matches a string beginning with either d, t or n, followed by a, followed by whatever that was matched
// in the first capture


// 2 phases of regex - compilation and execution:
// compilation occurs when regex is first created, execution occurs when we use it to match patterns in a string
// during compilation the expression is parse by JS engine and converted into internal representation
// usually browsers will recognize identical regular expressions and cache the compilation results, but it's better to
// precompile them for later use, as we can't be certain about browser optimizations:
// <span class="samurai ninja ronin"></span>
// <span class="samurai ninja"></span>
// <span class="samurai ronin"></span>
function findClassElements(className, type) {
    const elems = document.getElementsByTagName(type || "*");
    const regex = new RegExp("(^|\\s)" + className + "(\\s|$)"); // store dynamic regex expression in a variable, caching
                                                                 // it and preventing creating of new regex object each
                                                                 // time matching happens (some browsers might not optimise)
    const results = [];
    for (let i = 0, length = elems.length; i < length; i++) {
        if (regex.test(elems[i].className)) {
            results.push(elems[i]);
        }
    }
    return results;
}

assert(findClassElements("ninja", "div").length === 0, "ninja was not found as a part of any div");
assert(findClassElements("ninja", "span").length === 0, "ninja was found twice in a span");
assert(findClassElements("samurai", "span").length === 3, "samurai was found three times");

// the regex was created dynamically each time, so we avoided unnecessary recompilation by caching it in a variable
