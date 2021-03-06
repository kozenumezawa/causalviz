import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher/Dispatcher';
import eventConstants from '../constants/event-constants';
import generalConst from '../constants/general-constants';

import * as pairTimeSeries from '../utils/pair-time-series';
import * as storeUtils from './store-utils'
import * as OpticalFlow from '../utils/lucas-and-kanade'

const CHANGE_EVENT = 'change';

let canvas_width = 285;
let canvas_height = 130;

let data_type = generalConst.DATA_TRP_TYPE;

let filter_type = generalConst.FILTER_MEAN;

let render_contents = generalConst.VIEW_CROSS_CORRELATION;

let all_tiff_list = [];
let all_time_series = [];
let cluster_time_series = [];
let corr_time_series = [];
let tiff_index = 0;       // indicate the tiff file which should be displayed
let legend_tiff = null;
let highlighted_lines = [];
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

let cut_time_series = []; // to calculate cross correlation

let selected_area = {
  rect_x : -1,
  rect_y : -1,
  x : -1,
  y : -1,
  on : false
};

let vector_fields = [];
let save_vector_fields = {
  upper: {
    data: [],
    opt_type: ""
  },
  lower: {
    data: [],
    opt_type: ""
  }
};

let opt_type = generalConst.CAUSAL_LAG_ANALYSIS;

let cross_win_pixels = 5;
let cross_win_frames = 30;
let cross_max_lag = 10;
let causal_data = [];
let play_timer_on = false;

