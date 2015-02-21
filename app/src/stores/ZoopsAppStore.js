var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');

var _state = {
  data: null
};

function setItems(data) {
  _state.data = data;
}

var ZoopsAppStore = _.assign(new EventEmitter, {
  getState() {
    return _state;
  },
  emitChange() {
    this.emit(AppConstants.CHANGE);
  },
  addChangeListener(callback) {
    this.on(AppConstants.CHANGE, callback);
  },
  removeChangeListener(callback) {
    this.removeListener(AppConstants.CHANGE, callback);
  }
});

AppDispatcher.register(function(payload) {
  console.log(payload);
  var action = payload.action;
  switch (action.actionType) {
    case AppConstants.RECEIVE_LISTINGS:
      setItems(action.data);
      ZoopsAppStore.emitChange();
      break;
  }
  return true;
});


module.exports = ZoopsAppStore;
