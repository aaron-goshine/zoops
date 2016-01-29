import React from 'react';
import PreloaderStore from '../stores/PreloaderStore';

class Preloader extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      active: PreloaderStore.getState()
    };
  }

  componentWillMount () {
    PreloaderStore.addChangeListener(this.onChange.bind(this));
  }

  componentWillUnMount () {
    PreloaderStore.removeChangeListener(this.onChange.bind(this));
  }

  render () {
    if (!this.state.active) return null;
    return (
      <div className="preloader">
      <div className="loader">Loading...</div>
      </div>
    );
  }

  onChange () {
    this.setState(PreloaderStore.getState());
    console.log('preloader');
    console.log(this.state);
    console.log('_________');
  }
}

export default Preloader;
