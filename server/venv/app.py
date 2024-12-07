import os
import requests
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import time
import asyncio
import aiohttp

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Determine environment and API URL
is_local = os.getenv("FLASK_ENV", "production") == "development"
app.config["SOCKET_URL"] = "http://localhost:4000" if is_local else "https://chat-app-1-co8u.onrender.com"

@app.route('/')
def home():
    return render_template('index.html')

# Helper function to fetch response asynchronously
async def fetch_response(api_url, message):
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(api_url, json={"message": message}) as response:
                if response.status != 200:
                    print(f"Error: API returned status code {response.status}")
                    return {"text": "Error: Unable to fetch response."}
                return await response.json()
        except Exception as e:
            print(f"Error during API request: {e}")
            return {"text": "Error: Unable to fetch response."}

@socketio.on("message")
def handle_message(data):
    user_message = data
    print(f"User: {user_message}")

    emit("typing", broadcast=True)
    time.sleep(1)

    try:
        # API URL for robot response
        api_url = "https://chat-app-cqha.onrender.com/api/robot-response"

        # Synchronous HTTP call with timeout for debugging
        try:
            response = requests.post(api_url, json={"message": user_message}, timeout=10)
            print(f"Response status code: {response.status_code}")
            print(f"Response content: {response.text}")
            response.raise_for_status()  # Ensure 4xx/5xx raise an error
            response_data = response.json()
        except requests.exceptions.RequestException as e:
            print(f"API call failed with error: {e}")
            response_data = {"text": "Error: Unable to fetch response."}

        # Extract bot response
        bot_response = response_data.get("reply", "Sorry, I didn't understand that.")

        # Include image data if available
        image_url = response_data.get("image_url", None)
        payload = {"text": bot_response}
        if image_url:
            payload["image"] = image_url

    except Exception as e:
        print(f"Unexpected error: {e}")
        payload = {"text": "Error: Unable to fetch response."}

    emit("stop_typing", broadcast=True)
    emit("message", payload, broadcast=True)


@socketio.on("typing")
def handle_typing():
    emit("typing", broadcast=True)


@socketio.on("stop_typing")
def handle_stop_typing():
    emit("stop_typing", broadcast=True)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 4000))
    host = "127.0.0.1" if is_local else "0.0.0.0"
    socketio.run(app, debug=is_local, host=host, port=port)
