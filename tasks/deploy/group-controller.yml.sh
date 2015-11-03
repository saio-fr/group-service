#!/bin/bash
cat > tasks/deploy/group-controller.yml <<EOF

apiVersion: v1
kind: ReplicationController
metadata:
  name: group
  labels:
    name: group
    branch: ${CIRCLE_BRANCH}
spec:
  replicas: ${REPLICAS_NUMBER}
  # selector identifies the set of pods that this
  # replication controller is responsible for managing
  selector:
    name: group
    branch: ${CIRCLE_BRANCH}
  # template defines the 'cookie cutter' used for creating
  # new pods when necessary
  template:
    metadata:
      labels:
        # Important: these labels need to match the selector above
        # The api server enforces this constraint.
        name: group
        branch: ${CIRCLE_BRANCH}
    spec:
      containers:
      - name: group
        command: ["npm", "start", "--"]
        args: [
          "--ws-url", "ws://crossbar-private:8081",
          "--db-host", "memsql",
          "--db-dialect", "mysql",
          "--db-group", "root",
          "--db-port", "3306",
          "--db-password", "",
          "--db-dbname", "group"
        ]
        image: eu.gcr.io/saio-fr/group:${CIRCLE_BRANCH}.${CIRCLE_SHA1}
        ports:
        - containerPort: 8081

EOF
