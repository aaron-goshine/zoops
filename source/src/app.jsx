import React from 'react';
import ReactDOM from 'react-dom';
import MapComponent from './components/Map';
import ChartComponent from './components/Chart';
import ListComponent from './components/List';
import SearchComponent from './components/Search';
import AppActionCreator from './actions/AppActionCreator';
import Store from './stores/ZoopsAppStore';

// attaching React to the global namespace to enable debugging
window.React = React;

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
    this.state = {
      'tab': 1,
      'data': this.getStateFromStore()
    };

    // App Action Creator dispatches the initial ajax request to
    // populate the applications with the relevant data
    AppActionCreator.init();
  }

  componentWillMount () {
    Store.addChangeListener(this.onChange.bind(this));
  }

  componentWillUnMount () {
    Store.removeChangeListener(this.onChange.bind(this));
  }

  render () {
    return (
      <div className="panel">
        <nav className="navbar navbar-light bg-faded" role="group" >
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <a className={this.getTabClassName(1)} onClick={() => {
                  // simply setting the state to update which
                  // tab content to be shown, currently each
                  // tab has a hard coded number
                  // TODO will improve by building are reuseable tab
                  // component.
                this.setState({'tab': 1});
              }}> Map
              </a>
            </li>
            <li className="nav-item">
              <a className={this.getTabClassName(2)} onClick={() => {
                this.setState({'tab': 2});
              }}>List
              </a>
            </li>
            <li className="nav-item">
              <a className={this.getTabClassName(3)} onClick={() => {
                this.setState({'tab': 3});
              }}>Chart
              </a>
            </li>
        </ul>
        <SearchComponent />
      </nav>
  <section>
    <div className="panel">
      <MapComponent className={this.getTCClassName(1)} />
      <ListComponent className={this.getTCClassName(2)} />
      <ChartComponent className={this.getTCClassName(3)} dataListing={this.state.data.listing || []} />
    </div>
  </section>
</div>
    );
  }

  onChange () {
    this.setState({
      data: this.getStateFromStore().data
    });
  }

  getStateFromStore () {
    return Store.getState();
  }

  getTabClassName (index) {
    return this.state.tab === index ? 'active ' : '';
  }

  getTCClassName (index) {
    return this.state.tab === index ? 'active ' : 'hide';
  }
}
ReactDOM.render(<Zoops/>, document.getElementById('app'));
