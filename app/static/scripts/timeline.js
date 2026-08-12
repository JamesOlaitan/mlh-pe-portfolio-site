// Timeline page: fetch posts from /api/timeline_post and render them
// newest-first, with a Gravatar avatar derived from each post's avatar_hash.
(function () {
    "use strict";

    var postsEl = document.getElementById("timeline-posts");
    if (!postsEl) {
        return;
    }

    var API = "/api/timeline_post";

    // Parse the API's created_at, which is an RFC-1123 string from Flask's JSON
    // encoder (e.g. "Thu, 09 Jul 2026 19:42:26 GMT"). Falls back to the ISO-ish
    // "2026-07-09 19:42:26" shape, then gives up. Returns a Date or null.
    function parseDate(value) {
        if (!value) {
            return null;
        }
        var text = String(value);
        var parsed = new Date(text);
        if (isNaN(parsed.getTime())) {
            parsed = new Date(text.replace(" ", "T"));
        }
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    // Human-readable timestamp; falls back to the raw value if unparseable.
    function formatDate(value) {
        var parsed = parseDate(value);
        if (!parsed) {
            return value ? String(value) : "";
        }
        return parsed.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    }

    function gravatarUrl(avatarHash) {
        return "https://www.gravatar.com/avatar/" + avatarHash + "?d=identicon&s=64";
    }

    // Build a single post card. User-supplied text is set via textContent so
    // it can never be interpreted as HTML.
    function renderPost(post) {
        var article = document.createElement("article");
        article.className = "timeline-post";

        var avatar = document.createElement("img");
        avatar.className = "timeline-avatar";
        avatar.src = gravatarUrl(post.avatar_hash);
        avatar.alt = "";
        avatar.width = 48;
        avatar.height = 48;
        avatar.loading = "lazy";
        article.appendChild(avatar);

        var body = document.createElement("div");
        body.className = "timeline-body";

        var head = document.createElement("div");
        head.className = "timeline-post-head";

        var name = document.createElement("span");
        name.className = "timeline-name";
        name.textContent = post.name;
        head.appendChild(name);

        if (post.created_at) {
            var time = document.createElement("span");
            time.className = "timeline-date";
            time.textContent = formatDate(post.created_at);
            head.appendChild(time);
        }

        var content = document.createElement("p");
        content.className = "timeline-content";
        content.textContent = post.content;

        body.appendChild(head);
        body.appendChild(content);
        article.appendChild(body);
        return article;
    }

    function renderPosts(posts) {
        postsEl.textContent = "";
        if (!posts || !posts.length) {
            var empty = document.createElement("p");
            empty.className = "timeline-empty";
            empty.textContent = "No posts yet.";
            postsEl.appendChild(empty);
            return;
        }
        posts.forEach(function (post) {
            postsEl.appendChild(renderPost(post));
        });
    }

    // The API already returns posts ordered newest-first, but sort defensively
    // in case that ever changes.
    function loadPosts() {
        return fetch(API)
            .then(function (res) {
                if (!res.ok) {
                    throw new Error("Request failed with status " + res.status);
                }
                return res.json();
            })
            .then(function (data) {
                var posts = (data && data.timeline_posts) || [];
                posts.sort(function (a, b) {
                    var ta = parseDate(a.created_at);
                    var tb = parseDate(b.created_at);
                    return (tb ? tb.getTime() : 0) - (ta ? ta.getTime() : 0);
                });
                renderPosts(posts);
            })
            .catch(function (err) {
                postsEl.textContent = "";
                var error = document.createElement("p");
                error.className = "timeline-empty";
                error.textContent = "Couldn't load posts: " + err.message;
                postsEl.appendChild(error);
            });
    }

    loadPosts();
})();
