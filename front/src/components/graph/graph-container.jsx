import React from 'react'

import HighlightCanvas from './highlight-canvas.jsx'
import IndicatorCanvas from './indicator-canvas.jsx'

export default class graphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.already_drawn = false;
  }

  lineGraph(canvas_obj, time_series_data, line_opts) {
    const context = canvas_obj.getContext('2d');

    context.strokeStyle = line_opts.color;
    context.lineWidth = line_opts.width;
    context.beginPath();
    const dataWH = {
      w: canvas_obj.width / time_series_data.length,
      h: canvas_obj.height
    };

    // draw lines
    let pos1 = {
      x: 0,
      y: dataWH.h - time_series_data[0] / 1.7    // 1.7 is temporal number to ajust height
    };
    let pos2 = pos1;
    for (let i = 1; i < time_series_data.length; i++){
      context.moveTo(pos1.x, pos1.y);
      pos2.x += dataWH.w;
      pos2.y = dataWH.h - time_series_data[i] / 1.7;    // 1.7 is temporal number to ajust height
      context.lineTo(pos2.x, pos2.y);
      pos1 = pos2;
    }
    context.stroke();
  }

  renderData() {
    const time_series = this.props.time_series;
    const target_canvas = document.getElementById(this.props.id);

    const line_opts = {
      color: this.props.line_color,
      width: 0.1
    };
    time_series.forEach((element, idx) => {
      this.lineGraph(target_canvas, element, line_opts);
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
        
        {(() => {
          if(this.props.tiff_list.length !== 0 && this.already_drawn == false) {
            this.renderData();
          }
        })()}
      </div>
    );
  }
}
