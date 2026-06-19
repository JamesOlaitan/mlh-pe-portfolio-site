import os
from flask import Flask, render_template
from dotenv import load_dotenv

from app import data

load_dotenv()
app = Flask(__name__)

# Pages shown in the nav bar. Add a page here and it appears automatically.
NAV_PAGES = [
    {"name": "Home", "endpoint": "index"},
    {"name": "Hobbies", "endpoint": "hobbies"},
]


@app.context_processor
def inject_nav():
    return {"nav_pages": NAV_PAGES}


@app.route('/')
def index():
    return render_template(
        'index.html',
        title="James Olaitan",
        url=os.getenv("URL"),
        experiences=data.WORK_EXPERIENCE,
        education=data.EDUCATION,
    )


@app.route('/hobbies')
def hobbies():
    return render_template(
        'hobbies.html',
        title="Hobbies — James Olaitan",
        url=os.getenv("URL"),
        hobbies=data.HOBBIES,
    )
