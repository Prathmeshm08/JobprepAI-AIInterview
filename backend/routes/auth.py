from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

users = {}

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    if not password or (not email and not phone):
        return jsonify({'success': False, 'message': 'Email or phone and password are required'}), 400

    identifier = email if email else phone

    if identifier in users or any(
        (u.get('email') == email and email) or (u.get('phone') == phone and phone)
        for u in users.values()
    ):
        return jsonify({'success': False, 'message': 'User already registered'}), 409

    users[identifier] = {'email': email, 'phone': phone, 'password': password}
    return jsonify({'success': True, 'message': 'Registration successful'}), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('email') or data.get('phone')
    password = data.get('password')

    if not identifier or not password:
        return jsonify({'success': False, 'message': 'Identifier and password required'}), 400

    user = users.get(identifier)
    if not user:
        for u in users.values():
            if u.get('email') == identifier or u.get('phone') == identifier:
                user = u
                break

    if not user:
        return jsonify({'success': False, 'message': 'Please register first'}), 401

    if user['password'] != password:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

    return jsonify({'success': True, 'message': 'Login successful'}), 200