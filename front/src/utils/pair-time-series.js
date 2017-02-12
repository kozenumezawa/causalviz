export const error = -2;

export function getCorrelation(x, y) {
  if(x.length > y.length) {
    x = x.slice(0, y.length);
  } else if(x.length < y.length) {
    y = y.slice(0, x.length);
  }

  const x_mean = getMean(x);
  const y_mean = getMean(y);

  // if all data are 0, return 0
  if(x_mean == 0 && y_mean == 0) {
    return error;
  }

  let xx = 0, yy = 0, xy = 0;

  for(let i = 0; i < x.length; i++) {
    xx += Math.pow((x[i] - x_mean), 2);
    yy += Math.pow((y[i] - y_mean), 2);
    xy += (x[i] - x_mean) * (y[i] - y_mean);
  }
  xx = Math.sqrt(xx);
  yy = Math.sqrt(yy);

  if((xx * yy) == 0) {
    return error;
  }
  const correlation = xy / (xx * yy);
  return correlation;
}

function getMean(x) {
  let mean = 0;
  for(let i = 0; i < x.length; i++) {
    mean += x[i];
  }
  mean /= x.length;
  return mean;
}
