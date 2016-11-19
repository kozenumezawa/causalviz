import { EventEmitter } from 'events'
import Dispatcher from '../dispatcher/Dispatcher'
import eventConstants from '../constants/event-constants'

const CHANGE_EVENT = 'change';

let tiff_list = [];
let tiff_index = 0;

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
          this.emitChange();
        });
      });
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
}

const store = new Store();

export default store;