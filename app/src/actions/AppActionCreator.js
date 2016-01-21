import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import config from '../../mock/config';
import request from 'superagent';

var AppActions = {
  init () {
    var paramData = {
      keywords: '',
      listing_status: 'sale',
      method: 'property_listings',
      order_by: 'age',
      page_number: 1,
      pl_short: 'false',
      area: 'London'
    };

    request.get(config.LISTINGS_URL)
    .query(paramData)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      if (err) {
        console.log(err);
        return;
      }
      AppDispatcher.handleServerAction({
        actionType: AppConstants.RECEIVE_LISTINGS,
        data: res.body
      });
    });
  },
  getListing (term) {
    var paramData = {
      keywords: '',
      listing_status: 'sale',
      method: 'property_listings',
      order_by: 'age',
      ordering: 'descending',
      page_number: 1,
      pl_short: 'false',
      area: term
    };

    request.get(config.LISTINGS_URL)
    .query(paramData)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      if (err) {
        console.log(err);
        return;
      }
      AppDispatcher.handleServerAction({
        actionType: AppConstants.RECEIVE_LISTINGS,
        data: res.body
      });
    });
  },
  getAutoComplete (term) {
    request.get(config.LISTINGS_ACOM_URL)
    .query({search_term: term})
    .query({search_type: 'listings'})
    .set('Accept', 'application/json')
    .end(function (err, res) {
      if (err) {
        console.log(err);
        return;
      }
      AppDispatcher.handleServerAction({
        actionType: AppConstants.AUTO_COMPLETE,
        data: res.body
      });
    });
  },
  cleanAutoComplete () {
    AppDispatcher.handleServerAction({
      actionType: AppConstants.CLEAR_AUTO_COMPLETE
    });
  },
  downArrowSelect () {
    AppDispatcher.handleServerAction({
      actionType: AppConstants.DOWN_ARROW_SELECT
    });
  },
  selectByIndex (index) {
    AppDispatcher.handleServerAction({
      actionType: AppConstants.SELECTED_BY_INDEX,
      index: index
    });
  },
  upArrowSelect () {
    AppDispatcher.handleServerAction({
      actionType: AppConstants.UP_ARROW_SELECT
    });
  },
  sortByIndex (index) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SORT_BY_INDEX,
      index: index
    });
  }
};

export default AppActions;
