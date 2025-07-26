from flask import Blueprint, request, jsonify
import os
import fitz  # PyMuPDF
from vapi.client import start_call

upload_bp = Blueprint('upload', __name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def extract_text_from_pdf(filepath):
    text = ""
    with fitz.open(filepath) as doc:
        for page in doc:
            text += page.get_text()  # type: ignore[attr-defined]
    return text

@upload_bp.route('/upload', methods=['POST'])
def upload_resume():
    file = request.files.get('resume')
    user_id = request.form.get('userId', 'unknown')
    username = request.form.get('userName', 'Candidate')
    if file:
        filename = file.filename or "uploaded_resume.pdf"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        text = extract_text_from_pdf(filepath)

        skill_keywords = ['Python', 'Java', 'SQL', 'AI', 'ML', 'Communication', 'Teamwork']
        project_keywords = ['chatbot', 'recommendation', 'detection', 'prediction', 'automation']
        cert_keywords = ['Coursera', 'NPTEL', 'Udemy', 'AWS', 'Azure', 'Google']
        extra_keywords = ['sports', 'volunteering', 'music', 'dance', 'club', 'leadership']

        found_skills = [kw for kw in skill_keywords if kw.lower() in text.lower()]
        found_projects = [kw for kw in project_keywords if kw.lower() in text.lower()]
        found_certs = [kw for kw in cert_keywords if kw.lower() in text.lower()]
        found_extras = [kw for kw in extra_keywords if kw.lower() in text.lower()]

        score = int((len(found_skills) / len(skill_keywords)) * 100)

        # Use the same question generation logic as provided
        questions = []
        for skill in found_skills:
            questions.append(f"How have you applied {skill} in your work or academics?")
            questions.append(f"What is the most complex task you've done with {skill}?")
        for project in found_projects:
            questions.append(f"Can you describe your project on {project}?")
            questions.append(f"What challenges did you face in the {project} project?")
        for cert in found_certs:
            questions.append(f"What did you learn from your {cert} certification?")
            questions.append(f"How has your {cert} certification helped in practical tasks?")
        for activity in found_extras:
            questions.append(f"How has participating in {activity} helped your personal growth?")
            questions.append(f"Can you share an experience from {activity} that taught you something valuable?")
        questions += [
            "Tell me about a time you solved a difficult problem.",
            "How do you manage your time during multiple tasks?",
            "What do you consider your biggest strength and why?"
        ]
        questions = questions[:15]

        # Start Vapi interview
        vapi_result = start_call(user_id, username, questions)

        return jsonify({
            'score': score,
            'skills': found_skills,
            'projects': found_projects,
            'certifications': found_certs,
            'extracurriculars': found_extras,
            'text': text,
            'questions': questions,
            'vapi': vapi_result
        }), 200

    return jsonify({'error': 'No file uploaded'}), 400 