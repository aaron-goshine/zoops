var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');

var _state = {
  data: null,
  isLoading: false
};

function setItems (data) {
  _state.data = data;
}

function setLoadingState (isLoading) {
  _state.isLoading = isLoading || false;
}

var ZoopsAppStore = _.assign(new EventEmitter(), {
  getState () {
    return _state;
  },
  getIsLoading () {
    return _state.isLoading;
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
    case AppConstants.RECEIVE_LISTINGS:
      setItems(action.data);
      setLoadingState(false);
      ZoopsAppStore.emitChange();
      break;
    case AppConstants.LISTINGS_REQ:
      setLoadingState(true);
      break;
  }
  return true;
});

module.exports = ZoopsAppStore;
