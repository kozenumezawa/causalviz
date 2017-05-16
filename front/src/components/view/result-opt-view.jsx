import React from 'react';

import ResultContainer from '../container/result-container.jsx'

export default class ResultOptView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ResultContainer
          id="tiff_output_2"
          canvas_width={this.props.parent_state.canvas_width}
          canvas_height={this.props.parent_state.canvas_height}
          clicked_point={this.props.parent_state.clicked_point}
          loupe_point={this.props.parent_state.loupe_point}
          selected_area={this.props.parent_state.selected_area}
          tiff_index={this.props.parent_state.tiff_index}
          tiff_list={this.props.tiff_list}
          vector_fields={this.props.parent_state.vector_fields}
        />
      </div>
    );
  }
}
