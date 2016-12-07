import React from 'react'

import Action from '../../actions/Actions'

export default class EventCanvas extends React.Component{
  constructor(props) {
    super(props);
    this.mouseMove = this.mouseMove.bind(this);
    console.log(this.props);
  }

  componentDidMount() {
    const overlapped_canvas = document.getElementById(this.props.id + 'event');
    overlapped_canvas.addEventListener('click', this.onClickCanvas, false);
    overlapped_canvas.addEventListener('mousemove', this.mouseMove)
  }

  componentWillReceiveProps(nextProps) {
    const overlapped_canvas = document.getElementById(this.props.id + 'event');
    const ctx = overlapped_canvas.getContext('2d');

    if(nextProps.loupe_point.on == true && nextProps.loupe_point.x != -1) {
      console.log(nextProps.loupe_point.x);
      // draw a loupe
      ctx.clearRect(0, 0, overlapped_canvas.width, overlapped_canvas.height);
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.arc(nextProps.loupe_point.x, nextProps.loupe_point.y, 40, 0, Math.PI * 2, false);
      ctx.stroke();
    } else {
      ctx.clearRect(0, 0, overlapped_canvas.width, overlapped_canvas.height);
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