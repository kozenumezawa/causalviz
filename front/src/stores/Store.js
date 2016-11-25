import { EventEmitter } from 'events'
import Dispatcher from '../dispatcher/Dispatcher'
import eventConstants from '../constants/event-constants'

const CHANGE_EVENT = 'change';

let tiff_list = [];
let tiff_index = 0;
let green_time_series = [];

class Store extends EventEmitter {
  constructor() {
    super();
    this.getTiffData();

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
          tiff_index = tiff_list.length - 1;
        }
        break;
      case eventConstants.HANDLE_NEXT_CLICK:
        tiff_index++;
        if(tiff_index == tiff_list.length) {
          tiff_index = 0;
        }
        break;
      default:
    }
    this.emitChange();
  }

  getTiffList() {
    return tiff_list;
  }

  getTiffIndex() {
    return tiff_index;
  }

  getGreenTimeSeries() {
    return green_time_series;
  }

  getTiffData() {
    window.fetch('Substack.tif')
      .then((response) => {
        response.arrayBuffer().then((buffer) => {
          const tiff = new Tiff({ buffer: buffer });
          for (let i = 0, len = tiff.countDirectory(); i < len; i++) {
            tiff.setDirectory(i);
            const canvas = tiff.toCanvas();
            tiff_list.push(canvas);
          }
          green_time_series = this.createTimeSeriesFromTiff();
          this.emitChange();
        });
      });
  }

  createTimeSeriesFromTiff() {
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
}

const store = new Store();

export default store;