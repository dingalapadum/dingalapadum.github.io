window.globalNgrams = {};
window.globalNgrams.sortBy = "countAsc";

/**
 * Read the inputs from the ngram-example
 * gram: is either characters
 */
function readNgramInputs() {
    return {
        gram: document.getElementById("ngrams-type").value,
        n: +document.getElementById("n-select").value,
        text: document.getElementById("ngrams-input").value
    }
}

/**
 * create ngrams for the text in  the input-field and output them in a table
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
 * @param n number of words per 'gram'
 * @param text to extract the n-grams from
 * @returns Map of (ngram: count)
 */
function ngramsWords() {
    alert("hell");
}

/**
 * @param n is the n of n-gramss
 * @param {Map<String, Number>} ngrams
 */
function printNgramsToTable(n, ngrams) {
    document.getElementById("ngrams-grams-text").textContent = n + "-grams";
    window.globalNgrams.ngramMap = ngrams;
    populateTableByCount();
}

function populateTableByNGram() {
    let sortBy = window.globalNgrams.sortBy;
    if (sortBy.startsWith("count")) {
        document.getElementById("count-dir").innerText = "";
        document.getElementById("ngram-dir").innerText = "↑";
        window.globalNgrams.sortBy = "ngramsDesc";
    } else if (sortBy == "ngramsAsc") {
        document.getElementById("ngram-dir").innerText = "↑";
        window.globalNgrams.sortBy = "ngramsDesc";
    } else {
        document.getElementById("ngram-dir").innerText = "↓";
        window.globalNgrams.sortBy = "ngramsAsc";
    }
    populateTable(window.globalNgrams.sortBy);
}

function populateTableByCount() {
    let sortBy = window.globalNgrams.sortBy;
    if (sortBy.startsWith("ngrams")) {
        document.getElementById("ngram-dir").innerText = "";
        document.getElementById("count-dir").innerText = "↑";
        window.globalNgrams.sortBy = "countDesc";
    } else if (sortBy == "countAsc") {
        document.getElementById("count-dir").innerText = "↑";
        window.globalNgrams.sortBy = "countDesc";
    } else {
        document.getElementById("count-dir").innerText = "↓";
        window.globalNgrams.sortBy = "countAsc";
    }
    populateTable(window.globalNgrams.sortBy);
}

function replaceCharAtStr(str, index, insert) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + insert + str.substring(index+1);
}



function populateTable(sortBy) {
    window.globalNgrams.sortBy = sortBy;
    const ngramsArray = [...window.globalNgrams.ngramMap].map(([ngram, count]) => ({ ngram, count }));
    if ("ngramsAsc" == sortBy) {
        ngramsArray.sort((a, b) => a.ngram.localeCompare(b.ngram));
    } else if ("ngramsDesc" == sortBy) {
        ngramsArray.sort((a, b) => b.ngram.localeCompare(a.ngram));
    } else if ("countAsc" == sortBy) {
        ngramsArray.sort((a, b) => a.count - b.count);
    } else if ("countDesc" == sortBy) {
        ngramsArray.sort((a, b) => b.count - a.count);
    }

    let outputTablebody = document.getElementById("ngrams-output-body");
    while (outputTablebody.firstChild) { outputTablebody.removeChild(outputTablebody.firstChild) };
    ngramsArray.forEach(e => {
        let row = outputTablebody.insertRow();
        row.insertCell(0).innerHTML = e.ngram;
        row.insertCell(1).innerHTML = e.count;
    })
};


/**
 * INIT-RUN
 */
ngrams()