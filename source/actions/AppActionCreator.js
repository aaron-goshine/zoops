import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import config from '../mock/config';
import request from 'superagent';

export default {
  init () {
    this.listingsApiEndPoint('London');
  },
  getListing (term) {
    this.listingsApiEndPoint(term);
  },
  getAutoComplete (term) {
    var that = this;
    window.clearTimeout(this.timeout);
    that.timeout = window.setTimeout(() => {
      that.initReqAutoComplete();
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
    }, 1000);
  },
  listingsApiEndPoint: function (term) {
    var paramData = {
      keywords: '',
      listing_status: 'sale',
      method: 'property_listings',
      order_by: 'age',
      page_number: 1,
      pl_short: 'false',
      area: term
    };

    var that = this;
    window.clearTimeout(this.timeout);
    that.timeout = window.setTimeout(() => {
      that.initListingReq();
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
    }, 1000);
  },
  initListingReq () {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.LISTINGS_REQ
    });
  },
  initReqAutoComplete () {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.AUTO_COMPLETE_REQ
    });
  },
  cleanAutoComplete () {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.CLEAR_AUTO_COMPLETE
    });
  },
  downArrowSelect () {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.DOWN_ARROW_SELECT
    });
  },
  selectByIndex (index) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SELECTED_BY_INDEX,
      index: index
    });
  },
  upArrowSelect () {
    AppDispatcher.handleViewAction({
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
