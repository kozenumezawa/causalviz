import React from 'react';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';

import { white } from 'material-ui/styles/colors';
import { Switch, Route } from 'react-router-dom'
import Store from '../stores/Store';
import generalConst from '../constants/general-constants';
import layoutConst from '../constants/layout-constants'

import TiffContainer from './container/tiff-container.jsx';

import AppBar from './app-bar.jsx';
import LegendContainer from './legend-container.jsx';

import SelectOptView from './view/select-opt-view.jsx'
import ResultCausalView from './view/result-causal-view.jsx'
import ComparisonView from './view/comparison-view.jsx'


import GraphView from './mainview/graph-view.jsx';
import CrossCorrelationView from './mainview/cross-correlation-view.jsx';
import ThreeDimView from './mainview/three-dim-view.jsx';

function getAllState() {
  return {
    canvas_width        : Store.getCanvasWidth(),
    canvas_height       : Store.getCanvasHeight(),
    data_type           : Store.getDataType(),
    filter_type         : Store.getFilterType(),
    render_contents     : Store.getRenderContents(),
    all_tiff_list       : Store.getAllTiffList(),
    tiff_index          : Store.getTiffIndex(),
    legend_tiff         : Store.getLegendTiff(),
    all_time_series     : Store.getAllTimeSeries(),
    cluster_time_series : Store.getClusterTimeSeries(),
    corr_time_series    : Store.getCorrTimeSeries(),
    highlighted_lines   : Store.getHighlightedLines(),
    clicked_point       : Store.getClickedPoint(),
    loupe_point         : Store.getLoupePoint(),
    cluster_list        : Store.getClusterList(),
    checked_cluster     : Store.getCheckedCluster(),
    slider_value        : Store.getSliderValue(),
    tau_list            : Store.getTauList(),
    correlation_list    : Store.getCorrelationList(),
    criteria_time_series: Store.getCriteriaTimeSeries(),
    selected_area       : Store.getSelectedArea(),
    vector_fields       : Store.getVectorFields(),
    save_vector_fields  : Store.getSaveVectorFields(),
    opt_type            : Store.getOptType(),
    cross_win_pixels    : Store.getCrossWinPixels(),
    cross_win_frames    : Store.getCrossWinFrames(),
    cross_max_lag       : Store.getCrossMaxLag(),
    causal_data         : Store.getCausalData(),
    all_lag_list        : Store.getAllLagList()
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
    let tiff_list = this.state.all_tiff_list;
    // if (this.state.data_type === generalConst.DATA_WILD_TYPE && this.state.render_contents === generalConst.VIEW_CROSS_CORRELATION) {
    //   tiff_list = Store.getCutTiffList();
    // }
    return (
      <div>
        <AppBar
          data_type={this.state.data_type}
          filter_type={this.state.filter_type}
        />
        <br />

        <Switch>
          <Route exact path='/' render={(props) => (
            <div>
              <div style={{marginLeft: 50, marginRight: 200, display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <TiffContainer
                    id="tiff_output"
                    canvas_width={this.state.canvas_width}
                    canvas_height={this.state.canvas_height}
                    clicked_point={this.state.clicked_point}
                    loupe_point={this.state.loupe_point}
                    selected_area={this.state.selected_area}
                    tiff_index={this.state.tiff_index}
                    tiff_list={tiff_list}
                  />

                  <div>
                    <div style={{positon: 'relative', display: 'inline-block', marginTop: 20}}>
                      <LegendContainer
                        id="legend_output"
                        data_type={this.state.data_type}
                        render_contents={this.state.render_contents}
                        legend_tiff={this.state.legend_tiff}
                      />
                    </div>
                  </div>

                </div>
                <div style={{width: '30%'}}>
                  <SelectOptView
                    parent_state={this.state}
                  />
                  <div>

                  </div>
                </div>

                <div>
                  <ResultCausalView
                    parent_state = {this.state}
                    tiff_list = {tiff_list}
                  />
                </div>
              </div>

              <br />
              <Divider />
              <br />

              <ComparisonView
                parent_state = {this.state}
                tiff_list = {tiff_list}
              />
            </div>
          )} />
          <Route path='/cross' render={(props) => (
            <div>
              <div style={{marginLeft: 50, marginRight: 200, display: 'flex', justifyContent: 'space-between'}}>
                <TiffContainer
                  id="tiff_output"
                  canvas_width={this.state.canvas_width}
                  canvas_height={this.state.canvas_height}
                  clicked_point={this.state.clicked_point}
                  loupe_point={this.state.loupe_point}
                  selected_area={this.state.selected_area}
                  tiff_index={this.state.tiff_index}
                  tiff_list={tiff_list}
                />
              </div>

              <CrossCorrelationView
                parent_state = {this.state}
                tiff_list = {tiff_list}
              />
            </div>
          )} />
          <Route path='/threedim' render={(props) => (
              <ThreeDimView
                  parent_state = {this.state}
                  tiff_list = {tiff_list}
              />
          )} />
          <Route path='/graph' render={(props) => (
            <GraphView
              parent_state = {this.state}
              tiff_list = {tiff_list}
            />
          )} />

        </Switch>

      </div>
    );
  }
}