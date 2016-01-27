import React from 'react';
import d3 from 'd3';
import {filter, keys, map, reduce} from 'lodash' ;

class ChartComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <div {...this.props}>
        <div ref="chart" id="chart"></div>
        {this.renderChart()}
      </div>
    );
  }

  renderChart () {
    var baseWidth = 800;
    var svgHeight = 400;
    var spacer = 5;
    var margin = 40;

    // Processing data from props
    var dataSource = this.processListing();
    var data = dataSource.propertyAverages;
    var labels = dataSource.preservedKeys;

    if (data.length < 1) return;

    var colCount = data.length;

    var viewPortHeight = (svgHeight - margin * 2);
    var viewPortWidth = (baseWidth - margin * 2);

    var columnWidth = (viewPortWidth - spacer * (colCount - 1)) / colCount;

    var columnWidthPerc = ((columnWidth / viewPortWidth) * 100).toFixed(2);

    var spacerPerc = ((spacer / viewPortWidth) * 100).toFixed(2);

    var yScale = d3.scale.linear()
    .domain([d3.max(data), 0])
    .range([viewPortHeight, 0]);

    d3.select('svg')
    .remove();

    // main chart handle
    var chart = d3.select('#chart')
    .append('svg')
    .attr({'width': '100%', 'height': svgHeight});

    // group containing the vertical bars
    var barGroup = chart.append('g');

    // group containing the top labels
    var labelGroup = chart.append('g');

    // group containing the bottom labels
    var labelGroup2 = chart.append('g');

    // creating and appending the vertical bars to the
    // bars groups
    barGroup.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('width', columnWidthPerc + '%')
    .attr('height', function (d) {
      var height = yScale(d) - margin;
      return height > 0 ? height : 1;
    })
    .attr('fill', '#ADD8E6')
    .attr('x', (d, i) => {
      var colWithSpacePerc = Number(columnWidthPerc) + Number(spacerPerc);
      return (i * colWithSpacePerc) + '%';
    })
    .attr('y', (d, i) => {
      return (viewPortHeight - yScale(d));
    });

    // Creating and appending text elements to server as the top
    // labels for each bars
    labelGroup.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('width', columnWidthPerc + '%')
    .attr('text-anchor', 'middle')
    .attr('x', (d, i) => {
      var colWithSpacePerc = Number(columnWidthPerc) + Number(spacerPerc);
      return ((i * colWithSpacePerc) + columnWidthPerc * 0.5) + '%';
    })
    .attr('y', (d, i) => {
      var x = (viewPortHeight - margin * 0.5 - yScale(d));
      return x > margin ? x : margin;
    })
    .text((d) => {
      var mil = 1000000;
      var kil = 1000;
      var twoDecimal = (n) => {
        return Math.round((n * 100)) / 100;
      };
      return '£' + ((d >= mil) ? twoDecimal(d / mil) + 'M' : (twoDecimal(d > kil) ? twoDecimal(d / kil) + 'K' : d));
    });

    // Creating and appending text elements to server as the bottom labels
    // for each bar
    labelGroup2.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('x', (d, i) => {
      var colWithSpacePerc = Number(columnWidthPerc) + Number(spacerPerc);
      return ((i * colWithSpacePerc) + columnWidthPerc * 0.5) + '%';
    })
    .attr('y', viewPortHeight - margin * 0.5)
    .text((d, i) => {
      return labels[i] + ' beds';
    });
  }

    /**
     * @function processListing
     * @return {array}
     */

    processListing () {
      var LIMIT = 5;
      var LIMIT_KEY = String(LIMIT + '+');
      var bedRoomHash = {};

      var listing = filter(this.props.dataListing, (item) => {
        return (Number(item.num_bedrooms) > 0 && Number(item.price) > 0);
      });

      for (var i = 0; i < listing.length; i++) {
        var numberOfBeds = Number(listing[i].num_bedrooms);
        // grouping bedrooms lest than LIMIT which is currently set to five
        if (!bedRoomHash[numberOfBeds] && numberOfBeds < LIMIT) {
          bedRoomHash[numberOfBeds] = [];
          bedRoomHash[numberOfBeds].push(Number(listing[i].price));
        } else if (bedRoomHash[numberOfBeds] && numberOfBeds < LIMIT) {
          bedRoomHash[numberOfBeds].push(Number(listing[i].price));
        }

        // grouping bedrooms greater that or equal LIMIT which is currently set to five
        if (!bedRoomHash[LIMIT_KEY] && numberOfBeds >= LIMIT) {
          bedRoomHash[LIMIT_KEY] = [];
          bedRoomHash[LIMIT_KEY].push(Number(listing[i].price));
        } else if (bedRoomHash[LIMIT_KEY] && numberOfBeds >= LIMIT) {
          bedRoomHash[LIMIT_KEY].push(Number(listing[i].price));
        }
      }

      return {
        preservedKeys: keys(bedRoomHash),
        propertyAverages: map(bedRoomHash, function (items) {
          if (items.length < 1) return 0;
          return Math.round(reduce(items, (sum, n) => { return sum + n; }) / items.length);
        })
      };
    }
}

ChartComponent.propTypes = {
  dataListing: React.PropTypes.array.isRequired
};

ChartComponent.defaultProps = {
  dataListing: []
};

export default ChartComponent;
