#!/bin/bash

workspace=$1
branch=$2

if [ -z "$workspace" ] ; then
    echo "workspace name not provided"
    exit 1
fi

if [ -z "$branch" ] ; then
    echo "branch name not provided"
    exit 1
fi

cd ../env/$workspace/ && git checkout $branch