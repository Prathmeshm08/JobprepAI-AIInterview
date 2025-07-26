from flask import Flask
from dotenv import load_dotenv
import os
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Register blueprints for modular routes
from routes.upload import upload_bp
app.register_blueprint(upload_bp)
from routes.auth import auth_bp
app.register_blueprint(auth_bp)
from routes.interview import interview_bp
app.register_blueprint(interview_bp)
from routes.feedback import feedback_bp
app.register_blueprint(feedback_bp)

if __name__ == '__main__':
    app.run(debug=True)
