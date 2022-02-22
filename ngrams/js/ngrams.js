const output = document.getElementById('ngrams-output');

ngrams()
function ngrams() {
    let gram = document.getElementById("ngrams-type").value;
    if (gram == "characters") {
        ngramsCharacters();
    }else if (gram == "words") {
        ngramsWords();
    }
}

function ngramsCharacters() {
    let input = document.getElementById("ngrams-input").value;
    let n = +document.getElementById("n-select").value;
    let ngrams = new Map();
    if (n <= input.length){
        for (let i=0; i<(input.length-n+1); i++) {
            let currNgram = input.slice(i,i+n);
            let count = ngrams.get(currNgram) == null ? 0 : ngrams.get(currNgram);
            ngrams.set(currNgram, count + 1);
        }
    }
    const ngramsArray = Array.from(ngrams).map(([ngram, count]) => (JSON.stringify({ngram, count})));
    output.textContent = n + "-grams:" + ngramsArray.join(', ');
}

function ngramsWords() {
    alert("hell")
}