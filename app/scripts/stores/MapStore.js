var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');
var _Items = [];

var MapStore = _.assign(new EventEmitter, {
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
        case AppConstants.MAP_DATA:
            //----
            break;
        default:
            return true;
    }
    MapStore.emitChange();
    return true;
});

module.exports = MapStore;
