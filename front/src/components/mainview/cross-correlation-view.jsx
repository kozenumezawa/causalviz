import React from 'react';
import Chip from 'material-ui/Chip';
import {white} from 'material-ui/styles/colors';

import Store from '../../stores/Store';
import layoutConst from '../../constants/layout-constants'
import CorrelationContainer from '../container/correlation-container.jsx';
import ClusterGraphContainer from '../graph/cluster-graph-container.jsx';
import ClusterButton from '../input/cluster-button.jsx';

export default class CrossCorrelationView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div style={{position: 'absolute', display: 'inline-block', top: layoutConst.SECOND_STAGE+40, left: layoutConst.LEFT_REF+30}}>
          <CorrelationContainer
            id="cross_correlation_view"
            canvas_width={this.props.parent_state.canvas_width}
            canvas_height={this.props.parent_state.canvas_height}
            clicked_point={this.props.parent_state.clicked_point}
            cluster_list={this.props.parent_state.tau_list}
            data_type={this.props.parent_state.data_type}
            highlighted_lines={this.props.parent_state.highlighted_lines}
            title_text={"Time lag view"}
            selected_area={this.props.parent_state.selected_area}
            loupe_point={this.props.parent_state.loupe_point}
          />
        </div>

        <div style={{position: 'absolute', display: 'inline-block', top: 200, left: 250 + this.props.parent_state.canvas_width}}>
          <ClusterGraphContainer
            id="correlation_graph"
            all_time_series={Store.getCutTimeSeries()}
            cluster_time_series={this.props.parent_state.corr_time_series}
            cluster_list={this.props.parent_state.tau_list}
            highlighted_lines={this.props.parent_state.highlighted_lines}
            tiff_index={this.props.parent_state.tiff_index}
            tiff_list={this.props.tiff_list}
          />
        </div>

        <div style={{position: 'absolute', display: 'inline-block', top: layoutConst.SECOND_STAGE+100, left: 400}}>
          <Chip backgroundColor={white}>
            {'lag list'}
          </Chip>
          <ClusterButton
            id="tau_button"
            checked_cluster={this.props.parent_state.checked_cluster}
            cluster_list={this.props.parent_state.tau_list}
            slider_value={this.props.parent_state.slider_value}
          />
        </div>
      </div>
    );
  }
}
