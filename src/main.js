var _ = require('underscore');
var moment = require('moment');
var crypto = require('crypto');
var Wsocket = require('@saio/wsocket-component');
var Db = require('@saio/db-component');
var Config = require('./config.js');

var GroupService = function(container, options) {
  var config = Config.build(options);
  this.ws = container.use('ws', Wsocket, config.ws);
  this.db = container.use('db', Db, config.db);
};

GroupService.prototype.start = function() {
  var promises = [
    this.ws.register('fr.saio.api.license..group.getAll',
      this.getAll.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'}),
    this.ws.register('fr.saio.api.license..group.get.',
      this.get.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'}),
    this.ws.register('fr.saio.api.license..group.create',
      this.create.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'}),
    this.ws.register('fr.saio.api.license..group.update.',
      this.update.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'}),
    this.ws.register('fr.saio.api.license..group.delete.',
      this.delete.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'}),
    this.ws.subscribe('fr.saio.internal.customer.deletion',
      this.onCustomerDeletion.bind(this))
  ];

  Promise.all(promises).then(function() {
    console.log('group-service started');
    return Promise.resolve();
  });
};

GroupService.prototype.stop = function() {
  return this.ws.unregister()
  .then(function() {
    console.log('group-service stopped');
    return Promise.resolve();
  });
};

/**
 * details.wildcards[0]: license
 */
GroupService.prototype.getAll = function(args, kwargs, details) {
  return this.db.model.Group.findAll({
    where: {
      license: details.wildcards[0]
    }
  }).catch((err) => {
    console.error(err);
    throw err;
  });
};

/**
 * details.wildcards[0]: license
 * details.wildcards[1]: id
 */
GroupService.prototype.get = function(args, kwargs, details) {

  return this.db.model.Group.findOne({
    where: {
      license: details.wildcards[0],
      id: details.wildcards[1]
    }
  }).catch((err) => {
    console.log(err);
    throw err;
  });
};

/**
 * details.wildcards[0]: license
 * kwargs.group: object
 */
GroupService.prototype.create = function(args, kwargs, details) {

  return this.db.model.Group.create({
    license: details.wildcards[0],
    name: kwargs.group.name
  }).catch((err) => {
    console.log(err);
    throw err;
  });
};

/**
 * details.wildcards[0]: license
 * details.wildcards[1]: id
 * kwargs.group: object
 */
GroupService.prototype.update = function(args, kwargs, details) {

  return this.db.model.Group.findOne({
    where: {
      license: details.wildcards[0],
      id: details.wildcards[1]
    }
  }).then((group) => {
    if (group) {

      group.name = kwargs.group.name;

      return group.save().catch((err) => {
        console.log(err);
        throw err;
      });
    } else {
      throw new Error('Group not found. Check the id provided.');
    }
  }).catch((err) => {
    console.error(err);
    throw err;
  });
};

/**
 * details.wildcards[0]: license
 * details.wildcards[1]: id
 */
GroupService.prototype.delete = function(args, kwargs, details) {

  return this.db.model.Group.findOne({
    where: {
      license: details.wildcards[0],
      id: details.wildcards[1]
    }
  }).then((group) => {
    if (group) {
      return group.destroy().then(() => {
        return this.ws.publish('fr.saio.internal.customer.deletion', [], {
          id: customer.id
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      throw new Error('Group not found. Check the id provided.');
    }
  }).catch((err) => {
    console.error(err);
    throw err;
  });
};

/**
 * details.wildcards[0]: id
 */
GroupService.prototype.onCustomerDeletion = function(args, kwargs, details) {
  return this.db.model.Group.destroy({
    where: {
      license: details.wildcards[0]
    }
  }).catch((err) => {
    throw err;
  });
};

module.exports = GroupService;
