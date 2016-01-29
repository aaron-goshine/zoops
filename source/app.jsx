import React from 'react';
import ReactDOM from 'react-dom';
import Zoops from './components/ZoopsApp';

// attaching React to the global namespace to enable debugging
window.React = React;
ReactDOM.render(<Zoops/>, document.getElementById('app'));
