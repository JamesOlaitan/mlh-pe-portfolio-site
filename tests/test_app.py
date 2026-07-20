import unittest
import os
os.environ['TESTING'] = 'true'

from app import app, TimelinePost


class AppTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        TimelinePost.delete().execute()

    def test_home(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        assert '<title>James Olaitan</title>' in html
        assert 'About Me' in html
        assert 'Work Experience' in html
        assert 'Education' in html
        assert 'See all hobbies' in html

    def test_timeline(self):
        response = self.client.get("/api/timeline_post")
        assert response.status_code == 200
        assert response.is_json
        json = response.get_json()
        assert "timeline_posts" in json
        assert len(json["timeline_posts"]) == 0

        #POST posts correctly
        response = self.client.post(
            "/api/timeline_post",
            data={"name": "Test User", "email": "test@example.com", "content": "Hello world, I'm a test!"},
        )
        assert response.status_code == 200
        assert response.is_json
        json = response.get_json()
        assert len(json["timeline_posts"]) == 1
        assert json["timeline_posts"][0]["name"] == "Test User"
        assert json["timeline_posts"][0]["email"] == "test@example.com"
        assert json["timeline_posts"][0]["content"] == "Hello world, I'm a test!"

        #GET returns full timeline json data with all posts correctly ordered
        self.client.post(
            "/api/timeline_post",
            data={"name": "Test User2", "email": "test2@example.com", "content": "Hello world, I'm a second test!"},
        )

        response = self.client.get("/api/timeline_post")
        assert response.status_code == 200
        assert response.is_json
        json = response.get_json()
        assert "timeline_posts" in json
        assert len(json["timeline_posts"]) == 2
        assert json["timeline_posts"][0]["name"] == "Test User2"
        assert json["timeline_posts"][0]["email"] == "test2@example.com"
        assert json["timeline_posts"][0]["content"] == "Hello world, I'm a second test!"
        assert json["timeline_posts"][1]["name"] == "Test User"
        assert json["timeline_posts"][1]["email"] == "test@example.com"
        assert json["timeline_posts"][1]["content"] == "Hello world, I'm a test!"

        #DELETE correctly deteletes a post and returns the remaining posts
        response = self.client.delete("/api/timeline_post/1")
        assert response.status_code == 200
        assert response.is_json
        json = response.get_json()
        assert "timeline_posts" in json
        assert len(json["timeline_posts"]) == 1
        assert json["timeline_posts"][0]["name"] == "Test User2"

        #DELETE cannot delete an already deleted post
        response = self.client.delete("/api/timeline_post/1")
        assert response.status_code == 404

        #DELETE cannot delete a non-existing post
        response = self.client.delete("/api/timeline_post/100")
        assert response.status_code == 404

    def test_timeline_page(self):
        response = self.client.get("/timeline")
        assert response.status_code == 200
        html = response.get_data(as_text=True)
        assert "Timeline" in html
        assert 'id="timeline-form"' in html
        assert 'id="timeline-posts"' in html

    def test_malformed_timeline_post(self):
        # POST request missing name
        response = self.client.post("/api/timeline_post", data={"email": "test@example.com", "content": "Hello world, I'm a test!"})
        assert response.status_code == 400
        html = response.get_data(as_text=True)
        assert "Invalid name" in html

        #POST request with empty content
        response = self.client.post("/api/timeline_post", data={"name": "Test User", "email": "test@example.com", "content": ""})
        assert response.status_code == 400
        html = response.get_data(as_text=True)
        assert "Invalid content" in html

        #POST request with malformed email
        response = self.client.post("/api/timeline_post", data={"name": "Test User", "email": "not-an-email", "content": "Hello world, I'm a test!"})
        assert response.status_code == 400
        html = response.get_data(as_text=True)
        assert "Invalid email" in html