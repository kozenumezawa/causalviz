import React from 'react'

import Action from '../../actions/Actions'

export default class EventCanvas extends React.Component{
  constructor(props) {
    super(props);
    this.mouseMove = this.mouseMove.bind(this);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id + 'event');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.addEventListener('click', this.onClickCanvas, false);
    this.canvas.addEventListener('mousemove', this.mouseMove)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.loupe_point.on == true && nextProps.loupe_point.x != -1) {
      // draw a loupe
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeStyle = 'white';
      this.ctx.beginPath();
      this.ctx.arc(nextProps.loupe_point.x, nextProps.loupe_point.y, 40, 0, Math.PI * 2, false);
      this.ctx.stroke();
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  onClickCanvas(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    Action.handleTiffClick(x, y);
  }

  mouseMove(e) {
    if(this.props.loupe_point.on == true) {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      Action.handleLoupeMove(x, y);
    }
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id+'event'} width="280" height="200" style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
      </div>
    );
  }
}