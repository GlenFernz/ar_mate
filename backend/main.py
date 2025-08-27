from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
import shutil
import os
import base64
from transformers import pipeline
import openai
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
from google.cloud import texttospeech

app = FastAPI()

# --- API Keys and Configuration ---
# Make sure to replace "YOUR_OPENAI_API_KEY" with your actual OpenAI API key.
# It is recommended to use environment variables for API keys.
openai.api_key = os.getenv("OPENAI_API_KEY", "YOUR_OPENAI_API_KEY")

# --- Firebase Configuration ---
# Make sure to download your Firebase service account key and set the path.
# It is recommended to use environment variables for the key file path.
try:
    cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH", "path/to/your/serviceAccountKey.json"))
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase initialized successfully.")
except Exception as e:
    print(f"Firebase initialization failed: {e}")
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

# Pydantic model for the response.
# The 'audio_output' field is added to return the synthesized speech as a base64 encoded string.
class ConversationResponse(BaseModel):
    response_text: str
    emotion: str
    animation: str
    audio_output: str

# Service functions

async def speech_to_text(audio_file_path: str) -> str:
    """Converts speech from an audio file to text using Whisper API."""
    if not openai.api_key or openai.api_key == "YOUR_OPENAI_API_KEY":
        print("OpenAI API key not set. Returning a dummy transcript.")
        return "This is a dummy transcript because the OpenAI API key is not configured."

    print(f"Speech-to-Text for {audio_file_path}")
    try:
        with open(audio_file_path, "rb") as audio_file:
            transcript = openai.Audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
        return transcript.text
    except Exception as e:
        print(f"Error in speech-to-text: {e}")
        raise HTTPException(status_code=500, detail="Error in speech-to-text conversion.")

async def get_gpt_response(text: str) -> str:
    """Generates a conversational response using OpenAI GPT API."""
    if not openai.api_key or openai.api_key == "YOUR_OPENAI_API_KEY":
        print("OpenAI API key not set. Returning a dummy response.")
        return f"This is a dummy response because the OpenAI API key is not configured."

    print(f"Getting GPT response for: '{text}'")
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
    """Detects the emotion from the text using a Hugging Face model."""
    classifier = get_emotion_classifier()
    if not classifier:
        print("Emotion classifier not available. Returning neutral.")
        return "neutral"

    print(f"Detecting emotion for: '{text}'")
    try:
        result = classifier(text)
        emotion = result[0]['label']
        # Map the model's labels to our desired emotion tags
        label_map = {
            "joy": "happy",
            "sadness": "sad",
            "anger": "angry",
        }
        return label_map.get(emotion, "neutral")
    except Exception as e:
        print(f"Error in emotion detection: {e}")
        return "neutral"

def get_animation_for_emotion(emotion: str) -> str:
    """Maps an emotion to a corresponding animation trigger."""
    animation_map = {
        "happy": "wave",
        "sad": "comfort",
        "angry": "angry_gesture",
        "neutral": "nod",
    }
    return animation_map.get(emotion, "idle")

from google.cloud import texttospeech

async def text_to_speech(text: str) -> str:
    """Converts text to speech using Google TTS and returns it as a base64 encoded string."""
    client = get_tts_client()
    if not client:
        print("Google TTS client not available. Returning a dummy audio.")
        dummy_audio_content = b"dummy_audio_data"
        return base64.b64encode(dummy_audio_content).decode('utf-8')

    print(f"Text-to-Speech for: '{text}'")
    try:
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US", ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )
        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )
        return base64.b64encode(response.audio_content).decode('utf-8')
    except Exception as e:
        print(f"Error in text-to-speech conversion: {e}")
        raise HTTPException(status_code=500, detail="Error in text-to-speech conversion.")


@app.post("/conversation/", response_model=ConversationResponse)
async def handle_conversation(file: UploadFile = File(...)):
    """
    Handles the conversation flow:
    1. Receives an audio file.
    2. Converts speech to text.
    3. Generates a response with GPT.
    4. Detects the emotion of the response.
    5. Maps the emotion to an animation.
    6. Converts the response text to speech.
    7. Returns all the information in a JSON response.
    """
    if not file.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail="File provided is not an audio file.")

    temp_file_path = f"temp_{file.filename}"
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 1. Speech-to-Text
        transcript = await speech_to_text(temp_file_path)

        # 2. Get GPT response
        gpt_response = await get_gpt_response(transcript)

        # 3. Emotion Detection
        emotion = await get_emotion(gpt_response)

        # 4. Map emotion to animation
        animation = get_animation_for_emotion(emotion)

        # 5. Text-to-Speech for the response
        audio_output_base64 = await text_to_speech(gpt_response)

        interaction_data = {
            "user_id": "rest_user",
            "timestamp": datetime.utcnow(),
            "user_input": transcript,
            "response_text": gpt_response,
            "emotion": emotion,
            "animation": animation
        }
        store_interaction(interaction_data)

        return ConversationResponse(
            response_text=gpt_response,
            emotion=emotion,
            animation=animation,
            audio_output=audio_output_base64
        )
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

def store_interaction(interaction_data: dict):
    """Stores interaction data in Firestore."""
    if db:
        try:
            doc_ref = db.collection('interactions').document()
            doc_ref.set(interaction_data)
            print(f"Interaction stored successfully for user: {interaction_data.get('user_id')}")
        except Exception as e:
            print(f"Error storing interaction: {e}")

from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    print(f"WebSocket connection established for user: {user_id}")
    try:
        while True:
            data = await websocket.receive()
            if "text" in data:
                text = data["text"]
                # Process text message
                gpt_response = await get_gpt_response(text)
                emotion = await get_emotion(gpt_response)
                animation = get_animation_for_emotion(emotion)
                audio_output_base64 = await text_to_speech(gpt_response)

                interaction_data = {
                    "user_id": user_id,
                    "timestamp": datetime.utcnow(),
                    "user_input": text,
                    "response_text": gpt_response,
                    "emotion": emotion,
                    "animation": animation
                }
                store_interaction(interaction_data)

                await websocket.send_json({
                    "response_text": gpt_response,
                    "emotion": emotion,
                    "animation": animation,
                    "audio_output": audio_output_base64
                })
            elif "bytes" in data:
                audio_data = data["bytes"]
                # Process audio message
                temp_file_path = f"temp_ws_audio_{user_id}.wav"
                with open(temp_file_path, "wb") as f:
                    f.write(audio_data)

                try:
                    transcript = await speech_to_text(temp_file_path)
                    gpt_response = await get_gpt_response(transcript)
                    emotion = await get_emotion(gpt_response)
                    animation = get_animation_for_emotion(emotion)
                    audio_output_base64 = await text_to_speech(gpt_response)

                    interaction_data = {
                        "user_id": user_id,
                        "timestamp": datetime.utcnow(),
                        "user_input": transcript,
                        "response_text": gpt_response,
                        "emotion": emotion,
                        "animation": animation
                    }
                    store_interaction(interaction_data)

                    await websocket.send_json({
                        "response_text": gpt_response,
                        "emotion": emotion,
                        "animation": animation,
                        "audio_output": audio_output_base64
                    })
                finally:
                    if os.path.exists(temp_file_path):
                        os.remove(temp_file_path)
    except WebSocketDisconnect:
        print(f"WebSocket connection closed for user: {user_id}")
    except Exception as e:
        print(f"WebSocket error for user {user_id}: {e}")
        await websocket.close(code=1011, reason="An error occurred")


@app.get("/")
def read_root():
    return {"Hello": "World"}
