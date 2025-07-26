from flask import Blueprint, request, jsonify
import os
import openai
import json
import re

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/save-feedback', methods=['POST'])
def save_feedback():
    data = request.json
    # TODO: Save feedback logic
    return jsonify({'success': True, 'feedbackId': 'some_id'})

@feedback_bp.route('/ai-evaluate', methods=['OPTIONS'])
def ai_evaluate_options():
    return '', 200

@feedback_bp.route('/ai-evaluate', methods=['POST'])
def ai_evaluate():
    data = request.json
    transcript = data.get('transcript', '')
    resume_url = data.get('resumeUrl', '')

    print("Transcript sent to OpenAI:", transcript)
    openai_api_key = os.getenv('OPENAI_API_KEY')
    print("OpenAI Key used:", openai_api_key)

    # Enhanced prompt for comprehensive evaluation
    prompt = f"""
You are an expert interview coach and technical recruiter. Analyze the following interview transcript and provide a detailed evaluation.

INTERVIEW TRANSCRIPT:
{transcript}

RESUME CONTEXT (if available):
{resume_url}

Please provide a comprehensive evaluation in the following JSON format:

{{
  "overallScore": <score out of 10>,
  "communicationScore": <score out of 10>,
  "clarityScore": <score out of 10>,
  "technicalScore": <score out of 10>,
  "suggestions": [
    "<specific improvement suggestion 1>",
    "<specific improvement suggestion 2>",
    "<specific improvement suggestion 3>"
  ],
  "developmentAreas": "<detailed paragraph about what the candidate needs to develop for better future performance>",
  "strengths": [
    "<specific strength 1>",
    "<specific strength 2>"
  ],
  "analysis": "<brief analysis of the interview performance>"
}}

EVALUATION CRITERIA:
- Communication Score: Clarity, pace, confidence, articulation
- Clarity Score: How well the candidate expressed their thoughts
- Technical Score: Depth of knowledge, problem-solving ability
- Overall Score: Composite of all factors

IMPORTANT:
- Base scores on actual transcript content, not generic responses
- Provide specific, actionable suggestions
- Identify real strengths and weaknesses from the conversation
- If transcript is empty or poor quality, provide appropriate feedback
- Scores should vary based on actual performance
"""

    # Use OpenAI if API key is set, else use enhanced fallback
    if openai_api_key:
        openai.api_key = openai_api_key
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.7
            )
            try:
                ai_result = json.loads(response.choices[0].message['content'])
                # Validate and clean the response
                ai_result = validate_ai_response(ai_result)
            except json.JSONDecodeError:
                ai_result = generate_fallback_response(transcript)
        except Exception as e:
            print(f"OpenAI API error: {e}")
            ai_result = generate_fallback_response(transcript)
    else:
        ai_result = generate_fallback_response(transcript)

    print("AI result:", ai_result)
    return jsonify(ai_result)

def validate_ai_response(response):
    """Validate and clean AI response"""
    required_fields = ['overallScore', 'communicationScore', 'clarityScore', 'technicalScore', 'suggestions', 'developmentAreas']
    
    # Ensure all required fields exist
    for field in required_fields:
        if field not in response:
            if field == 'suggestions':
                response[field] = ['Focus on improving communication skills']
            elif field == 'developmentAreas':
                response[field] = 'Work on technical depth and communication clarity'
            else:
                response[field] = 5
    
    # Ensure scores are within valid range
    score_fields = ['overallScore', 'communicationScore', 'clarityScore', 'technicalScore']
    for field in score_fields:
        if field in response:
            try:
                score = int(response[field])
                response[field] = max(1, min(10, score))
            except:
                response[field] = 5
    
    return response

