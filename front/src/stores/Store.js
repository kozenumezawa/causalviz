import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher/Dispatcher';
import eventConstants from '../constants/event-constants';
import generalConstants from '../constants/general-constants';
import * as pairTimeSeries from '../utils/pair-time-series';

const CHANGE_EVENT = 'change';

let canvas_width = 285;
let canvas_height = 130;

let data_type = generalConstants.DATA_WILD_TYPE;
let render_contents = generalConstants.VIEW_CROSS_CORRELATION;

let all_tiff_list = [];
let all_time_series = [];
let cluster_time_series = [];
let corr_time_series = [];
let tiff_index = 0;       // indicate the tiff file which should be displayed
let legend_tiff = null;
let relation_list = [];
let highlighted_line = -1;
let clicked_point = {
  x : -1,
  y : -1
};
let loupe_point = {
  x : -1,
  y : -1,
  on : false,
  side : 40
};
let cluster_list = [];
let checked_cluster = [];
let slider_value = 10;
let tau_list = [];
let correlation_list = [];
let criteria_time_series = [];
let traceflow_list = [];

let maximum_list = [];
let maxvalue_list = [];   // not to become state variable
let cut_time_series = []; // to calculate cross correlation

class Store extends EventEmitter {
  constructor() {
    super();
    this.setWidthAndHeight(data_type);
    this.getTiffData('front/dist/GFBratio-mask-64-255.tif', 'front/dist/2E2_GFB.tif');
    Dispatcher.register(this.handler.bind(this));
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  setInitialState() {
    clicked_point = {
      x : -1,
      y : -1
    };
    highlighted_line = -1;
    traceflow_list = [];
  }

  setWidthAndHeight(type) {
    switch(type) {
      case generalConstants.DATA_WILD_TYPE:
        canvas_width = 285;
        canvas_height = 130;
        break;
      case generalConstants.DATA_TRP_TYPE:
        canvas_height = 128;
        canvas_height = 96;
        break;
      default:
        break;
    }
  }

  handler(action) {
    switch (action.actionType) {
      case eventConstants.HANDLE_DROP_CHANGE:
        data_type = action.data_type;
        this.setWidthAndHeight(data_type);
        break;
      case eventConstants.HANDLE_DEFAULT_CLICK:
        this.setInitialState();
        render_contents = generalConstants.VIEW_DEFAULT;
        break;
      case eventConstants.HANDLE_KMEANS_CLICK:
        this.setInitialState();
        slider_value = 6;
        this.updateClusterList(slider_value);
        render_contents = generalConstants.VIEW_KMEANS;
        break;
      case eventConstants.HANDLE_MAXIMUM_CLICK:
        this.setInitialState();
        render_contents = generalConstants.VIEW_MAXIMUM;
        break;
      case eventConstants.HANDLE_CROSS_CORRELATION:
        this.setInitialState();
        slider_value = 10;
        this.updateCorrelationList(slider_value);
        render_contents = generalConstants.VIEW_CROSS_CORRELATION;
        break;
      case eventConstants.HANDLE_TRACE_FLOW:
        this.setInitialState();
        render_contents = generalConstants.VIEW_TRACE_FLOW;
        break;
      case eventConstants.HANDLE_BEFORE_CLICK:
        tiff_index--;
        if (tiff_index < 0) {
          tiff_index = all_tiff_list.length - 1;
        }
        break;
      case eventConstants.HANDLE_NEXT_CLICK:
        tiff_index++;
        if (tiff_index === all_tiff_list.length) {
          tiff_index = 0;
        }
        break;
      case eventConstants.HANDLE_CORRELATION_CLICK:
        break;
      case eventConstants.HANDLE_TIFF_CLICK:
        highlighted_line = Math.floor(action.y) * canvas_width + Math.floor(action.x);
        clicked_point.x = action.x;
        clicked_point.y = action.y;

        if (cluster_list.length !== 0) {
          let selected_cluster;
          if (render_contents === generalConstants.VIEW_KMEANS) {
            selected_cluster = cluster_list[highlighted_line];
          } else if (render_contents === generalConstants.VIEW_CROSS_CORRELATION) {
            selected_cluster = correlation_list[highlighted_line];
          }
          checked_cluster[selected_cluster] = !checked_cluster[selected_cluster];
        }
        this.updateRelationList();

        if (render_contents === generalConstants.VIEW_TRACE_FLOW) {
          this.updateTraceflowList(highlighted_line);
        }
        break;
      case eventConstants.HANDLE_LOUPE_CLICK:
        loupe_point.on = !loupe_point.on;
        if (loupe_point.on === false) {
          loupe_point.x = -1;
          loupe_point.y = -1;
        }
        break;
      case eventConstants.HANDLE_LOUPE_MOVE:
        loupe_point.x = action.x;
        loupe_point.y = action.y;
        break;
      case eventConstants.HANDLE_INDICATOR_MOVE:
        tiff_index = action.new_index;
        break;
      case eventConstants.HANDLE_CLEAR_SELECTION:
        this.setInitialState();
        break;
      case eventConstants.HANDLE_CHECK_CLICK:
        checked_cluster[action.index] = !checked_cluster[action.index];
        break;
      case eventConstants.HANDLE_CLUSTER_CHANGE:
        slider_value = action.n_clusters;
        if (render_contents === generalConstants.VIEW_KMEANS) {
          this.updateClusterList(slider_value);
        } else if (render_contents === generalConstants.VIEW_CROSS_CORRELATION) {
          this.updateCorrelationList(slider_value);
        }
        break;
      case eventConstants.HANDLE_LINEHEIGHTS_CHANGE:
        this.updateMaximumList(action.line_heights);
        break;
      default:
    }
    this.emitChange();
  }

  getDataType() {
    return data_type;
  }

  getCanvasWidth() {
    return canvas_width;
  }

  getCanvasHeight() {
    return canvas_height;
  }

  getAllTiffList() {
    return all_tiff_list;
  }

  getTiffIndex() {
    return tiff_index;
  }

  getLegendTiff() {
    return legend_tiff;
  }

  getAllTimeSeries() {
    return all_time_series;
  }

  getClusterTimeSeries() {
    return cluster_time_series;
  }

  getCorrTimeSeries() {
    return corr_time_series;
  }

  getRelationList() {
    return relation_list;
  }

  getHighlightedLine() {
    return highlighted_line;
  }

  getClickedPoint() {
    return clicked_point;
  }

  getLoupePoint() {
    return loupe_point;
  }

  getClusterList() {
    return cluster_list;
  }

  getRenderContents() {
    return render_contents;
  }

  getCheckedCluster() {
    return checked_cluster;
  }

  getSliderValue() {
    return slider_value;
  }

  getMaximumList() {
    return maximum_list;
  }

  getTauList() {
    return tau_list;
  }

  getCorrelationList() {
    return correlation_list;
  }

  getCriteriaTimeSeries() {
    return criteria_time_series;
  }

  getCutTimeSeries() {
    return cut_time_series;
  }
  
  getTraceflowList() {
    return traceflow_list;
  }
  
  getCutTiffList() {
    let cut_tiff_list = [];
    for (let i = 0, len = all_tiff_list.length - 15; i < len; i++) {
      cut_tiff_list[i] = all_tiff_list[i + 15];
    }
    return cut_tiff_list;
  }

  getTiffData(tiff_name, legend_name) {
    window.fetch(tiff_name)
      .then((response) => {
        response.arrayBuffer().then((buffer) => {
          let tiff_list = [];
          const tiff = new Tiff({ buffer: buffer });
          for (let i = 0, len = tiff.countDirectory() - 50; i < len; i++) {
            tiff.setDirectory(i);
            const canvas = tiff.toCanvas();
            tiff_list.push(canvas);
          }
          all_tiff_list = tiff_list;

          window.fetch(legend_name)
            .then((response) => {
              response.arrayBuffer().then((buffer) => {
                const tiff = new Tiff({ buffer: buffer });
                for (let i = 0, len = tiff.countDirectory(); i < len; i++) {
                  tiff.setDirectory(i);
                  const canvas = tiff.toCanvas();
                  legend_tiff = canvas;
                }
                all_time_series = this.createAllTimeSeriesFromTiff();
                this.emitChange();

                this.updateClusterList(6);

                // calculate maximum values
                for (let i = 0, len = all_time_series.length; i < len; i++) {
                  maxvalue_list[i] = Math.max.apply(null, all_time_series[i]);
                }
                this.updateMaximumList([0, 51, 102, 153, 204, 255]);
                this.emitChange();

                this.updateCorrelationList(10);
              });
            });
        });
      });
  }

  createTimeSeriesFromTiff(tiff_list) {
    let time_series_inverse = [];
    tiff_list.forEach((element, idx) => {
      const canvas = element;
      const context = canvas.getContext('2d');
      const image_data = context.getImageData(0, 0, canvas.width, canvas.height);
      const image_rgba = image_data.data; // image_rgba = [R, G, B, A, R, G, B, A, ...] (hex data)

      let one_time_series = [];
      for (let i = 1; i < image_rgba.length; i += 4) {
        one_time_series.push(50);
      }
      time_series_inverse.push(one_time_series);  // console.log(green_time_series_inverse) -> [time][points]
    });

    // transpose time series data
    let time_series = [];
    for (let i = 0; i < time_series_inverse[0].length; i++) {
      time_series[i] = [];
      for (let j = 0; j < time_series_inverse.length; j++) {
        time_series[i][j] = time_series_inverse[j][i];
      }
    }
    return time_series;
  }

  createAllTimeSeriesFromTiff() {
    const legend_canvas = legend_tiff;
    const legend_ctx = legend_canvas.getContext('2d');
    const legend_image = legend_ctx.getImageData(0, 0, legend_canvas.width, legend_canvas.height);
    const legend_rgba = legend_image.data; // image_rgba = [R, G, B, A, R, G, B, A, ...] (hex data)
    const color_map = legend_rgba.slice(0, legend_rgba.length / legend_canvas.height);

    // create time series data from each time step data
    let all_time_series_inverse = [];
    all_tiff_list.forEach((tiff_canvas, idx) => {
      let time_series_inverse = [];
      const tiff_ctx = tiff_canvas.getContext('2d');
      const tiff_image = tiff_ctx.getImageData(0, 0, tiff_canvas.width, tiff_canvas.height);
      const tiff_rgba = tiff_image.data; // image_rgba = [R, G, B, A, R, G, B, A, ...] (hex data)

      // get scalar from data
      for (let i = 0; i < tiff_rgba.length / 4; i++) {
        let scalar = 0;
        for (let j = 0; j < color_map.length / 4; j++) {
          const r = tiff_rgba[i * 4 + 0];
          const g = tiff_rgba[i * 4 + 1];
          const b = tiff_rgba[i * 4 + 2];
          const a = tiff_rgba[i * 4 + 3];
          if (r === color_map[j * 4 + 0] && g === color_map[j * 4 + 1] && b === color_map[j * 4 + 2] && a === color_map[j * 4 + 3]) {
            scalar = j;
            break;
          }
        }
        time_series_inverse.push(scalar);
      }
      all_time_series_inverse.push(time_series_inverse);
    });

    // transpose time series data
    let time_series = [];
    for (let i = 0; i < all_time_series_inverse[0].length; i++) {
      time_series[i] = [];
      for (let j = 0; j < all_time_series_inverse.length; j++) {
        time_series[i][j] = all_time_series_inverse[j][i];
      }
    }
    // this.createCsvFromTimeSeries(time_series);
    return time_series;
  }

  updateRelationList() {
    relation_list = [];
    const time_series = all_time_series;
    const x = time_series[highlighted_line];
    time_series.forEach((y, idx) => {
      relation_list.push(pairTimeSeries.getCorrelation(x, y));
    });
  }

  updateCheckedCluster(list) {
    checked_cluster = new Array(Math.max.apply(null, list) + 1);
    checked_cluster.fill(false);
  }

  updateClusterList(n_clusters) {
    const file_name = 'front/dist/cluster/k_means_' + n_clusters + '.json'
    window.fetch(file_name)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const labels = json.labels;
        cluster_list = labels;
        cluster_time_series = json.average;

        if (render_contents === generalConstants.VIEW_KMEANS) {
          this.updateCheckedCluster(cluster_list);
        }
        this.emitChange();
      });
  }

  updateMaximumList(line_heights) {
    maxvalue_list.forEach((max, idx) => {
      for (let i = 0, len = line_heights.length; i < len; i++) {
        const scalar = 255 - line_heights[i];
        if (max > scalar) {
          maximum_list[idx] = i;
          break;
        }
      }
    });
  }

  updateCorrelationList(n_clusters) {
    const len_time = all_time_series[0].length - 15;

    criteria_time_series = new Array(len_time);
    criteria_time_series.fill(0);
    let sum_count = 0;

    // create cut_time_series and criteria_time_series
    for (let i = 0, len_area = all_time_series.length; i < len_area; i++) {
      cut_time_series[i] = [];
      // cut first 15 time steps because they are meaningless
      for (let j = 0; j < len_time; j++) {
        cut_time_series[i][j] = all_time_series[i][j + 15];
      }

      // add right hand area data to criteria_time_series
      if (i % canvas_width < 250 || cut_time_series[i].indexOf(0) >= 0)
        continue;

      sum_count += 1;
      cut_time_series[i].forEach((scalar, idx) => {
        criteria_time_series[idx] += scalar;
      });
    }

    criteria_time_series = criteria_time_series.map((element) => {
      return element / sum_count;
    });

    // calculate tau which maximizes cross correlation
    tau_list = [];
    correlation_list = [];
    cut_time_series.forEach((time_series, idx) => {
      const corr_data = this.getTauMaximizingCorr(criteria_time_series, time_series, n_clusters);
      tau_list.push(corr_data.tau);
      correlation_list.push(corr_data.corr);
    });

    corr_time_series = this.getAverageEachTau(n_clusters);

    if (render_contents === generalConstants.VIEW_CROSS_CORRELATION) {
      this.updateCheckedCluster(tau_list);
    }
    this.emitChange();
  }

  getTauMaximizingCorr(criteria_x, y, n_clusters) {
    let corr_list = [];
    for (let i = 0; i < n_clusters; i++) {
      corr_list.push(pairTimeSeries.getCorrelation(criteria_x, y.slice(i)));
    }
    const max_corr = Math.max.apply(null, corr_list);
    if (max_corr === pairTimeSeries.error) {
      const corr_data = {
        tau: pairTimeSeries.error,
        corr: 0
      };
      return corr_data;
    }

    const corr_data = {
      tau: corr_list.indexOf(max_corr),
      corr: max_corr
    };
    return corr_data;
  }

  getAverageEachTau(n_clusters) {
    // initialize
    let average_time_series = [];
    let tau_frequency = new Array(n_clusters); // count the number of elements in each tau
    tau_frequency.fill(0);

    for (let i = 0; i < n_clusters; i++) {
      average_time_series[i] = new Array(criteria_time_series.length);
      average_time_series[i].fill(0);
    }

    // calculate clustering frequency and total value of each cluster
    cut_time_series.forEach((time_series, idx) => {
      const cluster_number = tau_list[idx];
      if (cluster_number === pairTimeSeries.error)
        return;

      tau_frequency[cluster_number] += 1;
      time_series.forEach((scalar, j) => {
        average_time_series[cluster_number][j] += scalar;
      });
    });

    // calculate average
    for (let i = 0; i < average_time_series.length; i++) {
      average_time_series[i] = average_time_series[i].map((element) => {
        return element / tau_frequency[i];
      });
    }
    return average_time_series;
  }

  getIndexMaximizingCorr(index, flow_list) {
    const x = all_time_series[index];
    // const x = cut_time_series[index];
    let corr_list = [];
    let idx_list = [];

    for (let i = -1; i < 1; i++) {
      for (let j = -1; j < 2; j++) {
        if (i === 0 && j === 0) {
          continue;
        }

        const idx = index + i + j * canvas_width;
        if (idx < 0 || idx >= all_time_series.length || flow_list[idx] === true) {
          continue;
        }

        const y = all_time_series[idx];
        // const y = cut_time_series[idx];
        corr_list.push(pairTimeSeries.getCorrelation(x, y));
        idx_list.push(idx);
      }
    }
    if (corr_list.length === 0) {
      return generalConstants.ERR_REACH_EDGH;
    }

    const max_corr = Math.max.apply(null, corr_list);
    if (max_corr === pairTimeSeries.error) {
      return generalConstants.ERR_REACH_EDGH;
    }
    return idx_list[corr_list.indexOf(max_corr)];
  }

  updateTraceflowList(clicked_index) {
    traceflow_list = new Array(all_time_series.length);
    traceflow_list.fill(false);

    let target_index = clicked_index;
    for (let i = 0; i < 10000; i++) {
      const new_index = this.getIndexMaximizingCorr(target_index, traceflow_list);
      if (new_index === generalConstants.ERR_REACH_EDGH) {
        break;
      }

      traceflow_list[new_index] = true;
      target_index = new_index;
    }
    this.emitChange();
  }

  // create csv file for Python
  createCsvFromTimeSeries(time_series) {
    const tableToCsvString = function(table, index) {
      const N_DATA = table.length;
      let str = '';
      const imax = N_DATA / 15 * (index + 1);
      for (let i = N_DATA / 15 * index; i < imax; ++i) {
        let row = table[i];
        for (let j = 0, jmax = row.length - 1; j <= jmax; ++j) {
          str += String(row[j]);
          if (j !== jmax) {
            str += ',';
          }
        }
        str += '\n';
      }
      return str;
    };

    const createDataUriFromString = function(str) {
      return 'data:text/csv,' + encodeURIComponent(str);
    };

    const downloadDataUri = function(uri, filename) {
      let link = document.createElement('a');
      link.download = filename;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const downloadCsv = function(table) {
      for (let i = 0; i < 15; i++) {
        const filename = 'timeseries_' + String(i) + '.csv';
        const uri = createDataUriFromString(tableToCsvString(table, i));
        downloadDataUri(uri, filename);
      }
    };
    downloadCsv(time_series);
    // console.log(time_series.length); -> 37050
  }
}

const store = new Store();

export default store;
