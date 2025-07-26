import os
import requests
from dotenv import load_dotenv

load_dotenv()

VAPI_API_KEY = os.getenv("VAPI_API_KEY")
VAPI_BASE_URL = "https://api.vapi.ai/v1"

def start_call(user_id, username, questions=None):
    url = f"{VAPI_BASE_URL}/calls"
    headers = {
        "Authorization": f"Bearer {VAPI_API_KEY}",
        "Content-Type": "application/json"
    }
    questions_text = "\n".join([f"- {q}" for q in questions]) if questions else ""
    payload = {
        "userId": user_id,
        "username": username,
        "questions": questions_text
    }
    response = requests.post(url, json=payload, headers=headers)
    try:
        return response.json()
    except Exception:
        return {"error": "Failed to connect to Vapi", "details": response.text}

def end_call(call_id):
    url = f"{VAPI_BASE_URL}/calls/{call_id}/end"
    headers = {"Authorization": f"Bearer {VAPI_API_KEY}"}
    response = requests.post(url, headers=headers)
    try:
        return response.json()
    except Exception:
        return {"error": "Failed to end Vapi call", "details": response.text} 