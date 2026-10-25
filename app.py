import os
from pathlib import Path

import joblib
from flask import Flask, jsonify, render_template, request

BASE_DIR = Path(__file__).resolve().parent

app = Flask(__name__)

model = joblib.load(BASE_DIR / "model.pkl")
vectorizer = joblib.load(BASE_DIR / "vectorizer.pkl")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    review = data.get("review", "").strip()

    if not review:
        return jsonify({"error": "Please enter a review"}), 400

    review_vector = vectorizer.transform([review])
    prediction = str(model.predict(review_vector)[0]).lower()

    return jsonify({"sentiment": prediction})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
