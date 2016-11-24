import React from 'react'

export default class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.already_drawn = false;
  }

  createTimeSeriesFromTiff() {
    let green_time_series_inverse = [];
    this.props.tiff_list.forEach((element, idx) => {
      const canvas = this.props.tiff_list[idx];
      const context = canvas.getContext('2d');
      const image_data = context.getImageData(0, 0, canvas.width, canvas.height);
      const image_rgba = image_data.data; // image_rgba = [R, G, B, A, R, G, B, A, ...] (hex data)

      green_time_series_inverse.push(this.getGreenFromRGBA(image_rgba));
      // console.log(green_time_series_inverse) -> [time][points]
    });

    // transpose time series data
    let green_time_series = [];
    for(let i = 0; i < green_time_series_inverse[0].length; i++) {
      green_time_series[i] = [];
      for(let j = 0; j < green_time_series_inverse.length; j++) {
        green_time_series[i][j] = green_time_series_inverse[j][i];
      }
    }
    // console.log(green_time_series) -> [points][time]
    return green_time_series;
  }

  getGreenFromRGBA(rgba_data) {
    let green_list = [];
    for(let i = 1; i < rgba_data.length; i += 4) {
      green_list.push(rgba_data[i]);
    }
    return green_list;
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
    const green_time_series = this.createTimeSeriesFromTiff();

    const target_canvas = document.getElementById('time_series_graph_canvas');
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
      <div id="time_series_graph">
        <canvas id="time_series_graph_canvas" width="420" height="200"></canvas>
        {(() => {
          if(this.props.tiff_list.length != 0 && this.already_drawn == false) {
            this.renderData();
          }
        })()}
      </div>
    );
  }
}
