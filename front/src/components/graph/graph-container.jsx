import React from 'react'

import Action from '../../actions/Actions'

export default class graphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.mouse_down = false;
    this.already_drawn = false;

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
  }

  componentDidMount() {
    // draw a vertical line to the graph
    const target_canvas = document.getElementById(this.props.id + '_indicator');
    this.drawVerticalLine(0, 0, 0, target_canvas.height);

    target_canvas.addEventListener('mousedown', this.mouseDown)
    target_canvas.addEventListener('mousemove', this.mouseMove)
    target_canvas.addEventListener('mouseup', this.mouseUp)
    target_canvas.addEventListener('mouseout', this.mouseOut);
  }

  componentDidUpdate(prevProps) {
    //  draw a highlighted line
    if(prevProps.highlighted_line !== this.props.highlighted_line) {
      const target_canvas = document.getElementById(this.props.id + '_highlight');
      const ctx = target_canvas.getContext('2d');
      const time_series = this.props.time_series;
      const line_opts = {
        color: 'black',
        width: 2
      };
      ctx.clearRect(0, 0, target_canvas.width, target_canvas.height);
      this.lineGraph(target_canvas, time_series[this.props.highlighted_line], line_opts);
    }

    // draw an indicator to show a timestep
    if(prevProps.tiff_index !== this.props.tiff_index) {
      const target_canvas = document.getElementById(this.props.id + '_indicator');
      const pos1 = {
        x: target_canvas.width / this.props.tiff_list.length * this.props.tiff_index,
        y: 0
      };
      this.drawVerticalLine(pos1.x, pos1.y, pos1.x, target_canvas.height);
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

  drawVerticalLine(x1, y1, x2, y2) {
    const target_canvas = document.getElementById(this.props.id + '_indicator');
    const ctx = target_canvas.getContext('2d');
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.clearRect(0, 0, target_canvas.width, target_canvas.height);
    // draw lines
    ctx.beginPath()
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  mouseDown(e) {
    this.updateIndexByMouse(e);
    this.mouse_down = true;
  }

  mouseMove(e) {
    if(this.mouse_down === false) {
      return;
    }
    this.updateIndexByMouse(e);
  }

  updateIndexByMouse(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const target_canvas = document.getElementById(this.props.id + '_indicator');
    const line_x = target_canvas.width / this.props.tiff_list.length * this.props.tiff_index;

    let new_index = Math.floor(x / target_canvas.width * this.props.tiff_list.length);
    new_index = (new_index > 0)? new_index : 0;
    new_index = (new_index < this.props.tiff_list.length)? new_index : this.props.tiff_list.length;
    Action.handleIndicatorMove(new_index);
  }

  mouseUp(e) {
    this.mouse_down = false;
  }

  mouseOut(e) {
    if(this.mouse_down === true) {
      this.mouse_down = false;
    }
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
        <canvas id={this.props.id + '_highlight'} width="420" height="150" style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
        <canvas id={this.props.id + '_indicator'} width="420" height="150" style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
        
        {(() => {
          if(this.props.tiff_list.length !== 0 && this.already_drawn == false) {
            this.renderData();
          }
        })()}
      </div>
    );
  }
}
