
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

  handleCrossCorrelation: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_CROSS_CORRELATION
    });
  },

  handleGrangerCausality: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_GRANGER_CAUSALITY
    });
  },

  handleThreeDim: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_THREE_DIM
    });
  },

  handleGraph: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_GRAPH
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

  handlePlayClick: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_PLAY_CLICK
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

  handleCropClick: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_CROP_CLICK
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
  },

  handleRunOpt: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_RUN_OPT
    });
  },

  handleOptChange: (opt_type) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_OPT_CHANGE,
      opt_type: opt_type
    });
  },

  handleSaveClick: (save_position) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_SAVE_CLICK,
      save_pos: save_position
    });
  },

  handleParamsChange: (params_name, value) => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_PARAMS_CHANGE,
      params_name: params_name,
      value: value
    });
  },

  handleCalcClick: () => {
    Dispatcher.dispatch({
      actionType: eventConstants.HANDLE_CALC_CLICK
    });
  }
}