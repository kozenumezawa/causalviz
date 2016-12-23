import React from 'react'

import * as drawingTool from '../../utils/drawing-tool'

export default class highlightCanvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id + '_highlight');
    this.ctx = this.canvas.getContext('2d');
  }

  componentWillReceiveProps(nextProps) {
    //  draw a highlighted line
    if(this.props.highlighted_line !== nextProps.highlighted_line) {
      const time_series = nextProps.time_series;
      const line_opts = {
        color: 'black',
        width: 2
      };
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      drawingTool.lineGraph(this.canvas, time_series[nextProps.highlighted_line], line_opts)
    }
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id + '_highlight'} width="420" height="150" style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
      </div>
    );
  }
}
