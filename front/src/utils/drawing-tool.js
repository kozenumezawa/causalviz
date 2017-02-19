import * as d3_scale from 'd3-scale';

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

export function drawLoupeArea(canvas, ctx, loupe_point) {
  // magnify the area which is surrounded by a loupe
  if (loupe_point.on === true && loupe_point.x !== -1) {
    const magnify_length = loupe_point.side * 2;
    const magnify_x = loupe_point.x - loupe_point.side;
    const magnify_y = loupe_point.y - loupe_point.side;

    const clipped_length = loupe_point.side;
    const clipped_x = loupe_point.x - clipped_length / 2;
    const clipped_y = loupe_point.y - clipped_length / 2;

    ctx.drawImage(canvas, clipped_x, clipped_y, clipped_length, clipped_length
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
export function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0){
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = function hue2rgb(p, q, t){
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
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

export function getColorCategory(n) {
  const lightness = 0.5;
  const saturation = 0.8;

  let color_category = [];
  for (let i = 0; i < n; i++) {
    const hue = 1 / (n - 1) * i;
    const rgb = hslToRgb(2 / 3 * (1 - hue), saturation, lightness);

    let color_string = '#';
    rgb.forEach((color, idx) => {
      color_string += color.toString(16);
    });
    color_category.push(color_string);
  }

  color_category = d3_scale.schemeCategory20c;
  return color_category;
}

export function drawFrame(canvas, ctx) {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(canvas.width, 0);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.lineTo(0, 0);
  ctx.stroke();
}