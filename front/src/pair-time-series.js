export default class pairTimeSeries {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getCorrelation() {
    const x_mean = this.getMean(this.x);
    const y_mean = this.getMean(this.y);
    let xx = 0, yy = 0, xy = 0;

    for(let i = 0; i < this.x.length; i++) {
      xx += Math.pow((this.x[i] - x_mean), 2);
      yy += Math.pow((this.y[i] - y_mean), 2);
      xy += (this.x[i] - x_mean) * (this.y[i] - y_mean);
    }
    xx = Math.sqrt(xx);
    yy = Math.sqrt(yy);

    if((xx * yy) == 0) {
      return 1;
    }
    const correlation = xy / (xx * yy);
    return correlation;
  }

  getMean(x) {
    let mean = 0;
    for(let i = 0; i < x.length; i++) {
      mean += x[i];
    }
    mean /= x.length;
    return mean;
  }
}