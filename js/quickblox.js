/*
 * QuickBlox JavaScript SDK
 *
 * Main SDK Module
 *
 * Provides a window scoped variable (QB) for use in browsers.
 * Also exports QuickBlox for using with node.js, browserify, etc. 
 *
 */

// Browserify dependencies
var config = require('./qbConfig');
var Proxy = require('./qbProxy');

var Auth = require('./modules/qbAuth');
var Users = require('./modules/qbUsers');
var Content = require('./modules/qbContent');
var Location = require('./modules/qbLocation');
var Messages = require('./modules/qbMessages');
var Data = require('./modules/qbData');

var QB;

// For server-side applications through using npm package 'quickblox' you should comment the following block
// IIFE to create a window scoped QB instance
QB = (function(QB) {
  QB = new QuickBlox();
  if (typeof window.QB === 'undefined') {
    window.QB = QB;
  }
  return QB;
}({}));


// Actual QuickBlox API starts here
function QuickBlox() {}

QuickBlox.prototype.init = function(appId, authKey, authSecret, debug) {
  this.session = null;
  this.service = new Proxy(this);
  this.auth = new Auth(this.service);
  this.users = new Users(this.service);
  this.content = new Content(this.service);
  this.location = new Location(this.service);
  this.messages = new Messages(this.service);
  this.data = new Data(this.service);
  
  // Initialization by outside token
  if (typeof appId === 'string' && !authKey && !authSecret) {
    this.session = { token: appId };
    appId = null;
  }
  
  config.creds.appId = appId;
  config.creds.authKey = authKey;
  config.creds.authSecret = authSecret;
  if (debug) {
    config.debug = debug;
    console.log('QuickBlox.init', this);
  }
};

QuickBlox.prototype.config = config;

QuickBlox.prototype.createSession = function(params, callback) {
  this.auth.createSession(params, callback);
};

QuickBlox.prototype.destroySession = function(callback) {
  if (this.session) {
    this.auth.destroySession(callback);
  }
};

QuickBlox.prototype.login = function(params, callback) {
  this.auth.login(params, callback);
};

QuickBlox.prototype.logout = function(callback) {
  if (this.session) {
    this.auth.logout(callback);
  }
};

// Browserify exports
module.exports = (typeof QB === 'undefined') ? new QuickBlox() : QuickBlox;
