#!/bin/bash

# This script sets up a test environment for the Git repository.
# It creates two directories, clones a sample repository into each,
# and creates several branches in each directory to simulate a real-world scenario.


echo "Setting up test environment..."

git clone https://github.com/w3schools-test/hello-world.git ./src/test/env/workspace_one
git clone https://github.com/w3schools-test/hello-world.git ./src/test/env/workspace_two
echo "Directories created."

echo "Setting up workspace one..."
cd ./src/test/env/workspace_one
git checkout -b feat1
git checkout -b feat3
git checkout -b feat4
git checkout master
echo "Files:" && ls
echo "Branches:" && git branch
echo "Workspace one setup complete."

echo "Setting up workspace two..."
cd ../workspace_two
git checkout -b feat2
git checkout master
echo "Files:" && ls
echo "Branches:" && git branch
echo "Workspace two setup complete."

echo "Test environment setup complete."
exit 0

# End of script
