import React from 'react';

import * as drawingTool from '../../utils/drawing-tool';
import Action from '../../actions/Actions';

export default class CausalCanvas extends React.Component {
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
    const causal_data = props.causal_data;
    if (causal_data.length === 0) {
      return;
    }


    const selected_frame = 120;
    for (let i = 0; i < causal_data.length; i++) {
      if (causal_data[i].n_frame !== selected_frame) {
        continue;
      }
      const vectors = causal_data[i].vectors;

      this.ctx.fillStyle = 'red';
      this.ctx.beginPath();
      vectors.forEach((vector) => {
        const center_x = vector.center_pixel % this.canvas.width;
        const center_y = Math.floor(vector.center_pixel / this.canvas.width);

        const causal_x = vector.causal_pixel % this.canvas.width;
        const causal_y = Math.floor(vector.causal_pixel / this.canvas.width);

          this.arrow(center_x, center_y, causal_x, causal_y, [0, 1, -6, 1, -6, 3])
      });
      this.ctx.fill();
    }
  }

  render() {
    return (
      <canvas id={this.props.id+'vector'} width={this.props.canvas_width} height={this.props.canvas_height}  style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
    );
  }
}


