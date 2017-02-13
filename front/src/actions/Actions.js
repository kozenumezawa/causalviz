import Dispatcher from '../dispatcher/Dispatcher'
import eventConstants from '../constants/event-constants'

export default {
  handleDefaultClick: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_DEFAULT_CLICK
    });
  },

  handleMaximumClick: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_MAXIMUM_CLICK
    });
  },

  handleKmeansClick: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_KMEANS_CLICK
    });
  },

  handleCrossCorrelation: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_CROSS_CORRELATION
    });
  },

  handleTraceFlow: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_TRACE_FLOW
    });
  },
  
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
  },

  handleClusterChange: (n_clusters) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_CLUSTER_CHANGE,
      n_clusters: n_clusters
    })
  },

  handleLineHeightsChange: (line_heights) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_LINEHEIGHTS_CHANGE,
      line_heights: line_heights
    })
  }
}