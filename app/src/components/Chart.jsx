import React from 'react';
import ChartStore from '../stores/ChartStore';
import d3 from 'd3';

class ChartComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getStateFromStore();
  }

  render() {
    return (
      <div className="tab-content" style={{"border": "1px solid black"}}>
        <div id="chart"></div>
      </div>
    );
  }

  componentWillMount() {
    ChartStore.addChangeListener(this.onChange.bind(this));
  }

  componentWillUnMount() {
    ChartStore.removeChangeListener(this.onChange.bind(this));
  }

  renderChart() {
    var svgWidth = 860,
      svgHeight = 420,
      spacer = 10,
      margin = {left: 80, right: 80, top: 20, bottom: 40},
      chartHeight = (svgHeight - margin.top - margin.bottom),
      data = this.state.propertyAverages,
      labelForBeds = this.state.preservedKeys,
      columnCount = data.length,
      columnWidth = (((svgWidth - margin.left - margin.right) - (spacer * (columnCount - 1))) / data.length);

    var yScale = d3.scale.linear()
      .domain([d3.max(data), 0])
      .range([chartHeight, 0]);

    d3.select("svg")
      .remove();

    var chart = d3.select("#chart")
      .append("svg")
      .attr({"width": svgWidth, "height": svgHeight});

    chart
      .selectAll("g")
      .attr("class", "bars")
      .data(data)
      .enter()
      .append("g")
      .append("rect")
      .attr("width", columnWidth)
      .attr("height", function (d) {
        return yScale(d);
      })
      .attr("fill", "#ADD8E6")
      .attr("transform", (d, i) => {
        var x = (i * (columnWidth + spacer )) + margin.left;
        var y = (svgHeight - margin.bottom - margin.top - yScale(d) + margin.top );
        return "translate( " + x + "," + y + ")";
      });

    chart
      .selectAll(".bars")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bars-prices")
      .attr("text-anchor", "middle")
      .attr("transform", (d, i) => {
        var x = (i * (columnWidth + spacer )) + margin.left + columnWidth / 2;
        var y = (svgHeight - margin.bottom - margin.top - yScale(d) + margin.top ) - 3;
        return "translate( " + x + "," + y + ")";
      })
      .text((d)=> {
        var mil = 1000000, kil = 1000;
        var twoDecimal = (n) => {
          return Math.round((n * 100)) / 100
        };
        return "£" + ((d >= mil ) ? twoDecimal(d / mil) + 'M' : ( twoDecimal(d > kil) ? twoDecimal(d / kil) + 'K' : d));
      });

    chart
      .selectAll(".bars")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bars-labels")
      .attr("text-anchor", "middle")
      .attr("transform", (d, i)=> {
        var x = (i * (columnWidth + spacer )) + margin.left + columnWidth / 2;
        var y = (svgHeight - margin.bottom + margin.top );
        return "translate( " + x + "," + y + ")";
      })
      .text((d, i)=> {
        return labelForBeds[i] + " beds";
      });
  }

  onChange() {
    this.setState(this.getStateFromStore());
    this.renderChart();
  }

  getStateFromStore() {
    return ChartStore.getState()
  }
}

export default  ChartComponent;
