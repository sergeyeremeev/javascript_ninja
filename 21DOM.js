// Creating html elements:
// jQuery:
$(document.body).append('<div><h1>Greetings</h1><p>Yoshi here</p></div>');

// DOM API:
const h1 = document.createElement('h1');
h1.textContent = "Greetings";

const p = document.createElement('p');
p.textContent = "Yoshi here";

const div = document.createElement('div');

div.appendChild(h1);
div.appendChild(p);
document.body.appendChild(div);


// Converting HTML to DOM:
// - preprocessing html source string:
// <option>Yoshi</option>
// <option>Kuma</option>
// <table/>                           - we need to clean up this HTML first:

// self-closing table problem:
const tags = /^(area|base|br|col|embed|hr|img|input|keygey|link|menuitem|meta|param|source|track|wbr)$/i;
function convert(html) {
    return html.replace(/(<(\w+)[^>]*?)\/>/g, (all, front, tag) => {
        return tags.test(tag) ? all : front + "></" + tag + ">";
    });
}

assert(convert('<a/>') === '<a></a>', "conversion works");
assert(convert('<hr/>') === '<hr/>', "not converting tag from the list");

// standalone options problem (HTML wrapping):
// - generating a list of DOM nodes from some markup:
function getNodes(htmlString, doc, fragment) {
    const map = { // map of elements that need a special parent. Includes depth of the new node, opening and closing HTML for parents
        '<td': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
        '<th': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
        '<tr': [2, '<table><thead>', '</thead></table>'],
        '<option': [1, '<select multiple>', '</select>'],
        '<optgroup': [1, '<select multiple>', '</select>'],
        '<legend': [1, '<fieldset>', '</fieldset>'],
        '<thead': [1, '<table>', '</table>'],
        '<tbody': [1, '<table>', '</table>'],
        '<tfoot': [1, '<table>', '</table>'],
        '<colgroup': [1, '<table>', '</table>'],
        '<caption': [1, '<table>', '</table>'],
        '<col': [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>']
    };

    const tagName = htmlString.match(/<\w+/); // match the opening bracket + tag name
    let mapEntry = tagName ? map[tagName[0]] : null; // grab the entry in the map via tagName[0] - entire match part

    if (!mapEntry) {
        mapEntry = [0, ' ', ' ']; // if not in the map, construct a new entry with 0 depth and empty parent
    }

    let div = (doc || document).createElement('div'); // create div in passed in document or default to current document
    div.innerHTML = mapEntry[1] + htmlString + mapEntry[2]; // construct the correct innerHTML in the newly created div

    while (mapEntry[0]--) {
        div = div.lastChild; // walk down the created tree to the depth from map entry to reach the parent of the desired
                             // node created from the markup
    }

    if (fragment) {                               // if the fragment exists
        while (div.firstChild) {                  // inject nodes into it
            fragment.appendChild(div.firstChild);
        }
    }

    return div.childNodes; // returns the newly created element
}

assert(getNodes('<td>test</td><td>test2</td>').length === 2, 'get 2 nodes back from the method');
assert(getNodes('<td>test</td>')[0].nodeName === 'TD', 'verify getting the correct node');


// Inserting elements into the document:
// <div id="test"><b>Hello</b>, I'm a ninja!</div>
// <div id="test2"></div>
document.addEventListener('DOMContentLoaded', () => {
    function insert(elems, args, cb) {
        if (elems.length) {
            const doc = elems[0].ownerDocument || elems[0],
                  fragment = doc.createDocumentFragment(),
                  scripts = getNodes(args, doc, fragment), // create HTML nodes from HTML string
                  first = fragment.firstChild;

            if (first) {
                for (let i = 0; elems[i]; i++) {
                    cb.call(root(elems[i], first),
                        i > 0 ? fragment.cloneNode(true) : fragment); // clone the fragment if inserting nodes into more
                                                                      // than 1 element is required, to avoid copying
                                                                      // each separate node each time
                }
            }
        }
    }

    const divs = document.querySelectorAll('div');
    insert(divs, '<b>Name:</b>', function (fragment) {
        this.appendChild(fragment);
    });

    insert(divs, '<span>First</span> <span>Last</span>', function (fragment) {
        this.parentNode.insertBefore(fragment, this);
    })
});
