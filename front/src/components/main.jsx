import React from 'react';
import Chip from 'material-ui/Chip';
import {white} from 'material-ui/styles/colors';

import Store from '../stores/Store';
import generalConstants from '../constants/general-constants';

import TiffContainer from './tiff-container.jsx';
import AppBar from './app-bar.jsx';
import StepButton from './input/step-button.jsx';
import CommandButton from './input/command-button.jsx';
import LegendContainer from './legend-container.jsx';

import DefaultView from './mainview/default-view.jsx';
import KmeansClusteringView from './mainview/kmeans-clustering-view.jsx';
import MaximumValueClusteringView from './mainview/maximum-value-clustering-view.jsx';
import CrossCorrelationView from './mainview/cross-correlation-view.jsx';
import TraceFlowView from './mainview/trace-flow-view.jsx';

function getAllState() {
  return {
    canvas_width        : Store.getCanvasWidth(),
    canvas_height       : Store.getCanvasHeight(),
    data_type           : Store.getDataType(),
    render_contents     : Store.getRenderContents(),
    all_tiff_list       : Store.getAllTiffList(),
    tiff_index          : Store.getTiffIndex(),
    legend_tiff         : Store.getLegendTiff(),
    all_time_series     : Store.getAllTimeSeries(),
    cluster_time_series : Store.getClusterTimeSeries(),
    corr_time_series    : Store.getCorrTimeSeries(),
    relation_list       : Store.getRelationList(),
    highlighted_line    : Store.getHighlightedLine(),
    clicked_point       : Store.getClickedPoint(),
    loupe_point         : Store.getLoupePoint(),
    cluster_list        : Store.getClusterList(),
    checked_cluster     : Store.getCheckedCluster(),
    slider_value        : Store.getSliderValue(),
    maximum_list        : Store.getMaximumList(),
    tau_list            : Store.getTauList(),
    correlation_list    : Store.getCorrelationList(),
    criteria_time_series: Store.getCriteriaTimeSeries(),
    traceflow_list      : Store.getTraceflowList()
  }
}

export default class main extends React.Component {
  constructor(props) {
    super(props);
    this.state = getAllState();
  }

  componentDidMount() {
    Store.addChangeListener(this._onChange.bind(this));
  }

  _onChange() {
    this.setState(getAllState());
  }

  render() {
    const left_ref = 30;
    const top_response = 150;
    const top_relation = 350;
    const top_control = 550;

    let tiff_list = this.state.all_tiff_list;
    if(this.state.render_contents === generalConstants.VIEW_CROSS_CORRELATION) {
      tiff_list = Store.getCutTiffList();
    }

    return (
      <div>
        <AppBar
          data_type={this.state.data_type}
        />
        <br />

        <div>
          <div style={{position: 'absolute', display: 'inline-block', top: 100, left: left_ref}}>
            <LegendContainer
              id="legend_output"
              legend_tiff={this.state.legend_tiff}
            />
          </div>
        </div>

        <div style={{position: 'absolute', display: 'inline-block', top: top_relation+40, left: 480}}>
          <StepButton
            tiff_index={this.state.tiff_index}
            tiff_list={tiff_list}
          />
        </div>

        <div>
          <div style={{position: 'absolute', display: 'inline-block', top: top_response, left: left_ref}}>
            <Chip backgroundColor={white}>
              {'Ca2+ Response'}
            </Chip>
          </div>
          <div style={{position: 'absolute', display: 'inline-block', top: top_response+40, left: left_ref+30}}>
            <TiffContainer
              id="tiff_output_1"
              canvas_width={this.state.canvas_width}
              canvas_height={this.state.canvas_height}
              clicked_point={this.state.clicked_point}
              loupe_point={this.state.loupe_point}
              tiff_index={this.state.tiff_index}
              tiff_list={tiff_list}
            />
          </div>
        </div>

        {(() => {
          switch(this.state.render_contents) {
            case generalConstants.VIEW_DEFAULT:
              return (
                <div>
                  <DefaultView
                    parent_state = {this.state}
                    tiff_list = {tiff_list}
                  />
                </div>
              );
              break;
            case generalConstants.VIEW_KMEANS:
              return (
                <div>
                  <KmeansClusteringView
                    parent_state = {this.state}
                    tiff_list = {tiff_list}
                  />
                </div>
              );
              break;
            case generalConstants.VIEW_MAXIMUM:
              return(
                <div>
                  <MaximumValueClusteringView
                    parent_state = {this.state}
                  />
                </div>
              );
              break;
            case generalConstants.VIEW_CROSS_CORRELATION:
              return(
                <div>
                  <CrossCorrelationView
                    parent_state = {this.state}
                    tiff_list = {tiff_list}
                  />
                </div>
              );
              break;
            case generalConstants.VIEW_TRACE_FLOW:
              return (
                <div>
                  <TraceFlowView
                    parent_state = {this.state}
                    tiff_list = {tiff_list}
                  />
                </div>
              );
              break;
          }
        })()}

        <div style={{position: 'absolute', display: 'inline-block', top: 100, left: 480}}>
          <CommandButton />
        </div>

        <div>
          <div style={{position: 'absolute', display: 'inline-block', top:190, left: 370}}> 100 </div>
          <div style={{position: 'absolute', display: 'inline-block', top:340, left: 375}}> -50 </div>

          <div style={{position: 'absolute', display: 'inline-block', top:350, left: 395}}> 0 </div>
          <div style={{position: 'absolute', display: 'inline-block', top:350, left: 565}}> Time (seconds) </div>
          <div style={{position: 'absolute', display: 'inline-block', top:350, left: 810}}> 40 </div>
        </div>
      </div>
    );
  }
}