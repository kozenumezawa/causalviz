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
  },

  handleCorrelationClick: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_CORRELATION_CLICK
    });
  },

  handleTiffClick: (x, y) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_TIFF_CLICK,
      x : x,
      y : y
    });
  },

  handleLoupeMove: (x, y) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_LOUPE_MOVE,
      x : x,
      y : y
    });
  },

  handleLoupeClick: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_LOUPE_CLICK
    });
  }
}