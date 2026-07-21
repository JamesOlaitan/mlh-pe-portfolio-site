#test_db.py

import unittest
import os
os.environ['TESTING'] = 'true'

from peewee import *

from app import TimelinePost, mydb

MODELS = [TimelinePost]

# use an in-memory SQLite for testing
test_db = SqliteDatabase(':memory:')

class TestTimelinePost(unittest.TestCase):
    def setUp(self):
        # Bind model classes to test db. Since we have a complete list of all models, we do not need to recursively bind dependencies.
        test_db.bind(MODELS, bind_refs=False, bind_backrefs=False)
        test_db.connect()
        test_db.create_tables(MODELS)

    def tearDown(self):
        # Not strictly necessary since SQLite in-memory databases only live for the duration of the connection, and in the next step we will close the connection... but a good practice all the same.
        test_db.drop_tables(MODELS)
        # Close connection to db.
        test_db.close()
        # Point TimelinePost back at the app's real database. Otherwise it's
        # left pointing at the connection we just closed, and any test that
        # happens to run after this one would be talking to a dead database.
        mydb.bind(MODELS, bind_refs=False, bind_backrefs=False)

    def test_timeline_post(self):
        # Create a new TimelinePost and save it
        first_post = TimelinePost.create(name='John Doe', email='john.doe@example.com', content='Hello world, I\'m John!')
        assert first_post.id == 1
        second_post = TimelinePost.create(name='Jane Doe', email='jane.doe@example.com', content='Hello world, I\'m Jane!')
        assert second_post.id == 2

    def test_timeline_post_get(self):
        # create new

        first_post = TimelinePost.create(name='John Doe', email='john.doe@example.com', content='Hello world, I\'m John!')
        #get post and assert that all info is correct

        post = TimelinePost.get_by_id(1)
        assert post.name == 'John Doe'
        assert post.email == 'john.doe@example.com'
        assert post.content == 'Hello world, I\'m John!'

        #do it again!
        second_post = TimelinePost.create(name='Jane Doe', email='jane.doe@example.com', content='Hello world, I\'m Jane!')
        post = TimelinePost.get_by_id(2)
        assert post.name == 'Jane Doe'
        assert post.email == 'jane.doe@example.com'
        assert post.content == 'Hello world, I\'m Jane!'
    
    def test_timeline_post_delete(self):
        # create new
        first_post = TimelinePost.create(name='John Doe', email='john.doe@example.com', content='Hello world, I\'m John!')
        assert first_post.id == 1
        # delete post and assert that it is deleted
        deleted = TimelinePost.delete().where(TimelinePost.id == 1).execute()
        assert deleted == 1  

        #cannot delete if there is nothing to delete (database is empty)
        deleted = TimelinePost.delete().where(TimelinePost.id == 1).execute()
        assert deleted == 0  
