import { EventEmitter } from 'events'
import Dispatcher from '../dispatcher/Dispatcher'
import eventConstants from '../constants/event-constants'
import pairTimeSeries from '../pair-time-series'

const CHANGE_EVENT = 'change';

let all_tiff_list = [];
let all_green_time = [];
let tiff_index = 0;

class Store extends EventEmitter {
  constructor() {
    super();
    this.getTiffData('Substack.tif');
    this.getTiffData('Substack.tif');
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
        this.createCorrelationMap();
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

  getAllGreenTime() {
    return all_green_time;
  }

  getTiffData(name) {
    window.fetch(name)
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
          all_green_time.push(this.createTimeSeriesFromTiff(tiff_list));
          this.emitChange();
        });
      });
  }

  createTimeSeriesFromTiff(tiff_list) {
    let green_time_series_inverse = [];
    tiff_list.forEach((element, idx) => {
      const canvas = element;
      const context = canvas.getContext('2d');
      const image_data = context.getImageData(0, 0, canvas.width, canvas.height);
      const image_rgba = image_data.data; // image_rgba = [R, G, B, A, R, G, B, A, ...] (hex data)

      green_time_series_inverse.push(this.getGreenFromRGBA(image_rgba));
      // console.log(green_time_series_inverse) -> [time][points]
    });

    // transpose time series data
    let green_time_series = [];
    for(let i = 0; i < green_time_series_inverse[0].length; i++) {
      green_time_series[i] = [];
      for(let j = 0; j < green_time_series_inverse.length; j++) {
        green_time_series[i][j] = green_time_series_inverse[j][i];
      }
    }
    // console.log(green_time_series) -> [points][time]
    return green_time_series;
  }

  getGreenFromRGBA(rgba_data) {
    let green_list = [];
    for(let i = 1; i < rgba_data.length; i += 4) {
      green_list.push(rgba_data[i]);
    }
    return green_list;
  }

  createCorrelationMap() {
    for(let i = 0; i < all_green_time[0].length; i++) {
      // console.log(all_green_time[i]) -> [points][time]
      const pair = new pairTimeSeries(all_green_time[0][i], all_green_time[1][i]);
      console.log(pair.getCorrelation());
    }
  }
}

const store = new Store();

export default store;