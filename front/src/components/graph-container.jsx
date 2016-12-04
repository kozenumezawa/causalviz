import React from 'react'

export default class graphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.already_drawn = false;
  }

  componentDidUpdate(prevProps) {
    if(prevProps.highlighted_line !== this.props.highlighted_line) {
      //  draw a highlighted line
      const target_canvas = document.getElementById(this.props.id + '_highlight');
      const ctx = target_canvas.getContext('2d');
      const green_time_series = this.props.green_time_series;
      const line_opts = {
        color: 'orange',
        width: 3
      };
      ctx.clearRect(0, 0, target_canvas.width, target_canvas.height);
      this.lineGraph(target_canvas, green_time_series[this.props.highlighted_line], line_opts);
    }
  }

  lineGraph(canvas_obj, time_series_data, line_opts) {
    const context = canvas_obj.getContext('2d');

    context.strokeStyle = line_opts.color;
    context.lineWidth = line_opts.width;
    context.save();
    context.beginPath();
    const dataWH = {
      w: canvas_obj.width / time_series_data.length,
      h: canvas_obj.height
    };

    // draw lines
    let pos1 = {
      x: dataWH.w,
      y: dataWH.h - time_series_data[0] / 1.3    // 1.3 is temporal number
    };
    let pos2 = pos1;
    for (let i = 1; i < time_series_data.length; i++){
      context.moveTo(pos1.x, pos1.y);
      pos2.x += dataWH.w;
      pos2.y = dataWH.h - time_series_data[i] / 1.3;    // 1.3 is temporal number
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
        <canvas id={this.props.id} width="420" height="200" style={{left: 0, top: 0, zIndex: 0}}></canvas>
        <canvas id={this.props.id + '_highlight'} width="420" height="200" style={{position: 'absolute', top: 0, zIndex: 1}}></canvas>
        <div style={{display: 'inline'}}> 0 </div>
        <div style={{position: 'absolute', display: 'inline', left: 190}}> time step </div>
        <div style={{position: 'absolute', display: 'inline', left: 420}}> 99 </div>
        {(() => {
          if(this.props.tiff_list !== undefined && this.already_drawn == false) {
            this.renderData();
          }
        })()}
      </div>
    );
  }
}
