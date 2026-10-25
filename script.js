
const form = document.getElementById("reviewForm");
const reviewInput = document.getElementById("reviewInput");
const analyzeButton = document.getElementById("analyzeButton");
const resultBox = document.getElementById("resultBox");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const review = reviewInput.value.trim();

    if (!review) {
        resultTitle.textContent = "Review required";
        resultMessage.textContent = "Please enter a product review.";
        resultBox.className = "result-box";
        return;
    }

    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analyzing...";

    resultTitle.textContent = "Analyzing your review";
    resultMessage.textContent = "Please wait...";
    resultBox.className = "result-box";

    try {
        const response = await fetch("https://anytime-taking-unicycle.ngrok-free.dev/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ review: review })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to analyze the review.");
        }

        const sentiment = data.sentiment.toLowerCase();

        if (sentiment === "positive") {
            resultBox.className = "result-box positive";
            resultTitle.textContent = "😊 Positive Sentiment";
            resultMessage.textContent =
                "The model classified this review as positive.";
        } else if (sentiment === "negative") {
            resultBox.className = "result-box negative";
            resultTitle.textContent = "😞 Negative Sentiment";
            resultMessage.textContent =
                "The model classified this review as negative.";
        } else {
            resultBox.className = "result-box";
            resultTitle.textContent = "Prediction Complete";
            resultMessage.textContent = "Model output: " + data.sentiment;
        }

    } catch (error) {
        resultTitle.textContent = "Unable to analyze";
        resultMessage.textContent =
            error.message + " Make sure the backend is running.";
        resultBox.className = "result-box";

    } finally {
        analyzeButton.disabled = false;
        analyzeButton.textContent = "✨ Analyze Sentiment";
    }
});