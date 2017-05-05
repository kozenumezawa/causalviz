import Dispatcher from '../dispatcher/Dispatcher';
import eventConstants from '../constants/event-constants';

export default {
  handleDataChange: (data_type) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_DATA_CHANGE,
      data_type: data_type
    });
  },

  handleFilterChange: (filter_type) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_FILTER_CHANGE,
      filter_type: filter_type
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

  handleCrossCorrelation: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_CROSS_CORRELATION
    });
  },

  handleThreeDim: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_THREE_DIM
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
    });
  },

  handleCheckClick: (index) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_CHECK_CLICK,
      index: index
    });
  },

  handleClusterChange: (n_clusters) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_CLUSTER_CHANGE,
      n_clusters: n_clusters
    });
  },

  handleLineHeightsChange: (line_heights) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_LINEHEIGHTS_CHANGE,
      line_heights: line_heights
    });
  },

  handleSelectArea: (rect_x, rect_y, x, y) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_SELECT_AREA,
      rect_x: rect_x,
      rect_y: rect_y,
      x: x,
      y: y
    });
  }
}