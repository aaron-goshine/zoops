var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');

//Default to london

var _state = {
  data: {
    latitude : 0.0,
    longitude : 51.50
  }
};


function setItems(data) {
  _state.data = data;
}

var MapStore = _.assign(new EventEmitter, {
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

AppDispatcher.register((payload) => {
  var action = payload.action;
  switch (action.actionType) {
    case AppConstants.RECEIVE_LISTINGS:
      setItems(action.data);
      MapStore.emitChange();
      break;
  }
  return true;
});

module.exports = MapStore;
