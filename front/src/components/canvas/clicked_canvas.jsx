import React from 'react'

import Action from '../../actions/Actions'

export default class ClickedCanvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.clicked_point.x !== -1) {
      // draw a point
      const overlapped_canvas = document.getElementById(this.props.id + 'clicked');
      const ctx = overlapped_canvas.getContext('2d');
      ctx.clearRect(0, 0, overlapped_canvas.width, overlapped_canvas.height);
      ctx.fillStyle='white';
      ctx.fillRect(nextProps.clicked_point.x, nextProps.clicked_point.y, 2, 2);
    }
  }
  
  render() {
    return (
      <div>
        <canvas id={this.props.id+'clicked'} width="280" height="200" style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
      </div>
    );
  }
}


