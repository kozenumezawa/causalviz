import React from 'react'
import * as d3_scale from 'd3-scale'

import ClickedCanvas from './clicked-canvas.jsx'
import EventCanvas from './event-canvas.jsx'
import * as drawingTool from '../../utils/drawing-tool'
import * as pairTimeSeries from '../../utils/pair-time-series'

export default class CorrelationCanvas extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);``
    this.ctx = this.canvas.getContext('2d');
    drawingTool.drawFrame(this.canvas, this.ctx);
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
      if(i % this.canvas.width > 250 && cluster_list[i] !== pairTimeSeries.error) {
        this.ctx.fillStyle = 'white'
      } else if(cluster_list[i] === pairTimeSeries.error) {
        this.ctx.fillStyle = 'black'
      } else {
        this.ctx.fillStyle = color_map[cluster_list[i]];
      }
      this.ctx.fillRect(i % this.canvas.width, i / this.canvas.width, 1, 1);
    }

    drawingTool.drawLoupeArea(this.canvas, this.ctx, loupe_point);
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width={this.props.canvas_width} height={this.props.canvas_height} style={{left: 0, top: 0, zIndex: 0}}></canvas>
        <ClickedCanvas
          id={this.props.id}
          canvas_width={this.props.canvas_width}
          canvas_height={this.props.canvas_height}
          clicked_point={this.props.clicked_point}
          loupe_point={this.props.loupe_point}
        />
        <EventCanvas
          id={this.props.id}
          canvas_width={this.props.canvas_width}
          canvas_height={this.props.canvas_height}
          loupe_point={this.props.loupe_point}
        />
      </div>
    );
  }
}
