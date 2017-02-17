import React from 'react'

import ClickedCanvas from './clicked-canvas.jsx'
import EventCanvas from './event-canvas.jsx'
import * as drawingTool from '../../utils/drawing-tool'

export default class RelationCanvas extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    drawingTool.drawFrame(this.canvas, this.ctx);
    this.renderData(this.props.relation_list);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.relation_list.toString() !== nextProps.relation_list.toString()
        || nextProps.loupe_point.on === true
    ) {
      this.renderData(nextProps.relation_list);
    }
    drawingTool.drawLoupeArea(this.canvas, this.ctx, nextProps.loupe_point);
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
