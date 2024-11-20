from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')  # Render the chat page

if __name__ == '__main__':
    app.run(debug=True, port=4000)  # Flask runs on port 5000
