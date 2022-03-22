window.globalNgrams = {};
window.globalNgrams.sortBy = "countDesc";
window.globalNgrams.type = "character";
window.globalNgrams.text = "";
window.globalNgrams.n = 2;
window.globalNgrams.ngramMap = {};

/**
 * create ngrams for the text in the input-field and output them in a table
 */
function ngrams() {
    setGlobalInputs();
    computeNgramMap();
    updateTextOccurrences();
    populateTable();
    printProbabilityTable();
}

/**
 * Read the user-inputs from the page and set the global variables
 * type: is either characters or words
 * n: is the number of elements
 * text: is the text to analyze
 */
 function setGlobalInputs() {
    window.globalNgrams.type = document.getElementById("ngrams-type").value;
    window.globalNgrams.n = +document.getElementById("n-select").value;
    window.globalNgrams.text = document.getElementById("ngrams-input").value;
}

/**
 * Computes and sets the global ngramMap by delegating
 * to either the character or word ngramMap computation
 */
function computeNgramMap() {
    if (window.globalNgrams.type == "character") {
        window.globalNgrams.ngramMap = computeNgramMapCharacters();
    } else if (window.globalNgrams.type == "word") {
        window.globalNgrams.ngramMap = computeNgramMapWords();
    } else {
        throw "gram should be either 'character' or 'word' - other values are not ok";
    }
}

/**
 * Update all occurrences of 'n-gram' and gram-type in the text
 * - the n in n-gram should be replaced with the correct number
 * - the type should either be 'character' or 'word'
 */
function updateTextOccurrences() {
    let n = window.globalNgrams.n;
    [...document.getElementsByClassName("ngrams-grams-text")].forEach(element => element.textContent = n + "-gram");
    [...document.getElementsByClassName("ngrams-grams-text-minus-one")].forEach(element => element.textContent = (n-1) + "-gram");
    [...document.getElementsByClassName("ngrams-type")].forEach(element => element.textContent = window.globalNgrams.type);
}

/**
 * @returns Map of (ngram: count)
 */
function computeNgramMapCharacters() {
    let n = window.globalNgrams.n;
    let text = window.globalNgrams.text;

    let ngrams = new Map();
    if (n <= text.length) {
        for (let i = 0; i < (text.length - n + 1); i++) {
            let currNgram = text.slice(i, i + n);
            let count = ngrams.get(currNgram) == null ? 0 : ngrams.get(currNgram);
            ngrams.set(currNgram, count + 1);
        }
    }
    return ngrams;
}

/**
 * TODO
 * @returns Map of (ngram: count)
 */
function computeNgramMapWords() {
    alert("hell");
}

/**
 * Triggered when a table-header is clicked.
 * The param depends on which table-header is clicked
 * @param {String} prop prop is either 'ngram' or 'count'
 */
function populateTableSortedBy(prop) {
    switchSortByTo(prop);
    populateTable();
}

/**
 * Switch or set the global 'sortBy' variable
 * sortBy is either: ngramAsc, ngramDesc, countAsc or countDesc
 * 
 * @param {String} prop prop is either 'ngrams' or 'count'
 * - if the prop is the same as it was before, then we switch the suffix of sortBy (Asc to Desc or viseversa)
 * - if the prop is not the same as it was, then we set it to the new prop-value with the Asc suffix
 */
function switchSortByTo(prop) {
    let other = prop == "ngram" ? "count" : "ngram";
    let currentSortBy = window.globalNgrams.sortBy;
    document.getElementById(other + "-dir").innerText = "";
    if (currentSortBy == prop+"Desc") {
        document.getElementById(prop+"-dir").innerText = "↓";
        window.globalNgrams.sortBy = prop+"Asc";
    } else {
        document.getElementById(prop + "-dir").innerText = "↑";
        window.globalNgrams.sortBy = prop + "Desc";
    }
}

/**
 * Print ngrams into the two-column-table:
 * _________________
 * | ngram | count |
 * -----------------
 *
 * The table is sorted according to the value of window.globalNgrams.sortBy
 */
function populateTable() {
    let sortBy = window.globalNgrams.sortBy;
    const ngramsArray = [...window.globalNgrams.ngramMap].map(([ngram, count]) => ({ ngram, count }));
    if ("ngramAsc" == sortBy) {
        ngramsArray.sort((a, b) => a.ngram.localeCompare(b.ngram));
    } else if ("ngramDesc" == sortBy) {
        ngramsArray.sort((a, b) => b.ngram.localeCompare(a.ngram));
    } else if ("countAsc" == sortBy) {
        ngramsArray.sort((a, b) => a.count - b.count);
    } else if ("countDesc" == sortBy) {
        ngramsArray.sort((a, b) => b.count - a.count);
    }

    let outputTablebody = document.getElementById("ngrams-output__bodytable__body");

    removeAllChildrenFromElement(outputTablebody);

    ngramsArray.forEach(e => {
        let row = outputTablebody.insertRow();
        row.insertCell(0).innerHTML = "'" + e.ngram + "'";
        row.insertCell(1).innerHTML = e.count;
    })
};

function removeAllChildrenFromElement(element){
    while (element.firstChild) { element.removeChild(element.firstChild) };
}

/**
 * Print ngrams into a list of list
 * 1. list is of (n-1)-grams
 * 2. list the '-1'-letter of the ngram with the number of occurrences
 */
function printProbabilityTable(){
    let n = window.globalNgrams.n;
    const ngramsArray = [...window.globalNgrams.ngramMap].map(([ngram, count]) => ({ ngram, count }));
    ngramsArray.sort((a, b) => a.ngram.localeCompare(b.ngram));

    let nMinusOneGramMap = new Map();
    for (const ngram of ngramsArray) {
        nMinusOnegram = ngram.ngram.slice(0, n-1);
        var suffixList = nMinusOneGramMap.get(nMinusOnegram);
        if (suffixList == null) {
            suffixList = [];
        }
        let suffix = ngram.ngram.slice(n-1, n);
        let count = ngram.count;
        suffixList.push({ suffix, count });
        nMinusOneGramMap.set(nMinusOnegram, suffixList);
    }
    window.globalNgrams.ngramsTable = nMinusOneGramMap;
}

/**
 * INIT-RUN
 */
 ngrams();