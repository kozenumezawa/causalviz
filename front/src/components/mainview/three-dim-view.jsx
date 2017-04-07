import React from 'react';

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
        />
      </div>
    );
  }
}
