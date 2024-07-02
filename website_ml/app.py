import json
import os
import ssl
import urllib.request
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def allowSelfSignedHttps(allowed):
    # Bypass the server certificate verification on client side
    if allowed and not os.environ.get('PYTHONHTTPSVERIFY', '') and getattr(ssl, '_create_unverified_context', None):
        ssl._create_default_https_context = ssl._create_unverified_context

allowSelfSignedHttps(True)

API_KEY = 'YDKjIN0aEDzMZN4mGbdD7uI927ypGnhU'
ENDPOINT = 'http://9057999d-f5f9-4d00-a70b-2ce2a017952b.francecentral.azurecontainer.io/score'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check_compatibility', methods=['POST'])
def check_compatibility():
    ingredient1 = request.form.get('ingredient1')
    ingredient2 = request.form.get('ingredient2')
    ingredient3 = request.form.get('ingredient3')

    data = {
        "Inputs": {
            "input1": [
                {
                    "Ingredient 1": ingredient1,
                    "Ingredient 2": ingredient2,
                    "Ingredient 3": ingredient3
                }
            ]
        },
        "GlobalParameters": {}
    }

    body = str.encode(json.dumps(data))
    headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + API_KEY}

    req = urllib.request.Request(ENDPOINT, body, headers)
    try:
        response = urllib.request.urlopen(req)
        result = response.read().decode('utf-8')
        response_data = json.loads(result)
        compatibility = response_data['Results']['WebServiceOutput0'][0]["Classification Output"]
        return jsonify({'compatibility': compatibility})
    except urllib.error.HTTPError as error:
        return jsonify({'error': error.read().decode('utf8', 'ignore')}), error.code

if __name__ == '__main__':
    app.run(debug=True)
