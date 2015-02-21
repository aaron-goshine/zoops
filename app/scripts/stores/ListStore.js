var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');
var _Items = [];

var ListStore = _.assign(new EventEmitter, {
    addChangeListener(callback) {
        this.on(AppConstants.CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(AppConstants.CHANGE_EVENT, callback);
    }
});

AppDispatcher.register((payload) => {
    var action = payload.action;
    switch (action.actionType) {
        case AppConstants.LIST_DATA:

            break;
        default:
            return true;
    }

    ListStore.emitChange();
    return true;
});

module.exports = ListStore;
