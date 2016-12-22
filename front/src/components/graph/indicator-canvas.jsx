import React from 'react'

import Action from '../../actions/Actions'

export default class indicatorCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.mouse_down = false;

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
  }

  componentDidMount() {
    // draw a vertical line to the graph
    this.canvas = document.getElementById(this.props.id + '_indicator');
    this.ctx = this.canvas.getContext('2d');

    this.drawVerticalLine(0, 0, 0, this.canvas.height);

    this.canvas.addEventListener('mousedown', this.mouseDown)
    this.canvas.addEventListener('mousemove', this.mouseMove)
    this.canvas.addEventListener('mouseup', this.mouseUp)
    this.canvas.addEventListener('mouseout', this.mouseOut);
  }

  componentWillReceiveProps(nextProps) {
    // draw an indicator to show a timestep
    if(this.props.tiff_index !== nextProps.tiff_index) {
      const pos1 = {
        x: this.canvas.width / nextProps.tiff_list.length * nextProps.tiff_index,
        y: 0
      };
      this.drawVerticalLine(pos1.x, pos1.y, pos1.x, this.canvas.height);
    }
  }

  drawVerticalLine(x1, y1, x2, y2) {
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // draw lines
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  mouseDown(e) {
    this.updateIndexByMouse(e);
    this.mouse_down = true;
  }

  mouseMove(e) {
    if(this.mouse_down === false) {
      return;
    }
    this.updateIndexByMouse(e);
  }

  updateIndexByMouse(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;

    let new_index = Math.floor(x / this.canvas.width * this.props.tiff_list.length);
    new_index = (new_index > 0)? new_index : 0;
    new_index = (new_index < this.props.tiff_list.length)? new_index : this.props.tiff_list.length;
    Action.handleIndicatorMove(new_index);
  }

  mouseUp(e) {
    this.mouse_down = false;
  }

  mouseOut(e) {
    if(this.mouse_down === true) {
      this.mouse_down = false;
    }
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id + '_indicator'} width="420" height="150" style={{position: 'absolute', display: 'block', top: 0, zIndex: 2}}></canvas>
      </div>
    );
  }
}
