import React from 'react';
import {filter} from 'lodash';

class ListComponent extends React.Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.setSortIndex();
  }

  render () {
    return (
      <div {... this.props}>
        <table className="table">
          <thead className="thead-inverse">
            <tr>
              <th className="property-col" onClick={() => {
                this.setSortIndex();
              }}> Property
            </th>
            <th className="price-col" onClick={() => {
              this.setSortIndex(1);
            }}>Price
          </th>
          <th className="bedrooms-col"
            onClick={() => {
              this.setSortIndex(2);
            }}>Berooms
          </th>
          <th className="published-col" onClick={() => {
            this.setSortIndex(3);
          }}> Published
        </th>
      </tr>
    </thead>
    <tbody>
      {this.getSortedList().map((item, i) => {
        var price = Number(item.price);
        return (
          <tr key={item.listing_id + i}>
            <td className="property-col">{item.agent_name}</td>
            <td className="price-col">
              £{(price >= 1000000) ? (price / 1000000) + 'M' : ((price > 1000) ? (price / 1000) + 'K' : price)}
            </td>
            <td className="bedrooms-col">{item.num_bedrooms}</td>
            <td className="published-col">
              {item.first_published_date}
            </td>
          </tr>
          );
      })}
    </tbody>
  </table>
</div>
    );
  }

  filterList () {
    var listing = this.props.dataListing;
    return filter(listing, (item) => {
      return (Number(item.num_bedrooms) > 0 && Number(item.price) > 0);
    });
  }

  setSortIndex (index) {
    if (!index) index = 0;
    var keyMap = [
      {key: 'agent_name', type: String},
      {key: 'price', type: Number},
      {key: 'num_bedrooms', type: Number},
      {key: 'first_published_date', type: Date}];

    this.setState({
      sortConfig: keyMap[index]
    });
  }

  getSortedList () {
    var sortConfig = this.state.sortConfig;
    var filteredList = this.filterList();
    return filteredList.sort((a, b) => {
      var aValue = a[sortConfig.key];
      var bValue = b[sortConfig.key];
      return (sortConfig.type(aValue) > sortConfig.type(bValue)) ? -1 : 1;
    });
  }
}

ListComponent.propTypes = {
  dataListing: React.PropTypes.array.isRequired
};

ListComponent.defaultProps = {
  dataListing: []
};

export default ListComponent;
