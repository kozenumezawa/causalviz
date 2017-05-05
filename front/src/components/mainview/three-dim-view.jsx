import React from 'react';

import GraphContainer from '../graph/graph-container.jsx'
import TiffThreeDim from '../three/tiff-three-dim.jsx'

export default class ThreeDimView extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <TiffThreeDim
          canvas_width={this.props.parent_state.canvas_width}
          canvas_height={this.props.parent_state.canvas_height}
          tiff_list={this.props.tiff_list}
          tiff_index={this.props.parent_state.tiff_index}
          time_series={this.props.parent_state.all_time_series}
        />

        <div style={{position: 'absolute', display: 'inline-block', top: 200, left: 400}}>
          <GraphContainer
            id="time_series_graph_1"
            highlighted_lines={this.props.parent_state.highlighted_lines}
            line_color="green"
            tiff_index={this.props.parent_state.tiff_index}
            tiff_list={this.props.tiff_list}
            time_series={this.props.parent_state.all_time_series}
          />
        </div>
      </div>
    );
  }
}
