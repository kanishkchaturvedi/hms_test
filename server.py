import json
import pytesseract
from PIL import Image
from flask import Flask, request, jsonify, send_from_directory
from pyngrok import ngrok
from flask_cors import CORS
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

# Set your MistralAI API key
api_key = "6T5yjmRNbcpgG7o03v8UKGsInOD3qApU"

# **Make sure this authtoken is correct and has been generated from your ngrok dashboard**
ngrok.set_auth_token("2iEgRcaFFpvVbY6JM9D7S66G4cQ_72WaByS4ZfuMDDF3fuuyX")

model = "mistral-large-latest"

# Ngrok tunnel setup - Configure the tunnel for HTTPv2 with the port
tunnel = ngrok.connect(5000, bind_tls=True)  # Use bind_tls=True for HTTPS
public_url = tunnel.public_url
print('Ngrok Tunnel URL:', public_url)

# Initialize Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

client = MistralClient(api_key=api_key)

# OCR function to extract text from images
def ocr_image(file):
    image = Image.open(file)
    text = pytesseract.image_to_string(image)
    return text

# Function to summarize patient history using OpenAI API
def summarize_patient_history(history_text):
    chat_response = client.chat(
        model=model,
        messages=[ChatMessage(role="user", content=f"Summarize the following patient history in bullet points: {history_text}")]
    )
    summary = chat_response.choices[0].message.content
    return summary

# Function to suggest treatments based on diagnosis using OpenAI API
def suggest_treatment(diagnosis):
    chat_response = client.chat(
        model=model,
        messages=[ChatMessage(role="system", content=f"You are a medical assistant."),
                  ChatMessage(role="user", content=f"Suggest treatments for the following diagnosis: {diagnosis}")]
    )
    summary = chat_response.choices[0].message.content
    return summary

# Routes definitions with CORS-enabled
@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        data = request.get_json()
        if data is None or 'history' not in data:
            return jsonify({'error': 'Invalid JSON or missing history field'}), 400

        history_text = data.get('history')
        summary = summarize_patient_history(history_text)

        return jsonify({'summary': summary}), 200
    except Exception as e:
        print(f"Error in summarizing patient history: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/suggest', methods=['POST'])
def suggest():
    try:
        print("Received request")
        data = request.get_json()
        diagnosis = data.get('diagnosis')
        suggestions = suggest_treatment(diagnosis)
        return jsonify({'suggestions': suggestions}), 200
    except Exception as e:
        print(f"Error in /suggest route: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/upload', methods=['POST'])
def upload():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        text = ocr_image(file)
        return jsonify({'extracted_text': text}), 200
    except Exception as e:
        print(f"Error in /upload route: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/ngrok-url', methods=['GET'])
def get_ngrok_url():
    return jsonify({'ngrok_url': public_url}), 200

@app.route('/')
def serve_index():
    return send_from_directory('', 'index.html')
