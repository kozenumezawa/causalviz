import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher/Dispatcher';
import eventConstants from '../constants/event-constants';
import generalConst from '../constants/general-constants';
import * as pairTimeSeries from '../utils/pair-time-series';
import * as storeUtils from './store-utils'

const CHANGE_EVENT = 'change';

let canvas_width = 285;
let canvas_height = 130;

let data_type = generalConst.DATA_TRP_TYPE;
let filter_type = generalConst.FILTER_NONE;

let render_contents = generalConst.VIEW_THREE_DIM;

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
  constructor () {
    super();
    this.setWidthAndHeight(data_type);
    this.setTiffData();

    Dispatcher.register(this.handler.bind(this));
  }

  emitChange () {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback);
  }

  setInitialState () {
    clicked_point = {
      x: -1,
      y: -1
    };
    highlighted_line = -1;
    traceflow_list = [];
    tiff_index = 0;
  }

  setWidthAndHeight (type) {
    switch (type) {
      case generalConst.DATA_WILD_TYPE:
        canvas_width = 285;
        canvas_height = 130;
        break;
      case generalConst.DATA_TRP_TYPE:
        canvas_width = 128;
        canvas_height = 96;
        break;
      default:
        break;
    }
  }

  handler (action) {
    switch (action.actionType) {
      case eventConstants.HANDLE_DROP_CHANGE:
        if (action.data_type === data_type) {
          break;
        }
        this.setInitialState();
        data_type = action.data_type;
        this.setWidthAndHeight(data_type);
        this.setTiffData();
        break;
      case eventConstants.HANDLE_DEFAULT_CLICK:
        this.setInitialState();
        render_contents = generalConst.VIEW_DEFAULT;
        break;
      case eventConstants.HANDLE_KMEANS_CLICK:
        this.setInitialState();
        slider_value = 6;
        this.updateClusterList(slider_value);
        render_contents = generalConst.VIEW_KMEANS;
        break;
      case eventConstants.HANDLE_MAXIMUM_CLICK:
        this.setInitialState();
        render_contents = generalConst.VIEW_MAXIMUM;
        break;
      case eventConstants.HANDLE_CROSS_CORRELATION:
        this.setInitialState();
        slider_value = 10;
        this.updateCorrelationList(slider_value);
        render_contents = generalConst.VIEW_CROSS_CORRELATION;
        break;
      case eventConstants.HANDLE_TRACE_FLOW:
        this.setInitialState();
        render_contents = generalConst.VIEW_TRACE_FLOW;
        break;
      case eventConstants.HANDLE_THREE_DIM:
        this.setInitialState();
        render_contents = generalConst.VIEW_THREE_DIM;
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
      case eventConstants.HANDLE_FILTER_TYPE_CHANGE:
        if (action.filter_type === filter_type) {
          break;
        }
        filter_type = action.filter_type;
        this.setTiffData();
        break;
      case eventConstants.HANDLE_CORRELATION_CLICK:
        break;
      case eventConstants.HANDLE_TIFF_CLICK:
        highlighted_line = Math.floor(action.y) * canvas_width + Math.floor(action.x);
        clicked_point.x = action.x;
        clicked_point.y = action.y;

        if (cluster_list.length !== 0) {
          let selected_cluster;
          if (render_contents === generalConst.VIEW_KMEANS) {
            selected_cluster = cluster_list[highlighted_line];
          } else if (render_contents === generalConst.VIEW_CROSS_CORRELATION) {
            selected_cluster = correlation_list[highlighted_line];
          }
          checked_cluster[selected_cluster] = !checked_cluster[selected_cluster];
        }
        this.updateRelationList();

        if (render_contents === generalConst.VIEW_TRACE_FLOW) {
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
        if (render_contents === generalConst.VIEW_KMEANS) {
          this.updateClusterList(slider_value);
        } else if (render_contents === generalConst.VIEW_CROSS_CORRELATION) {
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

  getDataType () {
    return data_type;
  }

  getFilterType () {
    return filter_type;
  }

  getCanvasWidth () {
    return canvas_width;
  }

  getCanvasHeight () {
    return canvas_height;
  }

  getAllTiffList () {
    return all_tiff_list;
  }

  getTiffIndex () {
    return tiff_index;
  }

  getLegendTiff () {
    return legend_tiff;
  }

  getAllTimeSeries () {
    return all_time_series;
  }

  getClusterTimeSeries () {
    return cluster_time_series;
  }

  getCorrTimeSeries () {
    return corr_time_series;
  }

  getRelationList () {
    return relation_list;
  }

  getHighlightedLine () {
    return highlighted_line;
  }

  getClickedPoint () {
    return clicked_point;
  }

  getLoupePoint () {
    return loupe_point;
  }

  getClusterList () {
    return cluster_list;
  }

  getRenderContents () {
    return render_contents;
  }

  getCheckedCluster () {
    return checked_cluster;
  }

  getSliderValue () {
    return slider_value;
  }

  getMaximumList () {
    return maximum_list;
  }

  getTauList () {
    return tau_list;
  }

  getCorrelationList () {
    return correlation_list;
  }

  getCriteriaTimeSeries () {
    return criteria_time_series;
  }

  getCutTimeSeries () {
    return cut_time_series;
  }

  getTraceflowList () {
    return traceflow_list;
  }

  getCutTiffList () {
    let cut_tiff_list = [];
    for (let i = 0, len = all_tiff_list.length - 15; i < len; i++) {
      cut_tiff_list[i] = all_tiff_list[i + 15];
    }
    return cut_tiff_list;
  }

  setTiffData () {
    Tiff.initialize({TOTAL_MEMORY: 16777216 * 10});
    let tiff_name, legend_name;
    switch (data_type) {
      case generalConst.DATA_WILD_TYPE:
        if (filter_type === generalConst.FILTER_NONE) {
          tiff_name = 'GFBratio-mask-64-255.tif';
        } else if (filter_type === generalConst.FILTER_MEAN) {
          tiff_name = 'GFBratio-mask-64-255_mean.tif';
        }
        legend_name = '2E2_GFB.tif';
        break;
      case generalConst.DATA_TRP_TYPE:
        if (filter_type === generalConst.FILTER_NONE) {
          tiff_name = 'trp-3-masked8b.tif';
        } else if (filter_type === generalConst.FILTER_MEAN) {
          tiff_name = 'trp-3-masked8b_mean.tif';
        }
        legend_name = '2E2_GFB.tif';
        break;
      default:
        break;
    }
    window.fetch(tiff_name)
      .then((response) => {
        response.arrayBuffer().then((buffer) => {
          let tiff_list = [];
          const tiff = new Tiff({ buffer: buffer });
          const tiff_len = (data_type === generalConst.DATA_WILD_TYPE) ? tiff.countDirectory() - 50 : tiff.countDirectory();
          for (let i = 0; i < tiff_len; i++) {
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

                this.updateTimeSeriesAndCluster();
              });
            });
        });
      });
  }

  updateTimeSeriesAndCluster() {
    if (data_type === generalConst.DATA_TRP_TYPE) {
      all_tiff_list = this.assignColorToTiffList(all_tiff_list, legend_tiff);
    } else {
      all_time_series = this.createAllTimeSeriesFromTiff(legend_tiff);
    }

    this.updateClusterList(6);

    // calculate maximum values
    for (let i = 0, len = all_time_series.length; i < len; i++) {
      maxvalue_list[i] = Math.max.apply(null, all_time_series[i]);
    }
    this.updateMaximumList([0, 51, 102, 153, 204, 255]);
    this.updateCorrelationList(slider_value);
  }

  assignColorToTiffList (all_tiff_gray, legend_canvas) {
    const criteria_scalar_list = storeUtils.getScalarFromGrayCanvas(all_tiff_gray[10]);

    let n_zero = 1; // because the upper left corner is 0
    const scalar_sum = criteria_scalar_list.reduce((prev, current) => {
      if (current === 0) {
        n_zero++;
      }
      return prev + current;
    });
    const criteria_scalar = scalar_sum / (criteria_scalar_list.length - n_zero);
    const legend_rgba = storeUtils.getRGBAFromTiff(legend_canvas);
    const color_map = legend_rgba.slice(0, legend_rgba.length / legend_canvas.height);
    let all_tiff_color = [];

    let all_time_series_inverse = [];
    all_tiff_gray.forEach((tiff_canvas) => {
      let time_series_inverse = [];
      const scalar_list = storeUtils.getScalarFromGrayCanvas(tiff_canvas);
      let color_canvas = tiff_canvas;
      const ctx = color_canvas.getContext('2d');
      ctx.clearRect(0, 0, color_canvas.width, color_canvas.height);

      scalar_list.forEach((scalar, idx) => {
        if (scalar === 0) {
          ctx.fillStyle = 'black';
          time_series_inverse.push(0);
        } else {
          const ratio = scalar / criteria_scalar;
          const color_idx = Math.floor((color_map.length / 4) * (ratio - 0.5) / (2 - 0.5)); // assign color : 0.5 to 2 -> -50% to 100%(256bit)
          if (color_idx < 0) {
            ctx.fillStyle = 'black';
            time_series_inverse.push(0);
          } else {
            const rgba = [color_map[color_idx * 4], color_map[color_idx * 4 + 1], color_map[color_idx * 4 + 2], color_map[color_idx * 4 + 3]];
            ctx.fillStyle = 'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')';
            time_series_inverse.push(color_idx);
          }
        }
        ctx.fillRect(idx % color_canvas.width, idx / color_canvas.width, 1, 1);
      });
      all_tiff_color.push(color_canvas);
      all_time_series_inverse.push(time_series_inverse);
    });

    all_time_series = storeUtils.transposeTimeSeries(all_time_series_inverse);
    return all_tiff_color;
  }

  createAllTimeSeriesFromTiff (legend_canvas) {
    // create time series data from each time step data
    let all_time_series_inverse = [];
    all_tiff_list.forEach((tiff_canvas) => {
      const time_series_inverse = storeUtils.createTimeSeriesInverse(tiff_canvas, legend_canvas);
      all_time_series_inverse.push(time_series_inverse);
    });

    // storeUtils.createCsvFromTimeSeries(this.transposeTimeSeries(all_time_series_inverse));
    return storeUtils.transposeTimeSeries(all_time_series_inverse);
  }

  updateRelationList () {
    relation_list = [];
    const time_series = all_time_series;
    const x = time_series[highlighted_line];
    time_series.forEach((y) => {
      relation_list.push(pairTimeSeries.getCorrelation(x, y));
    });
  }

  updateCheckedCluster (list) {
    checked_cluster = new Array(Math.max.apply(null, list) + 1);
    checked_cluster.fill(false);
  }

  updateClusterList (n_clusters) {
    const file_name = 'cluster/k_means_' + n_clusters + '.json'
    window.fetch(file_name)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const labels = json.labels;
        cluster_list = labels;
        cluster_time_series = json.average;

        if (render_contents === generalConst.VIEW_KMEANS) {
          this.updateCheckedCluster(cluster_list);
        }
        this.emitChange();
      });
  }

  updateMaximumList (line_heights) {
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

  updateCriteriaTimeSeries() {
    const len_time = (data_type === generalConst.DATA_WILD_TYPE) ?
                                          all_time_series[0].length - 15 : all_time_series[0].length;
    criteria_time_series = new Array(len_time);
    criteria_time_series.fill(0);
    let sum_count = 0;

    // create cut_time_series and criteria_time_series
    cut_time_series = [];
    for (let i = 0, len_area = all_time_series.length; i < len_area; i++) {
      cut_time_series[i] = [];

      for (let j = 0; j < len_time; j++) {
        if (data_type === generalConst.DATA_WILD_TYPE) {
          // cut first 15 time steps because they are meaningless
          cut_time_series[i][j] = all_time_series[i][j + 15];
        } else if (data_type === generalConst.DATA_TRP_TYPE) {
          cut_time_series[i][j] = all_time_series[i][j];
        }
      }

      // add right hand area data to criteria_time_series if data type is wild type
      if (data_type === generalConst.DATA_WILD_TYPE && (i % canvas_width < 250 || cut_time_series[i].indexOf(0) >= 0))
        continue;

      // add right hand area data to criteria_time_series if data type is wild type
      if (data_type === generalConst.DATA_TRP_TYPE && (i % canvas_width > 65 || i / canvas_width > 89 || cut_time_series[i].indexOf(0) >= 0))
        continue;

      sum_count += 1;
      cut_time_series[i].forEach((scalar, idx) => {
        criteria_time_series[idx] += scalar;
      });
    }

    criteria_time_series = criteria_time_series.map((element) => {
      return element / sum_count;
    });
  }

  updateCorrelationList (n_clusters) {
    this.updateCriteriaTimeSeries();

    // calculate tau which maximizes cross correlation
    tau_list = [];
    correlation_list = [];
    cut_time_series.forEach((time_series, idx) => {
      const corr_data = this.getTauMaximizingCorr(criteria_time_series, time_series, n_clusters);
      tau_list.push(corr_data.tau);
      correlation_list.push(corr_data.corr);
    });

    corr_time_series = this.getAverageEachTau(n_clusters);
    if (render_contents === generalConst.VIEW_CROSS_CORRELATION) {
      this.updateCheckedCluster(tau_list);
    }
    this.emitChange();
  }

  getTauMaximizingCorr (criteria_x, y, n_clusters) {
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

  getAverageEachTau (n_clusters) {
    // initialize
    let average_time_series = [];
    let tau_frequency = new Array(n_clusters); // count the number of elements in each tau
    tau_frequency.fill(0);

    for (let i = 0; i < n_clusters; i++) {
      average_time_series[i] = new Array(criteria_time_series.length);
      average_time_series[i].fill(0);
    }
    // calculate clustering frequency and average value of each cluster
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

  getIndexMaximizingCorr (index, flow_list) {
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
      return generalConst.ERR_REACH_EDGH;
    }

    const max_corr = Math.max.apply(null, corr_list);
    if (max_corr === pairTimeSeries.error) {
      return generalConst.ERR_REACH_EDGH;
    }
    return idx_list[corr_list.indexOf(max_corr)];
  }

  updateTraceflowList (clicked_index) {
    traceflow_list = new Array(all_time_series.length);
    traceflow_list.fill(false);

    let target_index = clicked_index;
    for (let i = 0; i < 10000; i++) {
      const new_index = this.getIndexMaximizingCorr(target_index, traceflow_list);
      if (new_index === generalConst.ERR_REACH_EDGH) {
        break;
      }

      traceflow_list[new_index] = true;
      target_index = new_index;
    }
    this.emitChange();
  }
}
const store = new Store();

export default store;
