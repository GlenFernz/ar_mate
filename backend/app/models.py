from pydantic import BaseModel

class ConversationResponse(BaseModel):
    response_text: str
    emotion: str
    animation: str
    audio_output: str
