import React from 'react'
import Chip from 'material-ui/Chip'
import {white} from 'material-ui/styles/colors'

import Store from '../stores/Store'
import generalConstants from '../constants/general-constants'

import TiffContainer from './tiff-container.jsx'
import AppBar from './app-bar.jsx'
import StepButton from './button/step-button.jsx'
import GraphContainer from './graph/graph-container.jsx'
import ClusterGraphContainer from './graph/cluster-graph-container.jsx'
import CommandButton from './button/command-button.jsx'
import LegendContainer from './legend-container.jsx'
import ControlPanel from './canvas/control_panel.jsx'
import RelationCanvas from './canvas/relation_canvas.jsx'
import ClusteringCanvas from './canvas/clustering_canvas.jsx'

function getAllState() {
  return {
    all_tiff_list       : Store.getAllTiffList(),
    tiff_index          : Store.getTiffIndex(),
    legend_tiff         : Store.getLegendTiff(),
    all_time_series     : Store.getAllTimeSeries(),
    cluster_time_series : Store.getClusterTimeSeries(),
    relation_list       : Store.getRelationList(),
    highlighted_line    : Store.getHighlightedLine(),
    clicked_point       : Store.getClickedPoint(),
    loupe_point         : Store.getLoupePoint(),
    clustering_list     : Store.getClusteringList(),
    render_contents     : Store.getRenderContents()
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
    return (
      <div>
        <AppBar />
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
            tiff_list={this.state.all_tiff_list}
            tiff_index={this.state.tiff_index}
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
              tiff_list={this.state.all_tiff_list}
              tiff_index={this.state.tiff_index}
              clicked_point={this.state.clicked_point}
              loupe_point={this.state.loupe_point}
            />
          </div>
        </div>

        {(() => {
          if(this.state.render_contents === generalConstants.VIEW_DEFAULT) {
            return (
              <div>
                <div>
                  <div style={{position: 'absolute', display: 'inline-block', top: top_relation, left: left_ref}}>
                    <Chip backgroundColor={white}>
                      {'Relation view'}
                    </Chip>
                  </div>
                  <div style={{position: 'absolute', display: 'inline-block', top: top_relation+40, left: left_ref+30}}>
                    <RelationCanvas
                      id="relation_view"
                      tiff_list={this.state.all_tiff_list}
                      tiff_index={this.state.tiff_index}
                      clicked_point={this.state.clicked_point}
                      loupe_point={this.state.loupe_point}
                      relation_list={this.state.relation_list}
                    />
                  </div>
                </div>

                <div>
                  <div style={{position: 'absolute', display: 'inline-block', top: top_control, left: left_ref}}>
                    <Chip backgroundColor={white}>
                      {'Control panel'}
                    </Chip>
                  </div>

                  <div style={{position: 'absolute', display: 'inline-block', top: top_control+40, left: left_ref+30}}>
                    <ControlPanel
                      id="control_panel"
                      tiff_list={this.state.all_tiff_list}
                      tiff_index={this.state.tiff_index}
                      clicked_point={this.state.clicked_point}
                      loupe_point={this.state.loupe_point}
                    />
                  </div>
                </div>

                <div style={{position: 'absolute', display: 'inline-block', top: 200, left: 400}}>
                  <GraphContainer
                    id="time_series_graph_1"
                    line_color="green"
                    tiff_list={this.state.all_tiff_list}
                    tiff_index={this.state.tiff_index}
                    time_series={this.state.all_time_series}
                    highlighted_line={this.state.highlighted_line}
                  />
                </div>
              </div>
            );
          } else {
            return (
              <div>
                <div style={{position: 'absolute', display: 'inline-block', top: top_relation, left: left_ref}}>
                  <Chip backgroundColor={white}>
                    {'Clustering view'}
                  </Chip>
                </div>
                <div style={{position: 'absolute', display: 'inline-block', top: top_relation+40, left: left_ref+30}}>
                  <ClusteringCanvas
                    id="clustering_view"
                    clustering_list={this.state.clustering_list}
                  />
                </div>
                <div style={{position: 'absolute', display: 'inline-block', top: 200, left: 400}}>
                  <ClusterGraphContainer
                    id="cluster_graph"
                    tiff_list={this.state.all_tiff_list}
                    tiff_index={this.state.tiff_index}
                    all_time_series={this.state.all_time_series}
                    cluster_time_series={this.state.cluster_time_series}
                    highlighted_line={this.state.highlighted_line}
                    clustering_list={this.state.clustering_list}
                  />
                </div>
              </div>
            );
          }
        })()}

        <div style={{position: 'absolute', display: 'inline-block', top: 1000, left: left_ref}}>
          <CommandButton />
        </div>

        <div>
          <div style={{position: 'absolute', display: 'inline-block', top:190, left: 370}}> 255 </div>
          <div style={{position: 'absolute', display: 'inline-block', top:340, left: 375}}> 0 </div>

          <div style={{position: 'absolute', display: 'inline-block', top:350, left: 395}}> 1 </div>
          <div style={{position: 'absolute', display: 'inline-block', top:350, left: 565}}> time step </div>
          <div style={{position: 'absolute', display: 'inline-block', top:350, left: 810}}> 130 </div>
        </div>
      </div>
    );
  }
}