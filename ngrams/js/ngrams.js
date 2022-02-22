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
    let ngrams = [];

    if (n <= input.length){
        for (let i=0; i<(input.length-n+1); i++) {
            let currNgram = input.slice(i,i+n);
            ngrams.push('"' +currNgram + '"');
        }
    }
    let uniq = [...new Set(ngrams)];
    output.textContent = n + "-grams: " + uniq.join(', ');
}

function ngramsWords() {
    alert("hell")
}