// The object that holds all global information
window.globalNgrams = {};

// By what the table containg the (grams: count) should be sorted by
// Is one of either: ngramAsc, ngramDesc, countAsc or countDesc
window.globalNgrams.sortBy = "countDesc";

// What are we using as a gram? a Character or a word?
// TODO: actually for the moment this is only characters
window.globalNgrams.type = "character";

// The input text, i.e. the one from which we learn the distrbution
window.globalNgrams.text = "";

// The gram-size we count occurrences of
// I.e n-1 is the size of the grams between transitions
window.globalNgrams.n = 2;

// Maps grams to a count - the number of times the gram appears
window.globalNgrams.ngramMap = {};

// A map that for each gram stores the 'follow-up grams'
// <gramSource, [(gramTarget: count)]>
// E.g. "a": [{gram: "s", count: 3}, {gram: "d", count: 5}] means 
// that 3 times a 's' came after an 'a' and 5 times a 'd' came after an 'a'
window.globalNgrams.transitionTable = {};

// Whether the transitiontable should be dispalyed with the counts or with the probabilities
window.globalNgrams.transitionTableAsProb = false;

// Used for textgeneration. Which is the current gram?
window.globalNgrams.currGram = "";

// The generated text
window.globalNgrams.generatedText = "";

// how many more letters to write
window.globalNgrams.stepsLeft = 20;


/**
 * create ngrams for the text in the input-field and output them in a table
 */
function ngrams() {
    setGlobalInputs();
    computeNgramMap();
    updateTextOccurrences();
    populateNgramTable();
    createNMinusOneGramTable();
    populateTransitionTable();
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
    [...document.getElementsByClassName("four-gram-example")].forEach(element => element.textContent = window.globalNgrams.type == "character" ? "boat" : "That car is nice");
    [...document.getElementsByClassName("three-gram-example-one")].forEach(element => element.textContent = window.globalNgrams.type == "character" ? "boa" : "That car is");
    [...document.getElementsByClassName("three-gram-example-two")].forEach(element => element.textContent = window.globalNgrams.type == "character" ? "oat" : "car is nice");
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
    alert("I'm really sorry, I have not implemented this yet");
}

/**
 * Triggered when a table-header is clicked.
 * The param depends on which table-header is clicked
 * @param {String} prop prop is either 'ngram' or 'count'
 */
function populateTableSortedBy(prop) {
    switchSortByTo(prop);
    populateNgramTable();
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
function populateNgramTable() {
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
        let ngramCell = row.insertCell(0);
        ngramCell.innerHTML = "'" + e.ngram + "'";
        ngramCell.className="fifty-percent";
        let countCell = row.insertCell(1);
        countCell.innerHTML = e.count;
        countCell.className="fifty-percent";
    })
};

/**
 * Print ngrams into a list of list
 * 1. list is of (n-1)-grams
 * 2. list is the list of the 'n-1'-gram that follow together with the number of occurrences number of occurrences
 */
function createNMinusOneGramTable(){
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
        let suffix = ngram.ngram.slice(1, n);
        let count = ngram.count;
        suffixList.push({ gram: suffix, count: count });
        nMinusOneGramMap.set(nMinusOnegram, suffixList);
    }
    window.globalNgrams.transitionTable = nMinusOneGramMap;
}

function switchTransitionTable() {
    window.globalNgrams.transitionTableAsProb = !window.globalNgrams.transitionTableAsProb;
    populateTransitionTable();

    let transitionTable = document.getElementById("transition-table-button");
    transitionTable.innerHTML = window.globalNgrams.transitionTableAsProb ? "Show counts" : "Show probabilites";
}

function populateTransitionTable() {
    const asProb = window.globalNgrams.transitionTableAsProb;
    const transitions = window.globalNgrams.transitionTable;
    clearTransitionTable();
    for (let [sourceGram, targetGrams] of transitions.entries()) {
        let sourceGramCell = createTransitionTableSource(sourceGram);
        document.getElementById("transition-table__body__source").appendChild(sourceGramCell);
        let targetGramRow = createTransitionTableTargetRow(targetGrams);
        document.getElementById("transition-table__body__targets").appendChild(targetGramRow);
    }
}

function clearTransitionTable() {
    let transitionTableSources = document.getElementById("transition-table__body__source");
    removeAllChildrenFromElement(transitionTableSources);
    let transitionTableTargets = document.getElementById("transition-table__body__targets");
    removeAllChildrenFromElement(transitionTableTargets);
}

