import React from 'react';

import OverlayCanvas from './overlay-canvas.jsx';
import * as drawingTool from '../../utils/drawing-tool';

export default class ControlPanel extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    this.renderData(this.props.tiff_list, this.props.tiff_index);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps.tiff_list, nextProps.tiff_index);

    drawingTool.drawLoupeArea(this.canvas, this.ctx, nextProps.loupe_point);
  }

  renderData(tiff_list, tiff_index) {
    if(tiff_list.length === 0) {
      return null
    }
    const canvas = tiff_list[tiff_index];
    const ctx = canvas.getContext('2d');
    const tiff_image = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const tiff_rgba = tiff_image.data; // image_rgba = [R, G, B, A, R, G, B, A, ...] (hex data)

    // make a palatte
    for(let i = 0; i < tiff_rgba.length / 4; i++) {
      const r = tiff_rgba[i * 4 + 0];
      const g = tiff_rgba[i * 4 + 1];
      const b = tiff_rgba[i * 4 + 2];
      if(r == 0 && g == 0 && b == 0) {
        this.ctx.fillStyle='black';
      } else {
        this.ctx.fillStyle='white';
      }
      this.ctx.fillRect(i % this.canvas.width, i / this.canvas.width, 1, 1);
    }

  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width="285" height="130" style={{left: 0, top: 0, zIndex: 0}}></canvas>
        <OverlayCanvas
          id={this.props.id}
          canvas_width={this.props.canvas_width}
          canvas_height={this.props.canvas_height}
          clicked_point={this.props.clicked_point}
          loupe_point={this.props.loupe_point}
        />
      </div>
    );
  }
}
