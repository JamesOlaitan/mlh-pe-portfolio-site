#!/bin/bash

# Redeploys my portfolio site after changes are pushed to GitHub.

# Kills all existing tmux sessions (to stop any running Flask server)
tmux kill-server 2>/dev/null

# cd into the project folder
cd ~/mlh-pe-portfolio-site

# Makes the repo matches the latest changes on the main branch
git fetch && git reset origin/main --hard

# Enters the python virtual environment and install dependencies
source python3-virtualenv/bin/activate
pip install -r requirements.txt

# Starts a new detached tmux session that cd's into the project,
# activates the virtual environment, and starts the Flask server
tmux new-session -d -s flask-server "cd ~/mlh-pe-portfolio-site && source python3-virtualenv/bin/activate && flask run --host=0.0.0.0"

echo "Redeploy complete. Flask server running in tmux session 'flask-server'."
