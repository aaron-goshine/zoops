var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');


var _state = {

};

function setItems(items) {
  _state.items = items;
}

function setView(name) {
  _state.view = name;
}

function sortItems(index) {
  var keyMap = ["title","value","rating"];

  _state.sortedBy = keyMap[index];
  _state.items = _.sortBy(_state.items,keyMap[index]);
}

var ProductsStore = _.assign(new EventEmitter, {
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
    case AppConstants.INIT:
      setItems(action.data);
      ProductsStore.emitChange();
      break;
  }
  return true;
});

module.exports = ProductsStore;
