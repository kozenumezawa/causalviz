import React from 'react'

import ClickedCanvas from './canvas/clicked_canvas.jsx'

export default class relationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.already_drawn = false;
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.clicked_point.x !== -1) {
      // draw a point
      const overlapped_canvas = document.getElementById(this.props.id + 'overlapped');
      const ctx = overlapped_canvas.getContext('2d');
      ctx.clearRect(0, 0, overlapped_canvas.width, overlapped_canvas.height);
      ctx.fillStyle='white';
      ctx.fillRect(nextProps.clicked_point.x, nextProps.clicked_point.y, 2, 2);
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

  renderData() {
    const canvas = document.getElementById(this.props.id);
    const ctx = canvas.getContext('2d');
    const tiff_width = 140;
    const tiff_height = 100;

    const bias = this.props.canvas_scale;
    ctx.scale(bias, bias);
    for(let i = 0; i < this.props.relation_list.length; i++) {
      const correlation = this.props.relation_list[i];
      const error = -2;     // this value is needed to equal to pair-time-series.js's error
      const lightness = (correlation == error) ? 0 : 0.5;
      const color = this.colorScale(correlation);
      const saturation = 0.8;

      const rgb = this.hslToRgb(2 / 3 * (1 - color), saturation, lightness);
      ctx.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      ctx.fillRect(i % tiff_width, i / tiff_width, 1, 1);
    }

    this.already_drawn = true;
  }

  render() {
    return (
      <div style={{position:'relative'}}>
        <canvas id={this.props.id} width="280" height="200" style={{left: 0, top: 0, zIndex: 0}}></canvas>
        <ClickedCanvas
          id={this.props.id}
        />
        {(()=>{
          if(this.props.relation_list.length != 0 && this.already_drawn == false) {
            return this.renderData();
          }
        })()}
      </div>
    );
  }
}
