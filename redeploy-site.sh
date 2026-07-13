#!/bin/bash

# Redeploys my portfolio service after changes are pushed to GitHub.

# cd into the project folder
cd ~/mlh-pe-portfolio-site

# Make the repo match the latest changes on the main branch
git fetch && git reset origin/main --hard

# Enter the python virtual environment and install dependencies
source python3-virtualenv/bin/activate
pip install -r requirements.txt

# Restart the service so it picks up the new code
systemctl restart myportfolio

echo "Redeploy complete. myportfolio service restarted."
