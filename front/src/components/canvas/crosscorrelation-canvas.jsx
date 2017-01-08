import React from 'react'
import * as d3_scale from 'd3-scale'

import ClickedCanvas from './clicked_canvas.jsx'
import EventCanvas from './event_canvas.jsx'
import * as drawingTool from '../../utils/drawing-tool'
import * as pairTimeSeries from '../../utils/pair-time-series'

export default class CrossCorrelationCanvas extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    this.drawFrame();
    this.renderData(this.props.cluster_list, this.props.loupe_point);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps.cluster_list, nextProps.loupe_point);
  }

  renderData(cluster_list, loupe_point) {
    if(cluster_list.length == 0) {
      return;
    }

    const color_map = d3_scale.schemeCategory20c;
    for(let i = 0; i < cluster_list.length; i++) {
      this.ctx.fillStyle = color_map[cluster_list[i]];

      if(i % this.canvas.width > 250 && cluster_list[i] !== pairTimeSeries.error) {
        this.ctx.fillStyle = 'black'
      }

      this.ctx.fillRect(i % this.canvas.width, i / this.canvas.width, 1, 1);
    }

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
        <ClickedCanvas
          id={this.props.id}
          clicked_point={this.props.clicked_point}
          loupe_point={this.props.loupe_point}
        />
        <EventCanvas
          id={this.props.id}
          loupe_point={this.props.loupe_point}
        />
      </div>
    );
  }
}
