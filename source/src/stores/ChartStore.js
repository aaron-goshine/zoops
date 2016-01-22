import AppDispatcher from '../dispatcher/AppDispatcher' ;
import {EventEmitter} from 'events' ;
import AppConstants from '../constants/AppConstants' ;
import _ from 'lodash' ;


var _state = {
  listing: {}
};

function setItems(listing) {
  listing = _.filter(listing, (item) => {
    return (Number(item.num_bedrooms) > 0 && Number(item.price) > 0);
  });

  var LIMIT = 5;
  var LIMIT_KEY = String(LIMIT+"+");
  var bedRoomHash = {};

  for (var i = 0; i < listing.length; i++) {
    var numberOfBeds = Number(listing[i].num_bedrooms);

    if (!bedRoomHash [numberOfBeds] && numberOfBeds < LIMIT) {
      bedRoomHash [numberOfBeds] = [];
    }

    if (!bedRoomHash [LIMIT_KEY] && numberOfBeds > LIMIT) {
      bedRoomHash [LIMIT_KEY] = [];
    }

    if (numberOfBeds < LIMIT) {
      bedRoomHash [numberOfBeds].push(Number(listing[i].price));
    } else if (numberOfBeds > LIMIT) {
      bedRoomHash[LIMIT_KEY].push(Number(listing[i].price));
    }

  }
  var preservedKeys = _.keys(bedRoomHash);
  var propertyAverages = _.map(bedRoomHash, function (items) {
    if(items.length < 1) return 0;
    return Math.round(_.reduce(items,(sum, n) =>{ return sum + n; })/items.length);
  });
  _state = {
    preservedKeys: preservedKeys,
    propertyAverages: propertyAverages
  };
}

var ChartStore = _.assign(new EventEmitter, {
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
      ChartStore.emitChange();
      break;
  }
  return true;
});


module.exports = ChartStore;
