#!/bin/bash

echo "****** Launch test *********"

script_directory=$(dirname $(readlink -f $0))
cd $script_directory

docker-compose build
docker-compose up
