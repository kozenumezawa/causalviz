import React from 'react';

import ResultContainer from '../container/result-container.jsx'

export default class ComparisonView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div style={{fontSize: 16}}>Comparison view</div>
        <br />

        <div style={{marginLeft: 50, marginRight: 200,display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <ResultContainer
              id="tiff_output_3"
              canvas_width={this.props.parent_state.canvas_width}
              canvas_height={this.props.parent_state.canvas_height}
              clicked_point={this.props.parent_state.clicked_point}
              loupe_point={this.props.parent_state.loupe_point}
              selected_area={this.props.parent_state.selected_area}
              tiff_index={this.props.parent_state.tiff_index}
              tiff_list={this.props.tiff_list}
              vector_fields={this.props.parent_state.vector_fields}
            />
            <ResultContainer
              id="tiff_output_4"
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
          <div>
            b
          </div>
          <div>
            c
          </div>
        </div>
      </div>
    );
  }
}
