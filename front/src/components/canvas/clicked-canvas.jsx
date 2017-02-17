import React from 'react'

import * as drawingTool from '../../utils/drawing-tool'

export default class ClickedCanvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id + 'clicked');
    this.ctx = this.canvas.getContext('2d');

    this.renderData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps);
  }

  renderData(props) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if(props.clicked_point.x !== -1) {
      // draw a point
      this.ctx.fillStyle='red';
      this.ctx.fillRect(props.clicked_point.x, props.clicked_point.y, 3, 3);
      drawingTool.drawLoupeArea(this.canvas, this.ctx, props.loupe_point);
    }
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id+'clicked'} width={this.props.canvas_width} height={this.props.canvas_height}  style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
      </div>
    );
  }
}


