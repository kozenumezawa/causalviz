import React from 'react';

import * as drawingTool from '../../utils/drawing-tool';
import Action from '../../actions/Actions';

export default class OverlayCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.mouse_down = false;
    this.rect_x = 0;
    this.rect_y = 0;

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id + 'overlay');
    this.ctx = this.canvas.getContext('2d');

    this.renderData(this.props);

    this.canvas.addEventListener('click', this.onClickCanvas, false);
    this.canvas.addEventListener('mousedown', this.onMouseDown, false);
    this.canvas.addEventListener('mouseup', this.onMouseUp, false);
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('mouseout', this.onMouseOut);
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
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(props.clicked_point.x, props.clicked_point.y, 3, 3);
      drawingTool.drawLoupeArea(this.canvas, this.ctx, props.loupe_point);
    }


    if (props.selected_area.x != -1) {
      this.drawSelectedArea(props.selected_area.on, props.selected_area.rect_x, props.selected_area.rect_y, props.selected_area.x, props.selected_area.y);
    }
  }

  onClickCanvas(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    Action.handleTiffClick(x, y);
  }

  onMouseDown(e) {
    this.mouse_down = true;
    const rect = e.target.getBoundingClientRect();
    this.rect_x = e.clientX - rect.left;
    this.rect_y = e.clientY - rect.top;
  }

  onMouseUp(e) {
    if (this.mouse_down === true) {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      Action.handleSelectArea(this.rect_x, this.rect_y, x, y);
      this.mouse_down = false;
    }
  }

  onMouseMove(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.mouse_down === true) {
      this.renderData(this.props);
      this.drawSelectedArea(this.props.selected_area.on, this.rect_x, this.rect_y, x, y);
    }

    if (this.props.loupe_point.on == true) {
      Action.handleLoupeMove(x, y);
    }
  }

  onMouseOut(e) {
    if (this.mouse_down === true) {
      this.mouse_down = false;
    }
  }

  drawSelectedArea(on, rect_x, rect_y, x, y) {
    if (on === true) {
      this.ctx.strokeStyle = 'yellow';
      this.ctx.beginPath();

      this.ctx.moveTo(rect_x, rect_y);
      this.ctx.lineTo(x, rect_y);

      this.ctx.moveTo(rect_x, y);
      this.ctx.lineTo(x, y);

      this.ctx.moveTo(x, rect_y);
      this.ctx.lineTo(x, y);

      this.ctx.moveTo(rect_x, rect_y);
      this.ctx.lineTo(rect_x, y);

      this.ctx.stroke();
    }
  }

  render() {
    return (
      <canvas id={this.props.id+'overlay'} width={this.props.canvas_width} height={this.props.canvas_height}  style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
    );
  }
}


