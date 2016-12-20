import React from 'react'

import ClickedCanvas from './clicked_canvas.jsx'
import EventCanvas from './event_canvas.jsx'

export default class RelationCanvas extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    this.drawFrame();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.relation_list.length == 0) {
      return;
    }

    // draw a base image
    this.renderData(nextProps.relation_list);

    // magnify the area which is surrounded by a loupe
    if(nextProps.loupe_point.on == true && nextProps.loupe_point.x != -1) {
      const loupe_point = nextProps.loupe_point;
      const magnify_length = loupe_point.side * 2;
      const magnify_x = loupe_point.x - loupe_point.side;
      const magnify_y = loupe_point.y - loupe_point.side;

      const clipped_length = loupe_point.side;
      const clipped_x = loupe_point.x - clipped_length / 2;
      const clipped_y = loupe_point.y - clipped_length / 2;

      this.ctx.drawImage(this.canvas, clipped_x, clipped_y, clipped_length, clipped_length
        , magnify_x, magnify_y, magnify_length, magnify_length);
    }
  }

  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   *
   * @param   {number}  h       The hue
   * @param   {number}  s       The saturation
   * @param   {number}  l       The lightness
   * @return  {Array}           The RGB representation
   */
  hslToRgb(h, s, l) {
    let r, g, b;

    if(s == 0){
      r = g = b = l; // achromatic
    }else{
      const hue2rgb = function hue2rgb(p, q, t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // convert [-1, 1] -> [0, 1]
  colorScale(x) {
    return 0.5 + (x / 2);
  }

  renderData(relation_list) {
    for(let i = 0; i < relation_list.length; i++) {
      const correlation = relation_list[i];
      const error = -2;     // this value is needed to equal to pair-time-series.js's error
      const lightness = (correlation == error) ? 0 : 0.5;
      const color = this.colorScale(correlation);
      const saturation = 0.8;

      const rgb = this.hslToRgb(2 / 3 * (1 - color), saturation, lightness);
      this.ctx.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      this.ctx.fillRect(i % this.canvas.width, i / this.canvas.width, 1, 1);
    }
  }

  drawFrame() {
    // draw a frame
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.canvas.width, 0);
    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.lineTo(0, 0);
    this.ctx.stroke();
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
