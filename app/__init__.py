import datetime
import os

from flask import Flask, render_template, request
from dotenv import load_dotenv
from peewee import *
from playhouse.shortcuts import model_to_dict

from app import data

load_dotenv()
app = Flask(__name__)

mydb = MySQLDatabase(
    os.getenv("MYSQL_DATABASE"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    host=os.getenv("MYSQL_HOST"),
    port=3306,
)

print(mydb)


class TimelinePost(Model):
    """A single timeline post (name, email, message) stored in MySQL."""

    name = CharField()
    email = CharField()
    content = TextField()
    created_at = DateTimeField(default=datetime.datetime.now)

    class Meta:
        database = mydb


mydb.connect()
mydb.create_tables([TimelinePost])


# Pages shown in the nav bar. Add a page here and it appears automatically.
NAV_PAGES = [
    {"name": "Home", "endpoint": "index"},
    {"name": "Hobbies", "endpoint": "hobbies"},
    {"name": "Timeline", "endpoint": "timeline"},
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
        places=data.PLACES,
    )


@app.route('/hobbies')
def hobbies():
    return render_template(
        'hobbies.html',
        title="Hobbies: James Olaitan",
        url=os.getenv("URL"),
        hobbies=data.HOBBIES,
    )


@app.route('/timeline')
def timeline():
    return render_template(
        'timeline.html',
        title="Timeline: James Olaitan",
        url=os.getenv("URL"),
    )


@app.route('/api/timeline_post', methods=['POST'])
def post_time_line_post():
    """Create a timeline post from form fields and return it as JSON."""
    name = request.form['name']
    email = request.form['email']
    content = request.form['content']
    timeline_post = TimelinePost.create(name=name, email=email, content=content)
    return model_to_dict(timeline_post)


@app.route('/api/timeline_post', methods=['GET'])
def get_time_line_post():
    """Return all timeline posts, newest first."""
    return {
        'timeline_posts': [
            model_to_dict(p)
            for p in TimelinePost.select().order_by(TimelinePost.created_at.desc())
        ]
    }


@app.route('/api/timeline_post/<int:post_id>', methods=['DELETE'])
def delete_time_line_post(post_id):
    """Delete a timeline post by id. Returns how many rows were removed."""
    deleted = TimelinePost.delete().where(TimelinePost.id == post_id).execute()
    return {'deleted': deleted}
