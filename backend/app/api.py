from fastapi import APIRouter, File, UploadFile, HTTPException, WebSocket, WebSocketDisconnect
from .models import ConversationResponse
from . import services
import shutil
import os
from datetime import datetime

router = APIRouter()

@router.post("/conversation/", response_model=ConversationResponse)
async def handle_conversation(file: UploadFile = File(...)):
    if not file.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail="File provided is not an audio file.")

    temp_file_path = f"temp_{file.filename}"
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        transcript = await services.speech_to_text(temp_file_path)
        gpt_response = await services.get_gpt_response(transcript)
        emotion = await services.get_emotion(gpt_response)
        animation = services.get_animation_for_emotion(emotion)
        audio_output_base64 = await services.text_to_speech(gpt_response)

        interaction_data = {
            "user_id": "rest_user",
            "timestamp": datetime.utcnow(),
            "user_input": transcript,
            "response_text": gpt_response,
            "emotion": emotion,
            "animation": animation
        }
        services.store_interaction(interaction_data)

        return ConversationResponse(
            response_text=gpt_response,
            emotion=emotion,
            animation=animation,
            audio_output=audio_output_base64
        )
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive()
            if "text" in data:
                text = data["text"]
                gpt_response = await services.get_gpt_response(text)
                emotion = await services.get_emotion(gpt_response)
                animation = services.get_animation_for_emotion(emotion)
                audio_output_base64 = await services.text_to_speech(gpt_response)

                interaction_data = {
                    "user_id": user_id,
                    "timestamp": datetime.utcnow(),
                    "user_input": text,
                    "response_text": gpt_response,
                    "emotion": emotion,
                    "animation": animation
                }
                services.store_interaction(interaction_data)

                await websocket.send_json({
                    "response_text": gpt_response,
                    "emotion": emotion,
                    "animation": animation,
                    "audio_output": audio_output_base64
                })
            elif "bytes" in data:
                audio_data = data["bytes"]
                temp_file_path = f"temp_ws_audio_{user_id}.wav"
                with open(temp_file_path, "wb") as f:
                    f.write(audio_data)

                try:
                    transcript = await services.speech_to_text(temp_file_path)
                    gpt_response = await services.get_gpt_response(transcript)
                    emotion = await services.get_emotion(gpt_response)
                    animation = services.get_animation_for_emotion(emotion)
                    audio_output_base64 = await services.text_to_speech(gpt_response)

                    interaction_data = {
                        "user_id": user_id,
                        "timestamp": datetime.utcnow(),
                        "user_input": transcript,
                        "response_text": gpt_response,
                        "emotion": emotion,
                        "animation": animation
                    }
                    services.store_interaction(interaction_data)

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

@router.get("/")
def read_root():
    return {"Hello": "World"}
