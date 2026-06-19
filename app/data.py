"""Portfolio content.

Editing this file is all it takes to add/update entries — the templates loop
over these structures, so there's no markup to copy-paste.
"""

WORK_EXPERIENCE = [
    {
        "title": "Open Source Contributor — Google Summer of Code",
        "subtitle": "Konflux (Red Hat) · Remote",
        "dates": "May 2026 – Aug 2026",
        "description": (
            "Authored a reproducible-build architecture (ADR-0069, under Red Hat review) to stop "
            "tampered builds from shipping — wiring an opt-in buildah flag through every "
            "docker-build Tekton variant plus a digest-comparison verification pipeline."
        ),
        "tags": ["Tekton", "Go", "buildah", "Bash"],
    },
    {
        "title": "Production Engineering Fellow (SRE)",
        "subtitle": "Meta & Major League Hacking · Remote",
        "dates": "Jun 2026 – Sep 2026",
        "description": (
            "Containerizing and deploying a Flask service with Docker on a Linux VPS through a "
            "GitHub Actions CI/CD pipeline, instrumented with Prometheus and Grafana for metrics, "
            "dashboards, and alerting under Meta Production Engineer mentorship."
        ),
        "tags": ["Linux", "Docker", "Flask", "Prometheus", "Grafana", "CI/CD"],
    },
    {
        "title": "Engineering Intern",
        "subtitle": "UL Solutions · Fremont, CA",
        "dates": "Apr 2024 – Aug 2024; May 2025 – Jul 2025",
        "description": (
            "Debugged firmware-flashing pipelines across 30+ IoT variants in Linux-based RF/EMC "
            "test environments to raise throughput by 20%, and flagged an emissions violation that "
            "prevented a federal compliance issue."
        ),
        "tags": ["Linux", "Bash", "RF/EMC Testing"],
    },
]

EDUCATION = [
    {
        "title": "B.S. in Computer Science",
        "subtitle": "Minerva University · San Francisco, CA",
        "dates": "Sep 2023 – May 2027",
        "description": (
            "GPA 3.6/4.0. Coursework: Data Structures & Algorithms, Probability & Statistics, "
            "Statistical Modeling, and Linear Algebra."
        ),
    },
]

HOBBIES = [
    {
        "name": "Reading",
        "image": "img/hobbies/reading.jpg",
        "description": "Working through books on distributed systems, ML, and the occasional novel.",
    },
    {
        "name": "Watching Football",
        "image": "img/hobbies/football.jpg",
        "description": "Catching matches whenever I can. And yes, it's football, not soccer.",
    },
    {
        "name": "Watching Series",
        "image": "img/hobbies/series.jpg",
        "description": "Unwinding with a good series or a trip to the cinema.",
    },
    {
        "name": "Chess",
        "image": "img/hobbies/chess.jpg",
        "description": "Playing rapid games online and studying endgames.",
    },
]

PLACES = [
    {"name": "Lagos, Nigeria", "lat": 6.5244, "lng": 3.3792},
    {"name": "San Francisco, CA", "lat": 37.7749, "lng": -122.4194},
    {"name": "Atlanta, GA", "lat": 33.7490, "lng": -84.3880},
    {"name": "Seoul, South Korea", "lat": 37.5665, "lng": 126.9780},
    {"name": "Taipei, Taiwan", "lat": 25.0330, "lng": 121.5654},
]
