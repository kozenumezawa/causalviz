import { EventEmitter } from 'events'
import Dispatcher from '../dispatcher/Dispatcher'
import eventConstants from '../constants/event-constants'

class Store extends EventEmitter {
  constructor() {
    super();
    Dispatcher.register(this.handler.bind(this));
    
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
}

const store = new Store();

export default store;