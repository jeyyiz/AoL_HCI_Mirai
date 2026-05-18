from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')
CORS(app)

model = joblib.load('model.pkl')

# Patch untuk kompatibilitas sklearn lintas versi
if not hasattr(model, 'monotonic_cst'):
    model.monotonic_cst = None

@app.route('/')
def home():
    return render_template('screening.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        answers = data.get('answers')
        gender_encoded = data.get('gender')

        if answers is None or len(answers) != 10 or gender_encoded is None:
            return jsonify({'error': 'Data kuis atau gender tidak lengkap'}), 400

        features = answers + [gender_encoded]
        features_array = np.array([features])

        prediction = model.predict(features_array)
        result = int(prediction[0])

        return jsonify({
            'success': True,
            'prediction': result
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/positive')
def positive_page():
    return render_template('positive.html')

@app.route('/negative')
def negative_page():
    return render_template('negative.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)