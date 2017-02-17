import React from 'react'
import * as d3_scale from 'd3-scale'

import * as drawingTool from '../../utils/drawing-tool'

const color_map = d3_scale.schemeCategory20;

export default class MaximumCanvas extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    drawingTool.drawFrame(this.canvas, this.ctx);
    this.renderData(this.props.maximum_list, this.props.loupe_point);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps.maximum_list, nextProps.loupe_point);
  }

  renderData(maximum_list, loupe_point) {
    if(maximum_list.length == 0) {
      return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    maximum_list.forEach((max, idx) => {
      this.ctx.fillStyle = color_map[maximum_list[idx]];
      this.ctx.fillRect(idx % this.canvas.width, idx / this.canvas.width, 1, 1);
    });

    drawingTool.drawLoupeArea(this.canvas, this.ctx, loupe_point);
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width={this.props.canvas_width} height={this.props.canvas_height} style={{left: 0, top: 0, zIndex: 0}}></canvas>
      </div>
    );
  }
}
