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
