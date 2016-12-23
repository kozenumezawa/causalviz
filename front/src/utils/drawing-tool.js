export function lineGraph(canvas_obj, time_series_data, line_opts) {
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
export function hslToRgb(h, s, l) {
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