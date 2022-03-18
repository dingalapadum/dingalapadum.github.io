window.globalNgrams = {};
window.globalNgrams.sortBy = "countDesc";

/**
 * create ngrams for the text in the input-field and output them in a table
 */
function ngrams() {
    const { gram, n, text } = readNgramInputs();
    let ngrams = null;
    if (gram == "characters") {
        ngrams = ngramsCharacters(n, text);
    } else if (gram == "words") {
        ngrams = ngramsWords(n, text);
    } else {
        throw "gram should be either 'characters' or 'words' - other values are not ok";
    }
    globalNgrams.ngramMap = ngrams;
    printNgramsToTable(n, globalNgrams.ngramMap);
    printProbabilityTable(n, globalNgrams.ngramMap);
}

/**
 * Read the inputs from the ngram-example
 * gram: is the 'type'. i.e.: either characters or words
 * n: is the number of elements
 * text: is the text to analyze
 */
 function readNgramInputs() {
    return {
        gram: document.getElementById("ngrams-type").value,
        n: +document.getElementById("n-select").value,
        text: document.getElementById("ngrams-input").value
    }
}

/** 
 * @param n number of characters per 'gram'
 * @param text to extract the n-grams from
 * @returns Map of (ngram: count)
 */
function ngramsCharacters(n, text) {
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
 * @param n number of words per 'gram'
 * @param text to extract the n-grams from
 * @returns Map of (ngram: count)
 */
function ngramsWords() {
    alert("hell");
}


/**
 * Print ngrams into the two-column-table:
 * _________________
 * | ngram | count |
 * -----------------
 * @param n is the n of n-gramss
 * @param {Map<String, Number>} ngrams
 */
function printNgramsToTable(n, ngrams) {
    // fill in the header
    document.getElementById("ngrams-grams-text").textContent = n + "-grams";
    window.globalNgrams.ngramMap = ngrams;
    populateTable(window.globalNgrams.sortBy);
}

/**
 * triggered when either the ngram- or count-header gets clicked
 */
function populateTableSortedBy(prop) {
    let sortBy = switchSortByTo(prop);
    populateTable(sortBy);
}

/**
 * Switch or set the global 'sortBy' variable
 * sortBy is either: ngramAsc, ngramDesc, countAsc or countDesc
 * 
 * @param String prop is either 'ngrams' or 'count'
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
    return window.globalNgrams.sortBy;
}


function populateTable(sortBy) {
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
 * @param n is the n of n-gramss
 * @param {Map<String, Number>} ngrams
 */
function printProbabilityTable(n, ngrams){
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