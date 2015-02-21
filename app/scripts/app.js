/** @jsx React.DOM */

//pjub5ry8th4n9tvsvjkfm8tm
//http://api.zoopla.co.uk/api/v1/property_listings.json?area=Oxford&api_key=pjub5ry8th4n9tvsvjkfm8tm
var React = window.React = require('react');
var TabbedArea = require('react-bootstrap').TabbedArea;
var TabPane = require('react-bootstrap').TabPane;

var PlMapComponent = require('./components/Map');
var PlChartComponent = require('./components/Chart');
var PlListComponent = require('./components/List');



var PlenApp = React.createClass({
    getInitialState: function() {
        return {};
    },
    onChange: function(event) {
        console.log(event)

    },
    handleSubmit: function(event) {

    },
    render: function() {
        return (
            <div className="panel">
                <div className="row search-form" >
                    <form onSubmit={this.handleSubmit}>
                        <input className="form-control" onChange={function() {
                            alert("---");
                        }
                            } value={this.state.text} />
                        <button className="btn btn-default" onClick={function() {
                            alert("---");
                        }} >Search</button>
                    </form>
                </div>
                <TabbedArea defaultActiveKey={1}>
                    <TabPane eventKey={1} tab="Map">
                        <PlMapComponent/>
                    </TabPane>
                    <TabPane eventKey={2} tab="List">
                        <PlListComponent/>
                    </TabPane>
                    <TabPane eventKey={3} tab="Chart">
                        <PlChartComponent/>
                    </TabPane>
                </TabbedArea>
            </div>
        );
    }
});


React.render(<PlenApp />, document.getElementById("app"));

