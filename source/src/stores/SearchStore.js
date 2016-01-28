var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');

var _state = {
  suggestions: [],
  selectedIndex: 0,
  isLoading: false
};

function setItems (data) {
  _state.suggestions = data.suggestions || [];
}

function setLoadingState (isLoading) {
  _state.isLoading = isLoading || false;
}

function clearItems () {
  _state = {
    suggestions: []
  };
}

function upArrowSelectIndex () {
  if (_state.selectedIndex <= 0) {
    _state.selectedIndex = (_state.suggestions.length - 1);
  } else {
    _state.selectedIndex--;
  }
}

function downArrowSelectIndex () {
  if (_state.selectedIndex >= (_state.suggestions.length - 1)) {
    _state.selectedIndex = 0;
  } else {
    _state.selectedIndex++;
  }
}

function selectByIndex (index) {
  _state.selectedIndex = index;
}

var SearchStore = _.assign(new EventEmitter(), {
  getState () {
    return _state;
  },
  getIsLoading () {
    return _state.isLoading;
  },
  getSuggestions () {
    return _state.suggestions;
  },
  getSelectedIndex () {
    return _state.selectedIndex;
  },
  getSelectedSuggestions () {
    if (!_state.suggestions) return '';

    if ((_state.suggestions.length - 1) >= _state.selectedIndex) {
      return (_state.suggestions[_state.selectedIndex].value).toLowerCase();
    }
    return '';
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

AppDispatcher.register((payload) => {
  var action = payload.action;
  switch (action.actionType) {
    case AppConstants.AUTO_COMPLETE:
      setItems(action.data);
      setLoadingState(false);
      SearchStore.emitChange();
      break;
    case AppConstants.AUTO_COMPLETE_REQ:
      setLoadingState(true);
      break;
    case AppConstants.CLEAR_AUTO_COMPLETE:
      clearItems();
      SearchStore.emitChange();
      break;
    case AppConstants.UP_ARROW_SELECT:
      upArrowSelectIndex();
      SearchStore.emitChange();
      break;
    case AppConstants.DOWN_ARROW_SELECT:
      downArrowSelectIndex();
      SearchStore.emitChange();
      break;
    case AppConstants.SELECTED_BY_INDEX:
      selectByIndex(action.index);
      SearchStore.emitChange();
      break;
  }
  return true;
});

module.exports = SearchStore;
