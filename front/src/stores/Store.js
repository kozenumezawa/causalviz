import { EventEmitter } from 'events'
import Dispatcher from '../dispatcher/Dispatcher'
import eventConstants from '../constants/event-constants'
import * as pairTimeSeries from '../pair-time-series'

const CHANGE_EVENT = 'change';

let all_tiff_list = [];
let all_time_series = [];
let all_green_time = [];
let all_red_time = [];
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

class Store extends EventEmitter {
  constructor() {
    super();
    this.getTiffData('GFBratio-mask-64-255.tif', '2E2_GFB.tif');
    Dispatcher.register(this.handler.bind(this));
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  handler(action) {
    switch(action.actionType) {
      case eventConstants.HANDLE_BEFORE_CLICK:
        tiff_index--;
        if(tiff_index < 0) {
          tiff_index = all_tiff_list[0].length - 1;
        }
        break;
      case eventConstants.HANDLE_NEXT_CLICK:
        tiff_index++;
        if(tiff_index == all_tiff_list[0].length) {
          tiff_index = 0;
        }
        break;
      case eventConstants.HANDLE_CORRELATION_CLICK:
        if(relation_list.length == 0) {
          this.createCorrelationMap();
        }
        break;
      case eventConstants.HANDLE_TIFF_CLICK:
        highlighted_line = Math.floor(action.y / 2) * 140 + Math.floor(action.x / 2);
        clicked_point.x = action.x;
        clicked_point.y = action.y;
        break;
      case eventConstants.HANDLE_LOUPE_CLICK:
        loupe_point.on = !loupe_point.on;
        if(loupe_point.on == false) {
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
      default:
    }
    this.emitChange();
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

  getTiffData(tiff_name, legend_name) {
    window.fetch(tiff_name)
      .then((response) => {
        response.arrayBuffer().then((buffer) => {
          let tiff_list = [];
          const tiff = new Tiff({ buffer: buffer });
          for (let i = 0, len = tiff.countDirectory(); i < len; i++) {
            tiff.setDirectory(i);
            const canvas = tiff.toCanvas();
            tiff_list.push(canvas);
          }
          all_tiff_list.push(tiff_list);
          all_time_series.push(this.createTimeSeriesFromTiff(tiff_list));
          this.emitChange();
        });
      })
      .then(() => {
        window.fetch(legend_name)
          .then((response) => {
            response.arrayBuffer().then((buffer) => {
              const tiff = new Tiff({ buffer: buffer });
              for (let i = 0, len = tiff.countDirectory(); i < len; i++) {
                tiff.setDirectory(i);
                const canvas = tiff.toCanvas();
                legend_tiff = canvas;
              }
              this.createAllTimeSeriesFromTiff();
              this.emitChange();
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
      for(let i = 1; i < image_rgba.length; i += 4) {
        one_time_series.push(50);
      }
      time_series_inverse.push(one_time_series);  // console.log(green_time_series_inverse) -> [time][points]
    });

    // transpose time series data
    let time_series = [];
    for(let i = 0; i < time_series_inverse[0].length; i++) {
      time_series[i] = [];
      for(let j = 0; j < time_series_inverse.length; j++) {
        time_series[i][j] = time_series_inverse[j][i];
      }
    }
    return time_series;
  }

  createAllTimeSeriesFromTiff() {
    const legend_canvas = legend_tiff;
    const legend_ctx = legend_canvas.getContext('2d');
    const image_data = legend_ctx.getImageData(0, 0, legend_canvas.width, legend_canvas.height);
    const image_rgba = image_data.data; // image_rgba = [R, G, B, A, R, G, B, A, ...] (hex data)
    console.log(image_rgba);
  }

  createCorrelationMap() {
    const time_series_1 = all_green_time[0]; // console.log(all_green_time[0]) -> [points][time]
    const time_series_2 = all_red_time[1];

    for(let i = 0; i < time_series_1.length; i++) {
      relation_list.push(pairTimeSeries.getCorrelation(time_series_1[i], time_series_2[i]));
    }
    this.emitChange();
  }
}

const store = new Store();

export default store;