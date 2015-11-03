#!/bin/env bash

# pull images
gcloud docker pull eu.gcr.io/saio-fr/crossbar:master
gcloud docker pull eu.gcr.io/saio-fr/authorizer:master
gcloud docker pull eu.gcr.io/saio-fr/group:master

# install
docker build -t group-service -f Dockerfile .;
docker build -t group-test -f tasks/integration/Dockerfile .;

# start services
echo "starting database...";
docker run -d -P \
	--name group-db \
	memsql/quickstart;
sleep 20;

echo "creating databases...";
# docker exec doest not work in circle ci.
# docker exec -d customer-db memsql-shell -e \
# "create database customer;";
docker run --rm \
	--name group-mysql-client \
	--link group-db:db \
	mysql sh -c \
	'mysql -h "$DB_PORT_3306_TCP_ADDR" -u root \
	--execute="create database \"group\""';
sleep 20;

echo "starting crossbar...";
docker run -d \
  --name group-crossbar \
  eu.gcr.io/saio-fr/crossbar:master;
sleep 20;

echo "starting group service...";
docker run -d \
  --name group-service \
  --link group-db:db \
  --link group-crossbar:crossbar \
  group-service;
sleep 20;

echo "running test...";
docker run \
  --name group-test \
  --link group-db:db \
  --link group-crossbar:crossbar \
  group-test;
TEST_EC=$?;

# return with the exit code of the test
if [ $TEST_EC -eq 0 ]
then
  echo "It Saul Goodman !";
  exit 0;
else
  exit $TEST_EC;
fi
