import React from 'react'

export default class relationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.already_drawn = false;
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

    ctx.scale(2, 2);
    for(let i = 0; i < this.props.relation_list.length; i++) {
      const color = this.colorScale(this.props.relation_list[i]);
      const rgb = this.hslToRgb(2 / 3 * (1 - color), 0.8, 0.5);
      ctx.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      ctx.fillRect(i % tiff_width, i / tiff_width, 1, 1);
    }
    // resize image
    const bias = this.props.canvas_scale;
    // ctx.drawImage(canvas, 0, 0, tiff_width, tiff_height, 0, 0, tiff_width * bias, tiff_height * bias);

    this.already_drawn = true;
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width="280" height="200"></canvas>
        {(()=>{
          if(this.props.relation_list.length != 0 && this.already_drawn == false) {
            return this.renderData();
          }
        })()}
      </div>
    );
  }
}