import React from 'react'

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
      this.lineGraph(this.canvas, time_series[nextProps.highlighted_line], line_opts);
    }
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

  render() {
    return (
      <div>
        <canvas id={this.props.id + '_highlight'} width="420" height="150" style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
      </div>
    );
  }
}
