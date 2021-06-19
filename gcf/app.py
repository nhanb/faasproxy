from flask import Flask, request

from main import faasproxy

"""
Local server for quick testing. Run it with:
    export FAASPROXY_KEY=`cat key.txt`
    flask run --reload
"""

app = Flask(__name__)


@app.route("/", defaults={"path": ""}, methods=["GET", "POST", "PUT", "DELETE"])
@app.route("/<path:path>", methods=["GET", "POST", "PUT", "DELETE"])
def hello_world(path):
    return faasproxy(request)
