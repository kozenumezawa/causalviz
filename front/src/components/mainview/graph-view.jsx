import React from 'react';

import GraphContainer from '../graph/graph-container.jsx';

export default class GraphView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const svg = d3.select("#graphsvg")
                  .append("svg");
    svg.attr("width", 640);
    svg.attr("height", 480);

    const c1 = [100, 90, 30];  // [x, y, r]
    const c2 = [150, 90, 30];
    const color = d3.schemeCategory10;
    const circle = svg.selectAll('circle').data([c1, c2]).enter().append('circle')
        .attr("cx", (d) => { return d[0] })
        .attr("cy", (d) => { return d[1] })
        .attr("r", (d) => { return d[2] })
        .style("fill", (d, i) => { return color[i] })

    this.canvas = document.getElementById("graph");
    this.ctx = this.canvas.getContext('2d');
    // window.fetch('http://localhost:3000/api/v1/getcorr', {
    //   mode: 'cors',
    //   method: 'GET',
    //   headers: {
    //     'content-type': 'application/json',
    //   }
    // })
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((json) => {
    //     this.corr_list = json.data
    //     this.drawData(this.props);
    //   });
    window.fetch("trp3_corr.json")
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.corr_list = json.data
        this.drawData(this.props);
      });
  }

  componentWillReceiveProps(nextProps) {
    this.drawData(nextProps);
  }

  drawData(props) {
    if (props.tiff_list.length === 0) {
      return null
    }
    const canvas = props.tiff_list[0];
    this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.canvas.width, this.canvas.height);

    if (this.corr_list == null) {
      return null
    }

    this.ctx.beginPath();
    this.ctx.lineWidth = 0.5;

    props.parent_state.all_time_series.forEach((x, x_idx) => {
      if (x_idx < 3000) {
        if (x[0] !== 0 && x_idx % 10 === 0) {
          props.parent_state.all_time_series.forEach((y, y_idx) => {
            if (y[0] !== 0 && y_idx % 10 === 0) {
              const corr = this.corr_list[x_idx][y_idx];
              if (corr > 0.8) {
                this.ctx.moveTo(x_idx % props.parent_state.canvas_width * 5, Math.floor(x_idx / props.parent_state.canvas_width * 5));
                this.ctx.lineTo(y_idx % props.parent_state.canvas_width * 5, Math.floor(y_idx / props.parent_state.canvas_width * 5));
                this.ctx.stroke();
              }
            }
          });
        }
      }
    });
  }

  render() {
    const width = this.props.parent_state.canvas_width * 5;
    const height = this.props.parent_state.canvas_height * 5;

    return (
    <div>
      <div id="graphsvg"></div>
      <canvas id="graph" width={width} height={height}></canvas>
    </div>
    );
  }
}
