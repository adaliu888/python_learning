from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # dev 阶段允许所有来源

@app.route("/api/hello")
def hello():
    return jsonify(message="Hello from Flask + Rye!")

if __name__ == "__main__":
    app.run(debug=True, port=5000)