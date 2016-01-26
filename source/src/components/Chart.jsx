import React from 'react';
import ChartStore from '../stores/ChartStore';
import d3 from 'd3';

class ChartComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = this.getStateFromStore();
  }

  render () {
    return (
      <div {...this.props} className='tab-content'>
        <div id='chart'></div>
      </div>
    );
  }

  componentWillMount () {
    ChartStore.addChangeListener(this.onChange.bind(this));
  }

  componentWillUnMount () {
    ChartStore.removeChangeListener(this.onChange.bind(this));
  }

  renderChart () {
    var baseWidth = 420;
    var svgHeight = 420;
    var spacer = 5;
    var margin = 40;
    var chartHeight = (svgHeight - margin * 1.5);
    var data = this.state.propertyAverages;
    var labelForBeds = this.state.preservedKeys;
    var columnCount = data.length;

    var baseSvgWidth = baseWidth - ((margin * 2) + (spacer * (columnCount - 1)));
    var columnWidthPerc = ((baseSvgWidth / columnCount) / baseWidth) * 100;
    var spacerPerc = (spacer / baseWidth) * 100;

    var yScale = d3.scale.linear()
    .domain([d3.max(data), 0])
    .range([chartHeight, 0]);

    d3.select('svg')
    .remove();

    // main chart handle
    var chart = d3.select('#chart')
    .append('svg')
    .attr({'width': '100%', 'height': svgHeight});

    // group containing the vertical bars
    var barGroup = chart.append('g')
    .attr('transform', () => {
      return 'translate( ' + margin + ',' + margin + ')';
    });

    // group containing the top labels
    var labelGroup = chart.append('g')
    .attr('transform', () => {
      return 'translate( ' + margin + ',' + margin + ')';
    });

    // group containing the bottom labels
    var labelGroup2 = chart.append('g')
    .attr('transform', () => {
      return 'translate( ' + margin + ',' + margin + ')';
    });

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
      var availableSpace = 100 - columnWidthPerc * columnCount;
      return (i * (columnWidthPerc + availableSpace / columnCount - 1)) + '%';
    })
    .attr('y', (d, i) => {
      return (chartHeight - yScale(d));
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
      var availableSpace = 100 - columnWidthPerc * columnCount;
      return (i * ((columnWidthPerc + availableSpace / columnCount - 1)) + columnWidthPerc / 2) + '%';
    })
    .attr('y', (d, i) => {
      return (chartHeight - margin * 0.5 - yScale(d));
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
      var availableSpace = 100 - columnWidthPerc * columnCount;
      return (i * ((columnWidthPerc + availableSpace / columnCount - 1)) + columnWidthPerc / 2) + '%';
    })
    .attr('y', chartHeight - margin * 0.5)
    .text((d, i) => {
      return labelForBeds[i] + ' beds';
    });
  }

  onChange () {
    this.setState(this.getStateFromStore());
    this.renderChart();
  }

  getStateFromStore () {
    return ChartStore.getState();
  }
}

export default ChartComponent;
