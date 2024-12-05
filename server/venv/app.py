import os
import requests
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def home():
    return render_template('index.html')

@socketio.on("message")
def handle_message(data):
    user_message = data
    print(f"User: {user_message}")

    emit("typing", broadcast=True)
    time.sleep(1)

    try:
        api_url = "https://chat-app-cqha.onrender.com/api/robot-response"
        response = requests.post(api_url, json={"message": user_message})
        response_data = response.json()
        bot_response = response_data.get("reply", "Sorry, I didn't understand that.")
    except Exception as e:
        print(f"API error: {e}")
        bot_response = "Error: Unable to fetch response."

    emit("stop_typing", broadcast=True)
    emit("message", bot_response, broadcast=True)

@socketio.on("typing")
def handle_typing():
    emit("typing", broadcast=True)

@socketio.on("stop_typing")
def handle_stop_typing():
    emit("stop_typing", broadcast=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 4000))
    socketio.run(app, debug=True, host="0.0.0.0", port=port)