let all_lag_list = [];

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
    selected_area = {
      rect_x : -1,
      rect_y : -1,
      x : -1,
      y : -1,
      on : false
    };
    highlighted_lines = [];
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
      case generalConst.DATA_TRP_TYPE:
        canvas_width = 128;
        canvas_height = 96;
        break;
      case generalConst.DATA_GAUSSIAN_WAVE:
        canvas_width = 128;
        canvas_height = 128;
        break;
      default:
        break;
    }
  }

  handler (action) {
    switch (action.actionType) {
      case eventConstants.HANDLE_DATA_CHANGE:
        if (action.data_type === data_type) {
          break;
        }
        this.setInitialState();
        data_type = action.data_type;
        this.setWidthAndHeight(data_type);
        this.setTiffData();
        break;
      case eventConstants.HANDLE_FILTER_CHANGE:
        if (action.filter_type === filter_type) {
          break;
        }
        filter_type = action.filter_type;
        this.setTiffData();
        break;
      case eventConstants.HANDLE_DEFAULT_CLICK:
        this.setInitialState();
        render_contents = generalConst.VIEW_DEFAULT;
        break;
      case eventConstants.HANDLE_CROSS_CORRELATION:
        this.setInitialState();
        slider_value = 10;
        this.updateCorrelationList(slider_value);
        render_contents = generalConst.VIEW_CROSS_CORRELATION;
        break;
      case eventConstants.HANDLE_GRANGER_CAUSALITY:
        this.setInitialState();
        slider_value = 10;
        // this.updateCorrelationList(slider_value);
        console.log('a');
        render_contents = generalConst.VIEW_GRANGER_CAUSALITY;
        break;
      case eventConstants.HANDLE_THREE_DIM:
        this.setInitialState();
        render_contents = generalConst.VIEW_THREE_DIM;
        break;
      case eventConstants.HANDLE_GRAPH:
        this.setInitialState();
        render_contents = null;
        break;
      case eventConstants.HANDLE_BEFORE_CLICK:
        tiff_index--;
        if (tiff_index < 0) {
          tiff_index = all_tiff_list.length - 1;
        }
        break;
      case eventConstants.HANDLE_NEXT_CLICK:
        // this.saveData();
        tiff_index++;
        if (tiff_index === all_tiff_list.length) {
          tiff_index = 0;
        }
        break;
      case eventConstants.HANDLE_PLAY_CLICK:
        if (play_timer_on === false) {
          play_timer_on = true;

          const play_tiff = setInterval(() => {
            if (++tiff_index === all_tiff_list.length - 1 || play_timer_on === false) {
              tiff_index = (tiff_index === all_tiff_list.length - 1) ? 0 : tiff_index;
              clearInterval(play_tiff);
              play_timer_on = false;
            }
            this.emitChange();
          }, 50);
        } else {
          play_timer_on = false;
        }
        break;
      case eventConstants.HANDLE_TIFF_CLICK:
        if (selected_area.on === true) {
          clicked_point.x = -1;
          clicked_point.y = -1;
          break;
        }
        highlighted_lines = [];
        highlighted_lines.push(Math.floor(action.y) * canvas_width + Math.floor(action.x));
        clicked_point.x = action.x;
        clicked_point.y = action.y;

        if (cluster_list.length !== 0) {
          highlighted_lines.forEach((highlighted_line) => {
            let selected_cluster;
            if (render_contents === generalConst.VIEW_KMEANS) {
              selected_cluster = cluster_list[highlighted_line];
            } else if (render_contents === generalConst.VIEW_CROSS_CORRELATION) {
              selected_cluster = correlation_list[highlighted_line];
            }
            checked_cluster[selected_cluster] = !checked_cluster[selected_cluster];
          });
        }
        break;
      case eventConstants.HANDLE_LOUPE_CLICK:
        loupe_point.on = !loupe_point.on;
        if (loupe_point.on === false) {
          loupe_point.x = -1;
          loupe_point.y = -1;
        }
        break;
      case eventConstants.HANDLE_CROP_CLICK:
        selected_area.on = !selected_area.on;
        if (selected_area.on === false) {
          selected_area.rect_x = -1;
          selected_area.rect_y = -1;
          selected_area.x = -1;
          selected_area.y = -1;

          highlighted_lines = [];
          this.emitChange();
        }
        break;
      case eventConstants.HANDLE_SELECT_AREA:
        if (selected_area.on === true) {
          this.setHighlightedLines(action.rect_x, action.rect_y, action.x, action.y);

          switch (render_contents) {
            case generalConst.VIEW_CROSS_CORRELATION:
              this.updateCorrelationList(checked_cluster.length);
              break;
            case generalConst.VIEW_GRANGER_CAUSALITY:
              console.log('a');
              break;
            default:
              break;
          }
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
        this.updateCorrelationList(slider_value);
        break;
      case eventConstants.HANDLE_RUN_OPT:
        this.updateVectorFields();
        break;
      case eventConstants.HANDLE_OPT_CHANGE:
        opt_type = action.opt_type;
        break;
      case eventConstants.HANDLE_SAVE_CLICK:
        if (vector_fields.length === 0) {
          break;
        }
        const save_pos = action.save_pos;
        save_vector_fields[save_pos].data = vector_fields;
        save_vector_fields[save_pos].opt_type = opt_type;
        break;
      case eventConstants.HANDLE_PARAMS_CHANGE:
        switch (action.params_name){
          case "win_pixels":
            cross_win_pixels = action.value;
            break;
          case "win_frames":
            cross_win_frames = action.value;
            break;
          case "max_lag":
            cross_max_lag= action.value;
            break;
        }
        break;
      case eventConstants.HANDLE_CALC_CLICK:
        console.log('a');
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

  getHighlightedLines () {
    return highlighted_lines;
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

  getSelectedArea () {
    return selected_area;
  }

  getVectorFields() {
    return vector_fields;
  }

  getSaveVectorFields() {
    return save_vector_fields;
  }

  getOptType() {
    return opt_type;
  }

  getCrossWinPixels() {
    return cross_win_pixels;
  }

  getCrossWinFrames() {
    return cross_win_frames;
  }

  getCrossMaxLag() {
    return cross_max_lag;
  }

  getCausalData() {
    return causal_data
  }

  getAllLagList() {
    return all_lag_list;
  }
  //
  // getCutTiffList () {
  //   let cut_tiff_list = [];
  //   for (let i = 0, len = all_tiff_list.length - 15; i < len; i++) {
  //     cut_tiff_list[i] = all_tiff_list[i + 15];
  //   }
  //   return cut_tiff_list;
  // }

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
          tiff_name = 'trp-3-masked8b_color.tif';
        } else if (filter_type === generalConst.FILTER_MEAN) {
          tiff_name = 'trp-3-masked8b_color_mean.tif';
        }
        legend_name = '2E2_GFB.tif';
        break;
      case generalConst.DATA_GAUSSIAN_WAVE:
        tiff_name = 'TavellingGaussianWaves_sub.tif';
        // tiff_name = 'TavellingGaussianWaves.tif';
        legend_name = '';
        break;
      default:
        break;
    }
    window.fetch(tiff_name)
      .then((response) => {
        response.arrayBuffer().then((buffer) => {
          let tiff_list = [];
          const tiff = new Tiff({ buffer: buffer });
          let tiff_len = tiff.countDirectory();
          if (data_type === generalConst.DATA_WILD_TYPE) {
            tiff_len = tiff.countDirectory() - 50;
          } else if (data_type === generalConst.DATA_TRP_TYPE) {
            tiff_len = tiff.countDirectory() - 100;
          }

          for (let i = 0; i < tiff_len; i++) {
            if (data_type === generalConst.DATA_TRP_TYPE && i < 50) {
              continue;
            }
            tiff.setDirectory(i);
            const canvas = tiff.toCanvas();
            tiff_list.push(canvas);
          }
          all_tiff_list = tiff_list;
          if (legend_name !== '') {
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
          } else {
            legend_tiff = null;
            this.updateTimeSeriesAndCluster();
          }

        });
      });
  }

  updateTimeSeriesAndCluster() {
    all_time_series = this.createAllTimeSeriesFromTiff(legend_tiff);
    this.removeEdgeTimeSeries();

    this.updateCorrelationList(slider_value);
  }

  createAllTimeSeriesFromTiff (legend_canvas) {
    // create time series data from each time step data
    let all_time_series_inverse = [];
    all_tiff_list.forEach((tiff_canvas, idx) => {
      const time_series_inverse = storeUtils.createTimeSeriesInverse(tiff_canvas, legend_canvas);
      all_time_series_inverse.push(time_series_inverse);
    });

    // storeUtils.createCsvFromTimeSeries(this.transposeTimeSeries(all_time_series_inverse));
    return storeUtils.transposeTimeSeries(all_time_series_inverse);
  }
  removeEdgeTimeSeries() {
    if (data_type !== generalConst.DATA_WILD_TYPE && data_type !== generalConst.DATA_TRP_TYPE) {
      return;
    }

    const zero_time_series = all_time_series[0];
    all_time_series = all_time_series.map((time_series, idx) => {
      if (time_series[0] === 0) {
        return time_series
      }
      if (all_time_series[idx - canvas_width - 1][0] === 0
          || all_time_series[idx - canvas_width][0] === 0
          || all_time_series[idx - canvas_width + 1][0] === 0
          || all_time_series[idx - 1][0] === 0
          || all_time_series[idx + 1][0] === 0
          || all_time_series[idx + canvas_width - 1][0] === 0
          || all_time_series[idx + canvas_width][0] === 0
          || all_time_series[idx + canvas_width + 1][0] === 0
        ) {
        return zero_time_series;
      }
      return time_series;
    });
  }

  updateCheckedCluster (list) {
    const checked_cluster_length = Math.max.apply(null, list) + 1;
    if (checked_cluster_length <= 0) {
      return;
    }
    checked_cluster = new Array(checked_cluster_length);
    checked_cluster.fill(false);
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

      const x = i % canvas_width;
      const y = Math.floor(i / canvas_width);

      if (selected_area.on === false) {
        // add right hand area data to criteria_time_series if data type is wild type
        if (data_type === generalConst.DATA_WILD_TYPE && (x < 250 || cut_time_series[i].indexOf(0) >= 0))
          continue;

        // add right hand area data to criteria_time_series if data type is wild type
        if (data_type === generalConst.DATA_TRP_TYPE && (x < 65 || y < 76 || cut_time_series[i].indexOf(0) >= 0))
          continue;

        sum_count += 1;
        cut_time_series[i].forEach((scalar, idx) => {
          criteria_time_series[idx] += scalar;
        });

      } else {
        const idx_highlight = highlighted_lines.indexOf(i);
        if (idx_highlight === -1) {
          continue;
        }
        if (cut_time_series[i].indexOf(0) >= 0) {
          continue;
        }

        sum_count += 1;
        cut_time_series[i].forEach((scalar, idx) => {
          criteria_time_series[idx] += scalar;
        });
      }
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
    if (data_type === generalConst.DATA_WILD_TYPE) {
      // because 1 time step = 0.5s
      for (let i = 0; i < n_clusters * 2; i += 2) {
        corr_list.push(pairTimeSeries.getCorrelation(criteria_x, y.slice(i)));
      }
    } else {
      // because 1 time step = 0.2s
      for (let i = 0; i < n_clusters * 5; i += 5) {
        corr_list.push(pairTimeSeries.getCorrelation(criteria_x, y.slice(i)));
      }
    }
    const max_corr = Math.max.apply(null, corr_list);
    if (max_corr === pairTimeSeries.error) {
      const corr_data = {
        tau: pairTimeSeries.error,
        corr: 0
      };
      return corr_data;
    }

    if (max_corr < 0.7) {
      const corr_data = {
        tau: -10,
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

      if (cluster_number === pairTimeSeries.error || cluster_number === -10)
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

  setHighlightedLines(rect_x, rect_y, x, y) {
    highlighted_lines = [];
    selected_area.rect_x = rect_x;
    selected_area.rect_y = rect_y;
    selected_area.x = x;
    selected_area.y = y;

    // select area
    const left_x = (rect_x < x) ? rect_x : x;
    const right_x = (rect_x < x) ? x : rect_x;
    const above_y = (rect_y < y) ? rect_y : y;
    const below_y = (rect_y < y) ? y : rect_y;

    for (let y = above_y; y <= below_y; y++) {
      for (let x = left_x; x <= right_x; x++) {
        highlighted_lines.push(Math.floor(y) * canvas_width + Math.floor(x));
      }
    }
    
    this.emitChange();
  }

  updateVectorFields() {
    vector_fields = [];
    switch (opt_type) {
      case generalConst.OPT_LUCAS:
        for (let i = 0; i < all_time_series[0].length - 1; i++) {
          const step = 2;
          const opt_result = OpticalFlow.lucasAndKanade(all_time_series, i, i + 1, canvas_width, canvas_height, step);
          let vector_field = [];
          opt_result.zones.forEach((zone) => {
            if (all_time_series[zone.y * canvas_width + zone.x][0] !== 0) {
              vector_field.push(zone);
            }
          });
          vector_fields.push(vector_field);
        }
        break;
      case generalConst.OPT_SPATIO:
        break;
      case generalConst.CAUSAL_CROSS_CORRELATION:
        window.fetch('http://localhost:3000/api/v1/corr', {
          mode: 'cors',
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            data: all_time_series,
            win_pixels: cross_win_pixels,
            win_frames: cross_win_frames,
            max_lag: cross_max_lag,
            width: canvas_width,
            height: canvas_height
          })
        })
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            causal_data = json.data;
            this.emitChange();
          });
        break;
      case generalConst.CAUSAL_GRANGER:
        console.log('a');
        break;
      case generalConst.CAUSAL_LAG_ANALYSIS:
        this.updateCriteriaTimeSeries();

        for (let frame = 0; frame < all_time_series[0].length; frame += cross_win_frames) {
          const win_frames = cross_win_frames;
          let start_frame = Math.max(0, Math.floor(frame - win_frames / 2));
          let stop_frame = Math.min(all_time_series[0].length - 1, Math.floor(frame + win_frames / 2));
          if (start_frame === 0) {
            stop_frame = win_frames;
          } else if (stop_frame === all_time_series[0].length - 1) {
            start_frame = all_time_series[0].length - win_frames;
          }

          // calculate tau which maximizes cross correlation in each pixel
          let lag_list = [];
          const x = criteria_time_series.slice(start_frame, stop_frame);
          all_time_series.forEach((time_series) => {
            const y = time_series.slice(start_frame, stop_frame);
            const corr_data = this.getTauMaximizingCorr(x, y, 9);

            lag_list.push(corr_data.tau);
          });

          all_lag_list.push(lag_list);
        }
        break;
      default:
        break;
    }
  }

  saveData() {
    window.fetch('http://localhost:3000/api/v1/savedata', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        data: all_time_series,
        file_name: 'wilddata_mean.npy'
        // file_name: 'trp3data_mean.npy'
        // file_name: 'gaussian_wave_sub.npy'
      })
    })
  }
}
const store = new Store();

export default store;
