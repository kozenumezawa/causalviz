import React from 'react';

import GraphContainer from '../graph/graph-container.jsx';

export default class GraphView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById("graph");
    this.ctx = this.canvas.getContext('2d');

    window.fetch('http://localhost:3000/api/v1/getcorr', {
      mode: 'cors',
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.corr_list = json.data
        this.drawData(this.props);
      });
    // window.fetch("trp3_corr.json")
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((json) => {
    //     console.log(json);
    //
    //     this.drawData(this.props);
    //   });
  }

  componentWillReceiveProps(nextProps) {
    // this.drawData(nextProps);
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
      if (x[0] !== 0) {
        props.parent_state.all_time_series.forEach((y, y_idx) => {
          if (y[0] !== 0) {
            console.log(x_idx, y_idx);
            const corr = this.corr_list[x_idx][y_idx];
            if (corr > 0.8) {
              this.ctx.moveTo(x_idx % this.props.canvas_width * 10, x_idx / this.props.canvas_width * 10);
              this.ctx.lineTo(y_idx % this.props.canvas_width * 10, y_idx / this.props.canvas_width * 10);
              this.ctx.stroke();
            }
          }
        });
      }
    });


  }

  render() {
    const width = this.props.parent_state.canvas_width * 10;
    const height = this.props.parent_state.canvas_height * 10;
    return (
      <canvas id="graph" width={width} height={height}></canvas>
    );
  }
}
