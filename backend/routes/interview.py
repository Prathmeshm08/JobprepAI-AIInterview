from flask import Blueprint, request, jsonify
from vapi.client import start_call, end_call

interview_bp = Blueprint('interview', __name__)

@interview_bp.route('/start-call', methods=['POST'])
def start_call_route():
    data = request.json
    user_id = data.get('userId')
    username = data.get('userName')
    questions = data.get('questions')
    result = start_call(user_id, username, questions)
    return jsonify(result)

@interview_bp.route('/end-call', methods=['POST'])
def end_call_route():
    data = request.json
    call_id = data.get('callId')
    result = end_call(call_id)
    return jsonify(result)

@interview_bp.route('/ask-questions', methods=['POST'])
def ask_questions():
    data = request.json
    skills = data.get('skills', [])
    projects = data.get('projects', [])
    certifications = data.get('certifications', [])
    username = data.get('userName', 'Candidate')
    user_id = data.get('userId', 'unknown')

    questions = []
    for skill in skills:
        questions.append(f"How have you applied {skill} in your work or academics?")
        questions.append(f"What is the most complex task you've done with {skill}?")
    for project in projects:
        questions.append(f"Can you describe your project on {project}?")
        questions.append(f"What challenges did you face in the {project} project?")
    for cert in certifications:
        questions.append(f"What did you learn from your {cert} certification?")
        questions.append(f"How has your {cert} certification helped in practical tasks?")
    questions += [
        "Tell me about a time you solved a difficult problem.",
        "How do you manage your time during multiple tasks?",
        "What do you consider your biggest strength and why?"
    ]
    questions = questions[:15]

    vapi_result = start_call(user_id, username, questions)
    return jsonify({"questions": questions, "vapi": vapi_result}) 

@interview_bp.route('/generate-questions', methods=['POST', 'OPTIONS'])
def generate_questions():
    if request.method == 'OPTIONS':
        return '', 200  # CORS preflight

    data = request.get_json()
    skills = data.get('skills', [])
    projects = data.get('projects', [])
    certifications = data.get('certifications', [])
    extracurriculars = data.get('extracurriculars', [])

    questions = []

    for skill in skills:
        questions.append(f"How have you applied {skill} in your work or academics?")
        questions.append(f"What is the most complex task you've done with {skill}?")

    for project in projects:
        questions.append(f"Can you describe your project on {project}?")
        questions.append(f"What challenges did you face in the {project} project?")

    for cert in certifications:
        questions.append(f"What did you learn from your {cert} certification?")
        questions.append(f"How has your {cert} certification helped in practical tasks?")

    for activity in extracurriculars:
        questions.append(f"How has participating in {activity} helped your personal growth?")
        questions.append(f"Can you share an experience from {activity} that taught you something valuable?")

    questions += [
        "Tell me about a time you solved a difficult problem.",
        "How do you manage your time during multiple tasks?",
        "What do you consider your biggest strength and why?"
    ]

    return jsonify({'questions': questions[:15]}), 200 