import os
from flask import Flask, render_template
from dotenv import load_dotenv

from app import data

load_dotenv()
app = Flask(__name__)


@app.route('/')
def index():
    return render_template(
        'index.html',
        title="James Olaitan",
        url=os.getenv("URL"),
        experiences=data.WORK_EXPERIENCE,
    )
