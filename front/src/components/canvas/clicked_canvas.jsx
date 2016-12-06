import React from 'react'

import Action from '../../actions/Actions'

export default class ClickedCanvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const overlapped_canvas = document.getElementById(this.props.id + 'overlapped');
    overlapped_canvas.addEventListener('click', this.onClickCanvas, false);
  }

  onClickCanvas(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    Action.handleTiffClick(x, y);
  }
  
  render() {
    return (
      <div>
        <canvas id={this.props.id+'overlapped'} width="280" height="200" style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
      </div>
    );
  }
}

