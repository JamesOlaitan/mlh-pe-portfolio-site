// Timeline page: submit posts to /api/timeline_post via fetch and render them
// newest-first, with a Gravatar avatar derived from each post's email.
(function () {
    "use strict";

    var form = document.getElementById("timeline-form");
    var postsEl = document.getElementById("timeline-posts");
    var statusEl = document.getElementById("timeline-status");
    if (!form || !postsEl) {
        return;
    }

    var API = "/api/timeline_post";

    function setStatus(message, isError) {
        if (!statusEl) {
            return;
        }
        statusEl.textContent = message || "";
        statusEl.classList.toggle("is-error", Boolean(isError));
    }

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

    function gravatarUrl(email) {
        var normalized = String(email || "").trim().toLowerCase();
        return "https://www.gravatar.com/avatar/" + md5(normalized) + "?d=identicon&s=64";
    }

    // Build a single post card. User-supplied text is set via textContent so
    // it can never be interpreted as HTML.
    function renderPost(post) {
        var article = document.createElement("article");
        article.className = "timeline-post";

        var avatar = document.createElement("img");
        avatar.className = "timeline-avatar";
        avatar.src = gravatarUrl(post.email);
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

        var email = document.createElement("span");
        email.className = "timeline-email";
        email.textContent = post.email;
        head.appendChild(email);

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
            empty.textContent = "No posts yet — be the first to say hello!";
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
                setStatus("Couldn't load posts: " + err.message, true);
            });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var button = form.querySelector("button[type=submit]");
        if (button) {
            button.disabled = true;
        }
        setStatus("Posting…");

        fetch(API, {
            method: "POST",
            body: new FormData(form),
        })
            .then(function (res) {
                if (!res.ok) {
                    throw new Error("Request failed with status " + res.status);
                }
                return res.json();
            })
            .then(function () {
                form.reset();
                setStatus("Posted!");
                return loadPosts();
            })
            .catch(function (err) {
                setStatus("Couldn't post: " + err.message, true);
            })
            .finally(function () {
                if (button) {
                    button.disabled = false;
                }
            });
    });

    loadPosts();
})();

// MD5 (blueimp-md5, MIT licensed) — used only to hash emails for Gravatar.
// https://github.com/blueimp/JavaScript-MD5
function md5(str) {
    function safeAdd(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xffff);
    }
    function bitRotateLeft(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    function md5cmn(q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
    }
    function md5ff(a, b, c, d, x, s, t) {
        return md5cmn((b & c) | (~b & d), a, b, x, s, t);
    }
    function md5gg(a, b, c, d, x, s, t) {
        return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
    }
    function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | ~d), a, b, x, s, t);
    }
    function binlMD5(x, len) {
        x[len >> 5] |= 0x80 << len % 32;
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var i;
        var olda;
        var oldb;
        var oldc;
        var oldd;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;
            a = md5ff(a, b, c, d, x[i], 7, -680876936);
            d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5gg(b, c, d, a, x[i], 20, -373897302);
            a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5hh(d, a, b, c, x[i], 11, -358537222);
            c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = md5ii(a, b, c, d, x[i], 6, -198630844);
            d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = safeAdd(a, olda);
            b = safeAdd(b, oldb);
            c = safeAdd(c, oldc);
            d = safeAdd(d, oldd);
        }
        return [a, b, c, d];
    }
    function binl2rstr(input) {
        var i;
        var output = "";
        var length32 = input.length * 32;
        for (i = 0; i < length32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
        }
        return output;
    }
    function rstr2binl(input) {
        var i;
        var output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        var length8 = input.length * 8;
        for (i = 0; i < length8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
        }
        return output;
    }
    function rstrMD5(s) {
        return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
    }
    function rstr2hex(input) {
        var hexTab = "0123456789abcdef";
        var output = "";
        var x;
        var i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
        }
        return output;
    }
    function str2rstrUTF8(input) {
        return unescape(encodeURIComponent(input));
    }
    return rstr2hex(rstrMD5(str2rstrUTF8(str)));
}
