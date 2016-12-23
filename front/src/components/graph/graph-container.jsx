import React from 'react'

import HighlightCanvas from './highlight-canvas.jsx'
import IndicatorCanvas from './indicator-canvas.jsx'
import * as drawingTool from '../../utils/drawing-tool'

export default class graphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.already_drawn = false;
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    this.renderData(this.props.time_series);
  }

  componentWillReceiveProps(nextProps) {
    if(this.already_drawn === true) {
      return;
    }
    if(this.props.time_series.toString() !== nextProps.time_series.toString()) {
      this.renderData(nextProps.time_series);
    }
  }

  renderData(time_series) {
    if(time_series.length === 0) {
      return;
    }

    const line_opts = {
      color: this.props.line_color,
      width: 0.1
    };
    time_series.forEach((element, idx) => {
      drawingTool.lineGraph(this.canvas, element, line_opts);
    });
    this.already_drawn = true;
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width="420" height="150" style={{left: 0, top: 0, zIndex: 0}}></canvas>
        <HighlightCanvas
          id={this.props.id}
          time_series={this.props.time_series}
          highlighted_line={this.props.highlighted_line}
        />
        <IndicatorCanvas
          id={this.props.id}
          tiff_list={this.props.tiff_list}
          tiff_index={this.props.tiff_index}
        />
      </div>
    );
  }
}
