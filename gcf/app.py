import urllib3
from flask import Flask, request

from main import faasproxy

"""
Local server for quick testing. Run it with:
    flask run --reload
"""

http = urllib3.PoolManager()

app = Flask(__name__)


@app.route("/", defaults={"path": ""}, methods=["GET", "POST", "PUT", "DELETE"])
@app.route("/<path:path>", methods=["GET", "POST", "PUT", "DELETE"])
def hello_world(path):
    return faasproxy(request)
