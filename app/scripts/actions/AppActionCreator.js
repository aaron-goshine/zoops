var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var reqwest = require('reqwest');

var AppActions = {
  init() {
    reqwest({
      url: '/mock/data.json'
      , method: 'get'
      , data: [{name: 'test', value: 1}]
      , success: function(resp) {
        AppDispatcher.handleServerAction({
          actionType: AppConstants.INIT,
          data: resp
        });
      }
    });

  },
  addToKart(item) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ADD_TO_KART,
      item: item
    });
  },
  removeItemFromKart(id) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.REMOVE_ITEM_FROM_KART,
      id: id
    });
  },
  removeAllItemsFromKart(id) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.REMOVE_FROM_KART,
      id: id
    });
  },
  selectListView() {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SELECT_LIST_VIEW
    });
  },
  selectTableView() {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SELECT_TABLE_VIEW
    });
  },
  sortBykey(index) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SORT_BY_KEY,
      index: index
    });
  }
};

module.exports = AppActions;