import React from 'react';

import * as drawingTool from '../../utils/drawing-tool';
import Action from '../../actions/Actions';

export default class OverlayCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.mouseMove = this.mouseMove.bind(this);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id + 'overlay');
    this.ctx = this.canvas.getContext('2d');

    this.renderData(this.props);

    this.canvas.addEventListener('click', this.onClickCanvas, false);
    this.canvas.addEventListener('mousemove', this.mouseMove)
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps);
    const loupe_point = nextProps.loupe_point;
    if (loupe_point.on == true && loupe_point.x != -1) {
      // draw a loupe
      // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(loupe_point.x - loupe_point.side, loupe_point.y - loupe_point.side, loupe_point.side * 2, loupe_point.side * 2)
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.renderData(nextProps);
    }
  }

  renderData(props) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (props.clicked_point.x !== -1) {
      // draw a point
      this.ctx.fillStyle='red';
      this.ctx.fillRect(props.clicked_point.x, props.clicked_point.y, 3, 3);
      drawingTool.drawLoupeArea(this.canvas, this.ctx, props.loupe_point);
      debugger;
    }
  }

  onClickCanvas(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    Action.handleTiffClick(x, y);
  }

  mouseMove(e) {
    if (this.props.loupe_point.on == true) {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      Action.handleLoupeMove(x, y);
    }
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id+'overlay'} width={this.props.canvas_width} height={this.props.canvas_height}  style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
      </div>
    );
  }
}


