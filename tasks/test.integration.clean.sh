#!/bin/env bash

# stop
docker stop group-test;
docker stop group-service;
docker stop group-crossbar;
docker stop group-db;

# clean
docker rm group-test;
docker rm group-service;
docker rm group-crossbar;
docker rm group-db;

# uninstall
docker rmi group-test;
docker rmi group-service;
docker rmi group-crossbar;
docker rmi group-db;
