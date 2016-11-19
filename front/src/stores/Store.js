import { EventEmitter } from 'events'
import Dispatcher from '../dispatcher/Dispatcher'
import eventConstants from '../constants/event-constants'

const CHANGE_EVENT = 'change';

let tiff_list = [];

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
    tiff_list = [];
    window.fetch('Substack.tif')
      .then((response) => {
        response.arrayBuffer().then((buffer) => {
          const tiff = new Tiff({ buffer: buffer });
          for (let i = 0, len = tiff.countDirectory(); i < len; i++) {
            tiff.setDirectory(i);
            const canvas = tiff.toCanvas();
            tiff_list.push(canvas);
            this.appendCanvas(canvas, "output_space");
          }
          this.emitChange();
        });
      });
  }

  appendCanvas(canvas, id) {
    const display_canvas = document.createElement('canvas');
    const bias = 3;
    display_canvas.width = canvas.width * bias;
    display_canvas.height = canvas.height * bias;
    const ctx = display_canvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width * bias, canvas.height * bias);

    const elem = document.getElementById(id);
    elem.appendChild(display_canvas);
  }

  handler(action) {
    switch(action.actionType) {
      case eventConstants.HANDLE_BEFORE_CLICK:
        break;
      case eventConstants.HANDLE_NEXT_CLICK:
        console.log('a');
        break;
      default:
    }
  }

  getTiffList() {
    return tiff_list;
  }
}

const store = new Store();

export default store;