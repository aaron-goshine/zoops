import AppDispatcher from '../dispatcher/AppDispatcher' ;
import {EventEmitter} from 'events' ;
import AppConstants from '../constants/AppConstants' ;
import _ from 'lodash' ;

var _state = {
  listing: {}
};

/**
 * @function setItems
 * @param {object} listing - collection of items to filter
 * @description - a custom filter to remove entries with zero bedrooms
 * @return {array}
 */

function setItems (listing_f) {
  var LIMIT = 5;
  var LIMIT_KEY = String(LIMIT + '+');
  var bedRoomHash = {};

  var listing = _.filter(listing_f, (item) => {
    return (Number(item.num_bedrooms) > 0 && Number(item.price) > 0);
  });

  for (var i = 0; i < listing.length; i++) {
    var numberOfBeds = Number(listing[i].num_bedrooms);
    // grouping bedrooms lest than LIMIT which is currently set to five
    if (!bedRoomHash[numberOfBeds] && numberOfBeds < LIMIT) {
      bedRoomHash[numberOfBeds] = [];
      bedRoomHash[numberOfBeds].push(Number(listing[i].price));
    } else if (bedRoomHash[numberOfBeds] && numberOfBeds < LIMIT) {
      bedRoomHash[numberOfBeds].push(Number(listing[i].price));
    }

    // grouping bedrooms greater that or equal LIMIT which is currently set to five
    if (!bedRoomHash[LIMIT_KEY] && numberOfBeds >= LIMIT) {
      bedRoomHash[LIMIT_KEY] = [];
      bedRoomHash[LIMIT_KEY].push(Number(listing[i].price));
    } else if (bedRoomHash[LIMIT_KEY] && numberOfBeds >= LIMIT) {
      bedRoomHash[LIMIT_KEY].push(Number(listing[i].price));
    }
  }
  _state = {
    preservedKeys: _.keys(bedRoomHash),
    propertyAverages: _.map(bedRoomHash, function (items) {
      if (items.length < 1) return 0;
      return Math.round(_.reduce(items, (sum, n) => { return sum + n; }) / items.length);
    })
  };
}

/**
 * @class CharStore
 * @type {singleton}
 */
var ChartStore = _.assign(new EventEmitter(), {
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

// register to dispatcher
AppDispatcher.register((payload) => {
  var action = payload.action;
  switch (action.actionType) {
    case AppConstants.RECEIVE_LISTINGS:
      setItems(action.data.listing);
      ChartStore.emitChange();
      break;
  }
  return true;
});

module.exports = ChartStore;
