var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var SearchStore = require('./SearchStore');
var ZoopsAppStore = require('./ZoopsAppStore');

var stores = [SearchStore, ZoopsAppStore];
var _state = {
  active: false
};

function setItems () {
  for (var i = 0; i < stores.length; i++) {
    if (stores[i].getIsLoading()) {
      _state.active = true;
      return;
    };
  }
  _state.active = false;
}

var PreloaderStore = _.assign(new EventEmitter(), {
  getState () {
    return _state;
  },
  emitChange () {
    this.emit(AppConstants.CHANGE);
  },
  addChangeListener (callback) {
    this.on(AppConstants.CHANGE, callback);
  },
  removeChangeListener (callback) {
    this.removeListener(AppConstants.CHANGE, callback);
  }
});

AppDispatcher.register(function (payload) {
  var action = payload.action;
  switch (action.actionType) {
    case AppConstants.INIT:
    case AppConstants.AUTO_COMPLETE:
    case AppConstants.RECEIVE_LISTINGS:
    case AppConstants.LISTINGS_REQ:
    case AppConstants.AUTO_COMPLETE_REQ:
      setItems();
      PreloaderStore.emitChange();
      break;
  }
  return true;
});

module.exports = PreloaderStore;
