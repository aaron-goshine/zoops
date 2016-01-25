import React from 'react';
import ReactDOM from 'react-dom';
import {Tabs, Tab} from 'react-bootstrap';
import MapComponent from './components/Map';
import ChartComponent from './components/Chart';
import ListComponent from './components/List';
import SearchComponent from './components/Search';
import AppActionCreator from './actions/AppActionCreator';

// attaching React to global name space to enable debugging
window.React = React;

/**
 * @private
 * @var _visible || @var _hidden determine if tabs are shown or hidden
 */
var _visible = {'display': 'block'};
var _hidden = {'display': 'none'};

/**
 * @class Zoops
 * @type Component
 * @description Zoops is the main application component Class
 * current responsible for managing he various tab for different sections of the application
 * @extends React.Componet
 */
class Zoops extends React.Component {
  constructor (props) {
    super(props);
    // default state of the application is the make
    // Tab #1 visible
    this.state = {'tab': 1};

    // App Action Creator dispatches the initial ajax request to
    // populate the applications with the relevant data
    AppActionCreator.init();
  }
  render () {
    return (
      <div className="panel">
        <section>
          <div className="btn-toolbar" role="toolbar">
          <nav className="btn-group" role="group" >
            <button className={this.state.tab === 1 ? 'active btn' : 'btn'} onClick={() => {
              // simply setting the state to update which
              // tab content to be shown, currently each
              // tab has a hard coded number
              // TODO will improve by building are reuseable tab
              // component.
              this.setState({'tab': 1});
            }}> Map </button>
          <button className={this.state.tab === 2 ? 'active btn ' : 'btn'} onClick={() => {
            this.setState({'tab': 2});
          }}>List
        </button>
        <button className={this.state.tab === 3 ? 'active btn' : 'btn'} onClick={() => {
          this.setState({'tab': 3});
        }}>Chart
      </button>
    </nav>
        <SearchComponent/>
  </div>

    <div className="panel">
      <MapComponent style={this.state.tab === 1 ? _visible : _hidden} />
      <ListComponent style={this.state.tab === 2 ? _visible : _hidden} />
      <ChartComponent style={this.state.tab === 3 ? _visible : _hidden} />
    </div>
  </section>
</div>
    );
  }
}
ReactDOM.render(<Zoops/>, document.getElementById('app'));
