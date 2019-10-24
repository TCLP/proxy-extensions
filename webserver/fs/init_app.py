# coding: utf-8
from flask import Flask
from . import config

app = Flask(__name__)
app.secret_key = config.APP_FLASK_KEY

@app.after_request
def add_header(response):
    if config.IS_ALLOW_ORIGIN:
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization, locale'
        response.headers['Access-Control-Request-Method'] = 'GET, POST, PATCH'
    return response