function createTransitionTableSource(sourceGram) {
    const sourceGramDiv = document.createElement("div");
    sourceGramDiv.className = "transition-table__elements";
    sourceGramDiv.innerHTML = "'" + sourceGram + "': ";
    return sourceGramDiv;
}

function createTransitionTableTargetRow(targetGrams) {
    const tableRow = document.createElement("div");
    tableRow.className = "transition-table__row";
    const asProb = window.globalNgrams.transitionTableAsProb;
    if (asProb) {
        let totalTransitions = targetGrams.reduce((prevVal, currNgram) => prevVal + currNgram.count, 0);
        for (let toGram of targetGrams) {
            const targetGram = document.createElement("div");
            targetGram.className = "transition-table__elements";
            targetGram.innerHTML = `'${toGram.gram}': ${roundToTwoDecimals(100/totalTransitions*toGram.count)}%`;
            tableRow.appendChild(targetGram);
        }
    } else {
        for (let toGram of targetGrams) {
            const targetGram = document.createElement("div");
            targetGram.className = "transition-table__elements";
            targetGram.innerHTML = `'${toGram.gram}': ${toGram.count}`;
            tableRow.appendChild(targetGram);
        }
    }
    return tableRow;
}

function roundToTwoDecimals(num){
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

function removeAllChildrenFromElement(element){
    if(element != null) {
        while (element.firstChild) { element.removeChild(element.firstChild) };
    }
}


async function generateText(){
    document.querySelectorAll(".deadend").forEach(e => e.remove());
    window.globalNgrams.stepsLeft = document.getElementById("steps-left").value;
    let initialNumberOfSteps = window.globalNgrams.stepsLeft;
    while (window.globalNgrams.stepsLeft > 0) {
        try {
            let sleepTime = (10-document.getElementById("speed").value)*100;
            generateNextLetter();
            await sleep(sleepTime);
        } catch (error) {
            return;
        }
        window.globalNgrams.stepsLeft--;
        document.getElementById("steps-left").value = window.globalNgrams.stepsLeft;
    }
    document.getElementById("steps-left").value = initialNumberOfSteps;
    updateScroll();
}

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

function generateNextLetter() {
    let outputParagraph = document.getElementById("textOutput");
    
    let transitionTable = window.globalNgrams.transitionTable;

    let currGram = window.globalNgrams.currGram;
    // Generate initial gram if needed
    if (currGram == "") {
        let nGrams = transitionTable.size;
        let idx = Math.floor(Math.random()*nGrams);
        let grams = [...transitionTable.keys()];
        currGram = grams[idx];
        window.globalNgrams.generatedText = currGram;
    }else {
        try {
            let gramSize = window.globalNgrams.n;
            currGram = getNextGram(transitionTable.get(currGram));
            window.globalNgrams.generatedText += currGram.slice(gramSize-2);
        } catch (error) {
            const paragraph = document.createElement("p");
            paragraph.innerText = "Reached dead end. Restarting with a random gram.";
            paragraph.className="deadend";
            document.getElementById("scrollable-output").after(paragraph);
            console.log(currGram);
            window.globalNgrams.currGram = "";
            throw "dead end";
        }
    }
    outputParagraph.innerText = window.globalNgrams.generatedText;
    window.globalNgrams.currGram = currGram;
}

/**
 * Returns a gram at random from the targetGrams according to the distribution
 * given by the counts
 *
 * @param {Object[]} targetGrams
 * @param {string} targetGrams[].gram
 * @param {number} targetGrams[].count
 */
function getNextGram(targetGrams) {
    let totalCount = targetGrams.reduce((prevVal, currNgram) => prevVal + currNgram.count, 0);
    let idx = Math.floor(Math.random()*totalCount);
    let currCandidate = 0;
    let accum =  targetGrams[currCandidate].count;
    while (accum <= idx) {
        currCandidate++;
        accum += targetGrams[currCandidate].count;
    }
    return targetGrams[currCandidate].gram;
}

function clearGeneratedText() {
    let ouputParagraph = document.getElementById("textOutput");
    document.querySelectorAll(".deadend").forEach(e => e.remove());
    window.globalNgrams.generatedText = "";
    ouputParagraph.innerText = window.globalNgrams.generatedText;
    window.globalNgrams.currGram = "";
}

function updateScroll(){
    var element = document.getElementById("scrollable-output");
    element.scrollTop = element.scrollHeight;
}

/**
 * INIT-RUN
 */
 ngrams();