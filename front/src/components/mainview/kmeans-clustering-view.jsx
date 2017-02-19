import React from 'react';
import Chip from 'material-ui/Chip';
import {white} from 'material-ui/styles/colors';

import ClusterCanvas from '../canvas/cluster-canvas.jsx';
import ClusterSelectedCanvas from '../canvas/cluster-selected-canvas.jsx';
import ClusterGraphContainer from '../graph/cluster-graph-container.jsx';
import ClusterButton from '../input/cluster-button.jsx';

export default class KmeansClusteringView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const left_ref = 30;
    const top_response = 150;
    const top_relation = 350;
    const top_control = 550;
    return (
      <div>
        <div style={{position: 'absolute', display: 'inline-block', top: top_relation, left: left_ref}}>
          <Chip backgroundColor={white}>
            {'Cluster view'}
          </Chip>
        </div>
        <div style={{position: 'absolute', display: 'inline-block', top: top_relation+40, left: left_ref+30}}>
          <ClusterCanvas
            id="cluster_view"
            canvas_width={this.props.parent_state.canvas_width}
            canvas_height={this.props.parent_state.canvas_height}
            clicked_point={this.props.parent_state.clicked_point}
            cluster_list={this.props.parent_state.cluster_list}
            loupe_point={this.props.parent_state.loupe_point}
          />
        </div>
        <div style={{position: 'absolute', display: 'inline-block', top: top_control, left: left_ref}}>
          <Chip backgroundColor={white}>
            {'Selected Cluster view'}
          </Chip>
        </div>
        <div style={{position: 'absolute', display: 'inline-block', top: top_control+40, left: left_ref+30}}>
          <ClusterSelectedCanvas
            id="cluster_detail_view"
            canvas_width={this.props.parent_state.canvas_width}
            canvas_height={this.props.parent_state.canvas_height}
            checked_cluster={this.props.parent_state.checked_cluster}
            clicked_point={this.props.parent_state.clicked_point}
            cluster_list={this.props.parent_state.cluster_list}
            loupe_point={this.props.parent_state.loupe_point}
          />
        </div>
        <div style={{position: 'absolute', display: 'inline-block', top: 200, left: 400}}>
          <ClusterGraphContainer
            id="cluster_graph"
            all_time_series={this.props.parent_state.all_time_series}
            cluster_time_series={this.props.parent_state.cluster_time_series}
            cluster_list={this.props.parent_state.cluster_list}
            highlighted_line={this.props.parent_state.highlighted_line}
            tiff_index={this.props.parent_state.tiff_index}
            tiff_list={this.props.tiff_list}
          />
        </div>
        <div style={{position: 'absolute', display: 'inline-block', top: top_relation+100, left: 400}}>
          <Chip backgroundColor={white}>
            {'Cluster list'}
          </Chip>
          <ClusterButton
            id="cluster_button"
            checked_cluster={this.props.parent_state.checked_cluster}
            cluster_list={this.props.parent_state.cluster_list}
            slider_value={this.props.parent_state.slider_value}
          />
        </div>
      </div>
    );
  }
}
