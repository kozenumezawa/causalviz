import React from 'react'

import ClickedCanvas from './clicked_canvas.jsx'
import EventCanvas from './event_canvas.jsx'
import * as drawingTool from '../../utils/drawing-tool'

export default class RelationCanvas extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    this.drawFrame();
    this.renderData(this.props.relation_list);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps.relation_list);

    // magnify the area which is surrounded by a loupe
    if(nextProps.loupe_point.on == true && nextProps.loupe_point.x != -1) {
      this.renderData(nextProps.relation_list); // draw a base image
      const loupe_point = nextProps.loupe_point;
      const magnify_length = loupe_point.side * 2;
      const magnify_x = loupe_point.x - loupe_point.side;
      const magnify_y = loupe_point.y - loupe_point.side;

      const clipped_length = loupe_point.side;
      const clipped_x = loupe_point.x - clipped_length / 2;
      const clipped_y = loupe_point.y - clipped_length / 2;

      this.ctx.drawImage(this.canvas, clipped_x, clipped_y, clipped_length, clipped_length
        , magnify_x, magnify_y, magnify_length, magnify_length);
    }
  }

  // convert [-1, 1] -> [0, 1]
  colorScale(x) {
    return 0.5 + (x / 2);
  }

  renderData(relation_list) {
    if(relation_list.length == 0) {
      return;
    }

    for(let i = 0; i < relation_list.length; i++) {
      const correlation = relation_list[i];
      const error = -2;     // this value is needed to equal to pair-time-series.js's error
      const lightness = (correlation == error) ? 0 : 0.5;
      const color = this.colorScale(correlation);
      const saturation = 0.8;

      const rgb = drawingTool.hslToRgb(2 / 3 * (1 - color), saturation, lightness);
      this.ctx.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      this.ctx.fillRect(i % this.canvas.width, i / this.canvas.width, 1, 1);
    }
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
