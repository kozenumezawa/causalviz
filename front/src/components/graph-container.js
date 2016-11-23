import React from 'react'
import * as d3 from 'd3'
import {scaleLinear, scaleOrdinal, schemeCategory10, line} from 'd3'


export default class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  createTimeSeriesFromTiff() {
    let green_time_series_inverse = [];
    this.props.tiff_list.forEach((element, idx) => {
      const canvas = this.props.tiff_list[idx];
      const context = canvas.getContext('2d');
      const image_data = context.getImageData(0, 0, canvas.width, canvas.height);
      const image_rgba = image_data.data; // image_rgba = [R, G, B, A, R, G, B, A, ...] (hex data)

      green_time_series_inverse.push(this.getGreenFromRGBA(image_rgba));
      // console.log(green_time_series_inverse) -> [time][points]
    });

    // transpose time series data
    let green_time_series = [];
    for(let i = 0; i < green_time_series_inverse[0].length; i++) {
      green_time_series[i] = [];
      for(let j = 0; j < green_time_series_inverse.length; j++) {
        green_time_series[i][j] = green_time_series_inverse[j][i];
      }
    }
    // console.log(green_time_series) -> [points][time]
    return green_time_series;
  }

  getGreenFromRGBA(rgba_data) {
    let green_list = [];
    for(let i = 1; i < rgba_data.length; i += 4) {
      green_list.push(rgba_data[i]);
    }
    return green_list;
  }
  
  renderData() {
    const green_time_series = this.createTimeSeriesFromTiff();

    // Array[3]Array[10100].{s,t}
    const graph_grid = d3.select("#time_series_graph");
    const aspect = 1.5;
    const svgWidth = parseInt(graph_grid.style("width"));
    const svgHeight = Math.floor(svgWidth / aspect);
    const contentWidth = svgWidth;
    const contentHeight = svgHeight;
    const xScale = scaleLinear()
      .domain([0, green_time_series[0].length - 1])
      .range([0, contentWidth]);
    const yScale = scaleLinear()
      .domain([0, 255])
      .range([contentHeight, 0]);
    const l = line()
      .x((_, i) => xScale(i))
      .y((d) => yScale(+d))
    const color = scaleOrdinal(schemeCategory10)
    const dataOpacity = 0.02
    const featureOpacity = 0.5

    return (
      <div>
        <svg width={svgWidth} height={svgHeight}>
          <g transform='translate(50,50)'>
            <g>{
              green_time_series.map((data, i) => <path key={i} d={l(data)} fill='none' stroke={color(0)} opacity={dataOpacity} />)
            }</g>
          </g>
        </svg>
      </div>
    );
  }

  render() {
    return (
      <div id="time_series_graph">
        {(() => {
          if(this.props.tiff_list.length != 0) {
            return this.renderData();
          }
        })()}
      </div>
    );
  }
}
