from flask import Blueprint, request, jsonify

webhook_bp = Blueprint('webhook', __name__)

@webhook_bp.route('/webhook/vapi', methods=['POST'])
def vapi_webhook():
    event = request.json
    # TODO: Handle Vapi events (transcript, call start/end, etc.)
    print("Received Vapi event:", event)
    return jsonify({"status": "received"}) 