import React from 'react'
import * as d3_scale from 'd3-scale'

import * as drawingTool from '../../utils/drawing-tool'

export default class MaximumCanvas extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    this.drawFrame();
    this.renderData(this.props.maximum_list, this.props.loupe_point);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps.maximum_list, nextProps.loupe_point);
  }

  // from 128~255 to 0~300
  colorScale(x) {
    return ((x - 128) / 128) * 300;
  }

  renderData(maximum_list, loupe_point) {
    if(maximum_list.length == 0) {
      return;
    }

    const color_map = d3_scale.schemeCategory20;
    maximum_list.forEach((max, idx) => {
      if(max < 30) {
        this.ctx.fillStyle = 'black';
      } else {
        const percent = this.colorScale(max);
        const color_index = Math.floor(percent / 30 / 2);
        this.ctx.fillStyle = color_map[color_index];
      }
      this.ctx.fillRect(idx % this.canvas.width, idx / this.canvas.width, 1, 1);
    });

    drawingTool.drawLoupeArea(this.canvas, this.ctx, loupe_point);
  }

  drawFrame() {
    // draw a frame
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.canvas.width, 0);
    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.lineTo(0, 0);
    this.ctx.stroke();
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width="285" height="130" style={{left: 0, top: 0, zIndex: 0}}></canvas>
      </div>
    );
  }
}
