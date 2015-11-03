# group service

### Public api

**call@fr.saio.api.license.[license].group.get.[groupId]**
```
input: null
output: group
```
**call@fr.saio.api.license.[license].group.getAll**
```
input: null
output: [group]
```
**call@fr.saio.api.license.[license].group.create**
```
input: group {
  name: String
}
output: group
```
**call@fr.saio.api.license.[license].group.update.[groupId]**
```
input: group {
  name: String
}
output: group
```
**call@fr.saio.api.license.[license].group.delete.[groupId]**
```
input: null
output: null
```

### Internal api

### How to test

```
npm test
npm run test.integration
```

### How to deploy

Simply commit or pr in develop branch for staging environment, or master for production.
This will automatically build & push containers in our Kubernetes cluster.
