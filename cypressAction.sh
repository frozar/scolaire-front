#!/bin/bash

echo "****** Launch test *********"

script_directory=$(dirname $(readlink -f $0))
cd $script_directory

docker build -t cypress:latest -f DockerfileCypress .
docker run cypress
# docker-compose build
# docker-compose up
