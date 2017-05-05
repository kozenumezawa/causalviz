import React from 'react';

import * as drawingTool from '../../utils/drawing-tool';

export default class highlightCanvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id + '_highlight');
    this.ctx = this.canvas.getContext('2d');

    this.renderData(this.props.highlighted_lines, this.props.all_time_series);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps.highlighted_lines, nextProps.all_time_series);
  }

  renderData(highlighted_lines, all_time_series) {
    if (highlighted_lines == null || highlighted_lines.length === 0) {
      return;
    }

    //  draw a highlighted line
    const line_opts = {
      color: this.props.line_color,
      width: this.props.line_width
    };
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    highlighted_lines.forEach((highlighted_line) => {
      const time_series = all_time_series[highlighted_line];
      drawingTool.lineGraph(this.canvas, time_series, line_opts)
    });

  }

  render() {
    return (
      <div>
        <canvas id={this.props.id + '_highlight'} width="420" height="150" style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
      </div>
    );
  }
}
