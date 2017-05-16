import React from 'react';

import * as drawingTool from '../../utils/drawing-tool';
import Action from '../../actions/Actions';

export default class VectorCanvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id + 'vector');
    this.ctx = this.canvas.getContext('2d');

    this.renderData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps);
  }

  // ref: http://qiita.com/frogcat/items/2f94b095b4c2d8581ff6
  arrow(startX, startY, endX, endY, controlPoints) {
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    const sin = dy / len;
    const cos = dx / len;
    let a = [];
    a.push(0, 0);
    for (let i = 0; i < controlPoints.length; i += 2) {
      const x = controlPoints[i];
      const y = controlPoints[i + 1];
      a.push(x < 0 ? len + x : x, y);
    }
    a.push(len, 0);
    for (let i = controlPoints.length; i > 0; i -= 2) {
      const x = controlPoints[i - 2];
      const y = controlPoints[i - 1];
      a.push(x < 0 ? len + x : x, -y);
    }
    a.push(0, 0);
    for (let i = 0; i < a.length; i += 2) {
      const x = a[i] * cos - a[i + 1] * sin + startX;
      const y = a[i] * sin + a[i + 1] * cos + startY;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
  };

  renderData(props) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (props.vector_fields.length === 0) {
      return;
    }

    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    const vector_field = props.vector_fields[props.tiff_index];
    vector_field.forEach((zone) => {
      const r = zone.u * zone.u + zone.v * zone.v;
      const rad = Math.atan2(zone.v, zone.u);
      const end_x = Math.floor(zone.x + 10 * r * Math.cos(rad));
      const end_y = Math.floor(zone.y + 10 * r * Math.sin(rad));

      this.arrow(zone.x, zone.y, end_x, end_y, [0, 1, -6, 1, -6, 3])
    });
    this.ctx.fill();


    // if (props.clicked_point.x !== -1) {
    //   // draw a point
    //   this.ctx.fillStyle = 'red';
    //   this.ctx.fillRect(props.clicked_point.x, props.clicked_point.y, 3, 3);
    //   drawingTool.drawLoupeArea(this.canvas, this.ctx, props.loupe_point);
    // }
    //
    //
    // if (props.selected_area.x != -1) {
    //   this.drawSelectedArea(props.selected_area.on, props.selected_area.rect_x, props.selected_area.rect_y, props.selected_area.x, props.selected_area.y);
    // }
  }

  render() {
    return (
      <canvas id={this.props.id+'vector'} width={this.props.canvas_width} height={this.props.canvas_height}  style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
    );
  }
}


