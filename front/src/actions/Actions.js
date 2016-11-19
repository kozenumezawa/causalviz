import Dispatcher from '../dispatcher/Dispatcher'
import eventConstants from '../constants/event-constants'

export default {
  handleBeforeClick: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_BEFORE_CLICK
    });
  },

  handleNextClick: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_NEXT_CLICK
    });
  }
}