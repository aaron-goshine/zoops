import React from 'react';
import ReactDOM from 'react-dom';
import {Tabs, Tab} from 'react-bootstrap';
import MapComponent from './components/Map';
import ChartComponent from './components/Chart';
import ListComponent from './components/List';
import SearchComponent from './components/Search';
import AppActionCreator from './actions/AppActionCreator';

window.React = React;

class Zoops extends React.Component {
  constructor (props) {
    super(props);
    AppActionCreator.init();
  }

  render () {
    return (
      <div className="panel">
        <SearchComponent/>
        <Tabs defaultActiveKey={1}>
          <Tab eventKey={1} title="Map">
            <MapComponent/>
          </Tab>
          <Tab eventKey={2} title="List">
            <ListComponent/>
          </Tab>
          <Tab eventKey={3} title="Chart">
            <ChartComponent/>
          </Tab>
        </Tabs>
      </div>
    );
  }
}
ReactDOM.render(<Zoops/>, document.getElementById('app'));
