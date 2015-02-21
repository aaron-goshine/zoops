var React = require('react');


var PlMapComponent = React.createClass({
    render: function() {
        return (
            <div className="tab-content">
                <img src="https://maps.googleapis.com/maps/api/staticmap?center=-15.800513,-47.91378&zoom=11&size=800x400"/>
            </div>
        );
    }
});

module.exports = PlMapComponent;

