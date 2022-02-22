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
    globalNgrams = ngrams
    printNgramsToTable(n, globalNgrams);
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
 * @param n is the n of n-grams
 * @param {Map<String, Number>} ngrams
 */
function printNgramsToTable(n, ngrams, sortBy = "ngram") {
    document.getElementById("ngrams-th").textContent = n + "-grams";

    const ngramsArray = Array.from(ngrams).map(([ngram, count]) => ({ ngram, count }));
    if (sortBy == "ngram") {
        ngramsArray.sort((a, b) => a.ngram.localeCompare(b.ngram));
    } else if (sortBy == "count") {
        ngramsArray.sort((a, b) => a.count - b.count);
    }

    let outputTablebody = document.getElementById("ngrams-output-body");
    while (outputTablebody.firstChild) { outputTablebody.removeChild(outputTablebody.firstChild) };
    ngramsArray.forEach(e => {
        let row = outputTablebody.insertRow();
        row.insertCell(0).innerHTML = e.ngram;
        row.insertCell(1).innerHTML = e.count;
    })
}

/**
 * INIT-RUN
 */
ngrams()