def generate_fallback_response(transcript):
    """Generate intelligent fallback response based on transcript content"""
    if not transcript or len(transcript.strip()) < 50:
        return {
            'overallScore': 4,
            'communicationScore': 4,
            'clarityScore': 4,
            'technicalScore': 4,
            'suggestions': [
                'Interview transcript was too short to provide meaningful evaluation',
                'Ensure you speak clearly and provide detailed responses',
                'Practice answering technical questions with examples'
            ],
            'developmentAreas': 'Focus on providing more detailed responses and speaking clearly during interviews.',
            'strengths': ['Willingness to participate in interview'],
            'analysis': 'Limited transcript available for evaluation.'
        }
    
    # Analyze transcript content for basic insights
    transcript_lower = transcript.lower()
    
    # Simple content analysis
    word_count = len(transcript.split())
    technical_terms = len(re.findall(r'\b(algorithm|data structure|api|database|framework|language|code|programming|development|software|system|architecture|design|pattern|testing|deployment|cloud|aws|azure|docker|kubernetes|git|agile|scrum|oop|functional|react|angular|node|python|java|javascript|sql|nosql|rest|graphql|microservices|api|frontend|backend|fullstack|devops|ci/cd|testing|unit|integration|performance|security|scalability|optimization|refactoring|debugging|version control|repository|branch|merge|pull request|code review|documentation|maintenance|support|monitoring|logging|analytics|metrics|dashboard|reporting|automation|scripting|shell|bash|linux|unix|windows|mac|mobile|ios|android|web|responsive|progressive|pwa|spa|ssr|csr|seo|accessibility|usability|ux|ui|design|wireframe|prototype|mockup|user|customer|stakeholder|requirement|specification|planning|estimation|timeline|budget|resource|team|collaboration|communication|presentation|demo|pitch|proposal|contract|agreement|scope|deliverable|milestone|deadline|priority|urgent|important|critical|blocker|issue|bug|feature|enhancement|improvement|upgrade|migration|legacy|modern|cutting-edge|innovative|trend|best practice|standard|guideline|policy|procedure|workflow|process|methodology|approach|strategy|tactic|plan|roadmap|vision|mission|goal|objective|target|kpi|metric|success|failure|risk|mitigation|contingency|backup|recovery|disaster|business|market|industry|domain|expertise|specialization|certification|training|education|degree|course|workshop|conference|meetup|community|network|mentor|mentorship|coaching|guidance|advice|feedback|review|assessment|evaluation|performance|improvement|growth|development|career|professional|personal|skill|competency|proficiency|expertise|experience|background|history|track record|portfolio|project|achievement|accomplishment|contribution|impact|value|benefit|advantage|strength|weakness|opportunity|threat|challenge|problem|solution|approach|method|technique|tool|technology|platform|service|product|application|system|software|hardware|infrastructure|network|security|privacy|compliance|regulation|legal|ethical|responsible|sustainable|green|environmental|social|corporate|governance|leadership|management|supervision|coordination|organization|structure|hierarchy|role|responsibility|accountability|ownership|stewardship|custody|care|maintenance|support|service|assistance|help|guidance|direction|instruction|teaching|learning|education|training|development|growth|improvement|enhancement|upgrade|optimization|refinement|polish|perfect|excellent|outstanding|exceptional|superior|high-quality|premium|top-tier|world-class|industry-leading|cutting-edge|innovative|creative|original|unique|distinctive|special|particular|specific|detailed|comprehensive|thorough|complete|full|extensive|broad|wide|deep|profound|significant|meaningful|valuable|useful|helpful|beneficial|advantageous|profitable|lucrative|rewarding|satisfying|fulfilling|enjoyable|pleasant|positive|good|great|excellent|outstanding|superb|fantastic|amazing|wonderful|terrific|brilliant|genius|masterful|skilled|talented|gifted|capable|competent|qualified|experienced|seasoned|veteran|expert|specialist|professional|dedicated|committed|passionate|enthusiastic|motivated|driven|ambitious|goal-oriented|results-focused|performance-driven|quality-conscious|detail-oriented|meticulous|precise|accurate|reliable|dependable|trustworthy|honest|ethical|moral|principled|responsible|accountable|reliable|consistent|stable|steady|predictable|manageable|controllable|measurable|quantifiable|assessable|evaluable|reviewable|auditable|verifiable|validatable|testable|provable|demonstrable|observable|noticeable|visible|apparent|obvious|clear|evident|manifest|transparent|open|honest|direct|straightforward|simple|easy|uncomplicated|straightforward|direct|clear|obvious|apparent|evident|manifest|transparent|open|honest|direct|straightforward|simple|easy|uncomplicated|straightforward|direct|clear|obvious|apparent|evident|manifest|transparent|open|honest|direct|straightforward|simple|easy|uncomplicated)\b', transcript_lower))
    
    # Calculate basic scores based on content analysis
    if word_count < 100:
        overall_score = 3
        communication_score = 3
        clarity_score = 3
        technical_score = 3
        suggestions = [
            'Provide more detailed responses during interviews',
            'Practice speaking at length about your experiences',
            'Include specific examples in your answers'
        ]
    elif word_count < 300:
        overall_score = 5
        communication_score = 5
        clarity_score = 5
        technical_score = 5
        suggestions = [
            'Expand on your technical knowledge',
            'Provide more specific examples',
            'Practice explaining complex concepts clearly'
        ]
    elif word_count < 600:
        overall_score = 7
        communication_score = 7
        clarity_score = 7
        technical_score = 7
        suggestions = [
            'Continue developing technical depth',
            'Practice more advanced problem-solving',
            'Work on concise yet comprehensive responses'
        ]
    else:
        overall_score = 8
        communication_score = 8
        clarity_score = 8
        technical_score = 8
        suggestions = [
            'Excellent communication skills demonstrated',
            'Continue building on your technical expertise',
            'Consider leadership and mentoring opportunities'
        ]
    
    # Adjust scores based on technical content
    if technical_terms > 10:
        technical_score = min(10, technical_score + 1)
        overall_score = min(10, overall_score + 1)
    
    development_areas = f"Based on the {word_count}-word interview transcript, focus on {'expanding technical knowledge' if technical_terms < 5 else 'advanced problem-solving and system design'}."
    
    return {
        'overallScore': overall_score,
        'communicationScore': communication_score,
        'clarityScore': clarity_score,
        'technicalScore': technical_score,
        'suggestions': suggestions,
        'developmentAreas': development_areas,
        'strengths': ['Active participation in interview'],
        'analysis': f'Interview analysis based on {word_count} words with {technical_terms} technical terms identified.'
    } 