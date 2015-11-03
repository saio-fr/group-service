var tape = require('blue-tape');
var when = require('when');
var _ = require('underscore');

var Wsocket = require('@saio/wsocket-component');

var RandomService = function(container, options) {
  this.ws = container.use('ws', Wsocket, {
    url: 'ws://crossbar:8081',
    realm: 'saio',
    authId: 'service',
    password: 'service'
  });
};

RandomService.prototype.start = function() {
  return when.resolve();
};

RandomService.prototype.stop = function() {
  return when.resolve();
};

RandomService.prototype.getAll = function(license) {
  return this.ws.call('fr.saio.api.license.' + license + '.group.getAll');
};

RandomService.prototype.getGroup = function(license, id) {
  return this.ws.call('fr.saio.api.license.' + license + '.group.get.' + id);
};

RandomService.prototype.createGroup = function(license, group) {
  return this.ws.call('fr.saio.api.license.' + license + '.group.create', [], {group: group});
};

RandomService.prototype.updateGroup = function(license, id, group) {
  return this.ws.call('fr.saio.api.license.' + license + '.group.update.' + id, [], {group: group});
};

RandomService.prototype.deleteGroup = function(license, id) {
  return this.ws.call('fr.saio.api.license.' + license + '.group.delete.' + id);
};

module.exports = RandomService;
