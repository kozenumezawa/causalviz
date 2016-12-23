import React from 'react'

import * as drawingTool from '../../utils/drawing-tool'

export default class ClusteringCanvas extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    this.drawFrame();
    this.renderData(this.props.clustering_list);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps.clustering_list);
  }

  // convert [-1, 1] -> [0, 1]
  colorScale(x) {
    return 0.5 + (x / 2);
  }

  renderData(clustering_list) {
    if(clustering_list.length == 0) {
      return;
    }

    for(let i = 0; i < clustering_list.length; i++) {
      const area_number = clustering_list[i];
      // const color = 1 / (area_number + 1);
      const color = area_number / 10;
      const saturation = 0.8;
      const lightness = 0.5;
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
      </div>
    );
  }
}
