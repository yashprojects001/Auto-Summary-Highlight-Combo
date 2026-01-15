const analyzeBtn = document.getElementById("analyzeBtn");
const inputText = document.getElementById("inputText");
const summaryBox = document.getElementById("summaryBox");
const outputText = document.getElementById("outputText");

const cueWords = [
  "important", "significant", "key", "therefore",
  "in conclusion", "result", "main", "critical"
];

analyzeBtn.addEventListener("click", () => {
    const text = inputText.value.trim();
    if (!text) return;

    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
    let scored = [];

    const wordFreq = {};
    text.toLowerCase().split(/\W+/).forEach(w => {
        if (w.length > 3) wordFreq[w] = (wordFreq[w] || 0) + 1;
    });

    sentences.forEach((sentence, index) => {
        let score = 0;
        const lower = sentence.toLowerCase();

        if (index < 3) score += 2;
        if (sentence.length > 80) score += 1;

        cueWords.forEach(word => {
            if (lower.includes(word)) score += 2;
        });

        Object.keys(wordFreq).forEach(w => {
            if (lower.includes(w) && wordFreq[w] > 2) score += 0.3;
        });

        scored.push({ sentence, score });
    });

    scored.sort((a, b) => b.score - a.score);

    const topSentences = scored.slice(0, 3).map(s => s.sentence);

    // Summary
    summaryBox.innerHTML = topSentences.join(" ");

    // Highlight output
    let highlighted = text;
    topSentences.forEach(s => {
        highlighted = highlighted.replace(
            s,
            `<span class="highlight">${s}</span>`
        );
    });

    outputText.innerHTML = highlighted;

    localStorage.setItem("highlightedText", highlighted);
    localStorage.setItem("summary", summaryBox.innerHTML);
});

// Load saved data
window.onload = () => {
    outputText.innerHTML = localStorage.getItem("highlightedText") || "";
    summaryBox.innerHTML = localStorage.getItem("summary") || "";
};
