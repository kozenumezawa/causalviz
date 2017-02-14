import React from 'react'

import ClickedCanvas from './clicked_canvas.jsx'
import EventCanvas from './event_canvas.jsx'
import * as drawingTool from '../../utils/drawing-tool'

export default class TraceFlowCanvas extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    drawingTool.drawFrame(this.canvas, this.ctx);
    this.renderData(this.props.tiff_list, this.props.tiff_index, this.props.traceflow_list, this.props.loupe_point);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps.tiff_list, nextProps.tiff_index, nextProps.traceflow_list, nextProps.loupe_point);
  }

  renderData(tiff_list, tiff_index, traceflow_list, loupe_point) {
    if(tiff_list.length === 0) {
      return null
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const canvas = tiff_list[tiff_index];
    this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.canvas.width, this.canvas.height);

    if(traceflow_list.length != 0) {
      this.ctx.fillStyle='red';
      traceflow_list.forEach((trace_flag, idx) => {
        if (trace_flag === true) {
          this.ctx.fillRect(idx % this.canvas.width, idx / this.canvas.width, 1, 1);
        }
      });
    }
    drawingTool.drawLoupeArea(this.canvas, this.ctx, loupe_point);
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width="285" height="130" style={{left: 0, top: 0, zIndex: 0}}></canvas>
        <ClickedCanvas
          id={this.props.id}
          clicked_point={this.props.clicked_point}
          loupe_point={this.props.loupe_point}
        />
        <EventCanvas
          id={this.props.id}
          loupe_point={this.props.loupe_point}
        />
      </div>
    );
  }
}
