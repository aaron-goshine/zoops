import React from 'react';
import ReactDOM from 'react-dom';
import {Tabs, Tab} from 'react-bootstrap';
import MapComponent from './components/Map';
import ChartComponent from './components/Chart';
import ListComponent from './components/List';
import SearchComponent from './components/Search';
import AppActionCreator from './actions/AppActionCreator';

window.React = React;
var visibleTab = {'display': 'block'};
var inVisibleTab = {'display': 'none'};

class Zoops extends React.Component {
  constructor (props) {
    super(props);
    this.state = {'tab': 1};
    AppActionCreator.init();
  }
  render () {
    return (
      <div className="panel">
        <SearchComponent/>
        <section>
          <ul className="nav nav-tabs">
            <li>
              <a onClick={() => {
                this.setState({'tab': 1});
              }}>Map</a>
          </li>
          <li>
            <a onClick={() => {
              this.setState({'tab': 2});
            }}>List</a>
        </li>
        <li>
          <a onClick={() => {
            this.setState({'tab': 3});
          }}>Chart</a>
      </li>
    </ul>

    <div className="panel">
      <MapComponent style={this.state.tab === 1 ? visibleTab : inVisibleTab} />
      <ListComponent style={this.state.tab === 2 ? visibleTab : inVisibleTab} />
      <ChartComponent style={this.state.tab === 3 ? visibleTab : inVisibleTab} />
    </div>
  </section>
</div>
    );
  }
}
ReactDOM.render(<Zoops/>, document.getElementById('app'));
