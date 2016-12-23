import React from 'react'

import * as drawingTool from '../../utils/drawing-tool'

export default class highlightCanvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id + '_highlight');
    this.ctx = this.canvas.getContext('2d');

    this.renderData(this.props.highlight_time_series);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps.highlight_time_series);
  }

  renderData(time_series) {
    if(time_series === undefined) {
      return;
    }

    //  draw a highlighted line
    const line_opts = {
      color: this.props.line_color,
      width: this.props.line_width
    };
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    drawingTool.lineGraph(this.canvas, time_series, line_opts)
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id + '_highlight'} width="420" height="150" style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
      </div>
    );
  }
}
