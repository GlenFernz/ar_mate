import os
import base64
import openai
import firebase_admin
from firebase_admin import credentials, firestore
from transformers import pipeline
from google.cloud import texttospeech
from fastapi import HTTPException

# --- API Keys and Configuration ---
openai.api_key = os.getenv("OPENAI_API_KEY", "YOUR_OPENAI_API_KEY")

# --- Firebase Configuration ---
db = None
try:
    cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH", "path/to/your/serviceAccountKey.json"))
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase initialized successfully in services.")
except Exception as e:
    print(f"Firebase initialization failed in services: {e}")
    db = None

# Lazily loaded models and clients
emotion_classifier = None
tts_client = None

def get_emotion_classifier():
    global emotion_classifier
    if emotion_classifier is None:
        emotion_classifier = pipeline("sentiment-analysis", model="michellejieli/emotion_text_classifier")
    return emotion_classifier

def get_tts_client():
    global tts_client
    if tts_client is None:
        try:
            tts_client = texttospeech.TextToSpeechClient()
        except Exception as e:
            print(f"Failed to initialize Google TTS client: {e}")
            return None
    return tts_client

async def speech_to_text(audio_file_path: str) -> str:
    if not openai.api_key or openai.api_key == "YOUR_OPENAI_API_KEY":
        print("OpenAI API key not set. Returning a dummy transcript.")
        return "This is a dummy transcript because the OpenAI API key is not configured."
    try:
        with open(audio_file_path, "rb") as audio_file:
            transcript = openai.Audio.transcriptions.create(model="whisper-1", file=audio_file)
        return transcript.text
    except Exception as e:
        print(f"Error in speech-to-text: {e}")
        raise HTTPException(status_code=500, detail="Error in speech-to-text conversion.")

async def get_gpt_response(text: str) -> str:
    if not openai.api_key or openai.api_key == "YOUR_OPENAI_API_KEY":
        print("OpenAI API key not set. Returning a dummy response.")
        return f"This is a dummy response because the OpenAI API key is not configured."
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a friendly and helpful AR assistant."},
                {"role": "user", "content": text}
            ],
            max_tokens=150
        )
        return response.choices[0].message['content'].strip()
    except Exception as e:
        print(f"Error in GPT response generation: {e}")
        raise HTTPException(status_code=500, detail="Error in generating GPT response.")

async def get_emotion(text: str) -> str:
    classifier = get_emotion_classifier()
    if not classifier:
        print("Emotion classifier not available. Returning neutral.")
        return "neutral"
    try:
        result = classifier(text)
        emotion = result[0]['label']
        label_map = {"joy": "happy", "sadness": "sad", "anger": "angry"}
        return label_map.get(emotion, "neutral")
    except Exception as e:
        print(f"Error in emotion detection: {e}")
        return "neutral"

def get_animation_for_emotion(emotion: str) -> str:
    animation_map = {"happy": "wave", "sad": "comfort", "angry": "angry_gesture", "neutral": "nod"}
    return animation_map.get(emotion, "idle")

async def text_to_speech(text: str) -> str:
    client = get_tts_client()
    if not client:
        print("Google TTS client not available. Returning a dummy audio.")
        dummy_audio_content = b"dummy_audio_data"
        return base64.b64encode(dummy_audio_content).decode('utf-8')
    try:
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(language_code="en-US", ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL)
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
        response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
        return base64.b64encode(response.audio_content).decode('utf-8')
    except Exception as e:
        print(f"Error in text-to-speech conversion: {e}")
        raise HTTPException(status_code=500, detail="Error in text-to-speech conversion.")

def store_interaction(interaction_data: dict):
    if db:
        try:
            doc_ref = db.collection('interactions').document()
            doc_ref.set(interaction_data)
            print(f"Interaction stored successfully for user: {interaction_data.get('user_id')}")
        except Exception as e:
            print(f"Error storing interaction: {e}")
