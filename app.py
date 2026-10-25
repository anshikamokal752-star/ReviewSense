
from flask import Flask, render_template, request, jsonify
import joblib

app = Flask(__name__)

# Load the trained machine learning model
model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    review = data.get("review", "").strip()

    if not review:
        return jsonify({"error": "Please enter a product review."}), 400

    # Convert review into numerical features
    review_vector = vectorizer.transform([review])

    # Predict sentiment
    prediction = model.predict(review_vector)[0]

    return jsonify({
        "sentiment": str(prediction).capitalize()
    })


if __name__ == "__main__":
    app.run(debug=True)