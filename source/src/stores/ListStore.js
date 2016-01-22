var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');


var _state = {
  listing: []
};

function setItems(listing) {
  listing = _.filter(listing, (item) => {
    return (Number(item.num_bedrooms) > 0 && Number(item.price) > 0);
  });
  _state.listing = listing;
}


function sortItems(index) {
  var keyMap = [
    {key: "agent_name", type: String},
    {key: "price", type: Number},
    {key: "num_bedrooms", type: Number},
    {key: "first_published_date", type: Date}];
  _state.sortedBy = keyMap[index];
  _state.listing.sort((a, b)=> {
    var ax = _state.sortedBy.type(a [_state.sortedBy.key]) ;
    var bx = _state.sortedBy.type(b [_state.sortedBy.key]) ;
    return (bx > ax) ? -1 : 1;
  });
}

var ListStore = _.assign(new EventEmitter, {
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
      setItems(action.data.listing);
      ListStore.emitChange();
      break;
    case AppConstants.SORT_BY_INDEX:
      sortItems(action.index);
      ListStore.emitChange();
      break;
  }
  return true;
});

module.exports = ListStore;
