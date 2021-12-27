'use strict';

/**
 * Module dependencies
 */

const Collection = require('./collection');
const utils = require('../utils');

function NodeCollection(col) {
  this.collection = col;
  this.collectionName = col.collectionName;
}

/**
 * inherit from collection base class
 */

utils.inherits(NodeCollection, Collection);

/**
 * find(match, options, function(err, docs))
 */

NodeCollection.prototype.find = function(match, options, cb) {
  const cursor = this.collection.find(match, options);

  try {
    cursor.toArray(cb);
  } catch (error) {
    cb(error);
  }
};

/**
 * findOne(match, options, function(err, doc))
 */

NodeCollection.prototype.findOne = function(match, options, cb) {
  this.collection.findOne(match, options, cb);
};

/**
 * count(match, options, function(err, count))
 */

NodeCollection.prototype.count = function(match, options, cb) {
  this.collection.count(match, options, cb);
};

/**
 * distinct(prop, match, options, function(err, count))
 */

NodeCollection.prototype.distinct = function(prop, match, options, cb) {
  this.collection.distinct(prop, match, options, cb);
};

/**
 * update(match, update, options, function(err[, result]))
 */

NodeCollection.prototype.update = function(match, update, options, cb) {
  this.collection.update(match, update, options, cb);
};

/**
 * update(match, update, options, function(err[, result]))
 */

NodeCollection.prototype.updateMany = function(match, update, options, cb) {
  this.collection.updateMany(match, update, options, cb);
};

/**
 * update(match, update, options, function(err[, result]))
 */

NodeCollection.prototype.updateOne = function(match, update, options, cb) {
  this.collection.updateOne(match, update, options, cb);
};

/**
 * replaceOne(match, update, options, function(err[, result]))
 */

NodeCollection.prototype.replaceOne = function(match, update, options, cb) {
  this.collection.replaceOne(match, update, options, cb);
};

/**
 * deleteOne(match, options, function(err[, result])
 */

NodeCollection.prototype.deleteOne = function(match, options, cb) {
  this.collection.deleteOne(match, options, cb);
};

/**
 * deleteMany(match, options, function(err[, result])
 */

NodeCollection.prototype.deleteMany = function(match, options, cb) {
  this.collection.deleteMany(match, options, cb);
};

/**
 * remove(match, options, function(err[, result])
 */

NodeCollection.prototype.remove = function(match, options, cb) {
  this.collection.remove(match, options, cb);
};

/**
 * findOneAndDelete(match, options, function(err[, result])
 */

NodeCollection.prototype.findOneAndDelete = function(match, options, cb) {
  this.collection.findOneAndDelete(match, options, cb);
};

/**
 * findOneAndUpdate(match, update, options, function(err[, result])
 */

NodeCollection.prototype.findOneAndUpdate = function(match, update, options, cb) {
  this.collection.findOneAndUpdate(match, update, options, cb);
};

/**
 * var cursor = findCursor(match, options)
 */

NodeCollection.prototype.findCursor = function(match, options) {
  return this.collection.find(match, options);
};

/**
 * aggregation(operators..., function(err, doc))
 * TODO
 */

/**
 * Expose
 */

module.exports = exports = NodeCollection;
