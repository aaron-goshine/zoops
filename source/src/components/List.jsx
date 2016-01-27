import React from 'react';
import ListStore from '../stores/ListStore';
import AppActionCreator from '../actions/AppActionCreator';

class ListComponent extends React.Component {

  constructor (props) {
    super(props);
    this.state = this.getStateFromStore();
  }

  componentWillMount () {
    ListStore.addChangeListener(this.onChange.bind(this));
  }

  componentWillUnMount () {
    ListStore.removeChangeListener(this.onChange.bind(this));
  }

  render () {
    return (
      <div {... this.props}>
        <table className="table">
          <thead className="thead-inverse">
            <tr>
              <th className="property-col" onClick={() => {
                AppActionCreator.sortByIndex(0);
              }}> Property
            </th>
            <th className="price-col" onClick={() => {
              AppActionCreator.sortByIndex(1);
            }}>Price
          </th>
          <th className="bedrooms-col"
            onClick={() => {
              AppActionCreator.sortByIndex(2);
            }}>Berooms
          </th>
          <th className="published-col" onClick={() => {
            AppActionCreator.sortByIndex(3);
          }}> Published
        </th>
      </tr>
    </thead>
    <tbody>
      {this.state.listing.map((item, i) => {
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

  onChange () {
    this.setState(this.getStateFromStore());
  }

  getStateFromStore () {
    return ListStore.getState();
  }
}

export default ListComponent;
