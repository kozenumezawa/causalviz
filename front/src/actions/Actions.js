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
  },

  handleIndicatorMove: (index) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_INDICATOR_MOVE,
      new_index : index
    });
  },

  handleDefaultClick: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_DEFAULT_CLICK
    });
  },

  handleKmeansClick: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_KMEANS_CLICK
    });
  },

  handleClearSelection: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_CLEAR_SELECTION
    })
  },

  handleCheckClick: (index) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_CHECK_CLICK,
      index: index
    })
  }
}