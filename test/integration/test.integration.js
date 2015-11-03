var tape = require('blue-tape');
var when = require('when');
var _ = require('underscore');
var Db = require('@saio/db-component');
var Tester = require('@saio/service-runner').Tester;
var RandomService = require('./helpers/randomService.js');

var license1 = '630fd82f-8abd-475d-a845-3a1f7632660c';
var license2 = '2db862c2-825c-4c2b-9cf4-26e16519e5f6';

tape('create an invalid group with an empty name', function(t) {

  var group = {
    name: ''
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.createGroup(license1, group).then(function(res) {
      t.fail('group has been created');
      return tester.stop();
    }).catch(function(err) {
      t.pass(err.message);
      return tester.stop();
    });
  });
});

tape('create an undefined group', function(t) {

  var group = {};

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.createGroup(license1, group).then(function(res) {
      t.fail('group has been created');
      return tester.stop();
    }).catch(function(err) {
      t.pass(err.message);
      return tester.stop();
    });
  });
});

tape('create a valid group', function(t) {

  var group = {
    name: 'automobile'
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.createGroup(license1, group).then(function(res) {
      t.pass('group has been correctly created');
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

// We will set that when a valid group has been created
// to get a specific group later.
var groupId = '';

tape('create another valid group', function(t) {

  var group = {
    name: 'moto'
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.createGroup(license2, group).then(function(res) {
      groupId = res.id;
      t.pass('group has been correctly created');
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('get all groups by license', function(t) {

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.getAll(license2).then(function(res) {

      if (res.length && res.length < 2) {
        t.pass('groups can be retrieved by license');
      } else {
        t.fail('groups can\'t be retrieved by license');
      }

      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('get a specific group', function(t) {

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.getGroup(license2, groupId).then(function(res) {

      if (res) {
        t.pass('group can be retrieved by license & id');
      } else {
        t.fail('group can\'t be retrieved');
      }

      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('update an group', function(t) {

  var group = {
    name: 'Honda et Suzuki'
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.updateGroup(license2, groupId, group).then(function(res) {

      if (res.name === 'Honda et Suzuki') {
        t.pass('group has been correctly updated');
      } else {
        t.fail('group has not been correctly updated');
      }
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('delete an group', function(t) {

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.deleteGroup(license2, groupId).then(function(res) {
      t.pass('group has been correctly deleted');
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('delete an invalid group', function(t) {

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.deleteGroup(license2, '2db862c2-825c-4c2b-9cf4-26e16519e5f5').then(function(res) {
      t.fail('group has been deleted');
      return tester.stop();
    }).catch(function(err) {
      t.pass(err.message);
      return tester.stop();
    });
  });
});
