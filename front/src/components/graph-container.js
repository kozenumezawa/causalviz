import React from 'react'

export default class graphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.already_drawn = false;
  }
  
  lineGraph(canvas_obj, time_series_data, line_opts) {
    const context = canvas_obj.getContext('2d');
    let pos1 = {
      x: 0,
      y: canvas_obj.height
    };
    let pos2 = {
      x: 0,
      y: 0
    };
    const dataWH = {
      w: canvas_obj.width / time_series_data.length,
      h: canvas_obj.height
    };
    context.strokeStyle = line_opts.color;
    context.lineWidth = line_opts.width;
    context.save();
    context.beginPath();
    // draw lines
    for (let i = 0; i < time_series_data.length; i++){
      context.moveTo(pos1.x, pos1.y);
      pos2.x += dataWH.w;
      pos2.y = dataWH.h - time_series_data[i];
      context.lineTo(pos2.x, pos2.y);
      pos1 = pos2;
    }
    context.stroke();
    context.restore();
  }


  renderData() {
    const green_time_series = this.props.green_time_series;

    const target_canvas = document.getElementById(this.props.id);
    const line_opts = {
      color: 'green',
      width: 0.1
    };
    green_time_series.forEach((element, idx) => {
      this.lineGraph(target_canvas, element, line_opts);
    });
    this.already_drawn = true;
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width="420" height="200"></canvas>
        {(() => {
          if(this.props.tiff_list.length != 0 && this.already_drawn == false) {
            this.renderData();
          }
        })()}
      </div>
    );
  }
}
