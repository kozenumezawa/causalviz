import React from 'react';
import Chip from 'material-ui/Chip';
import {white} from 'material-ui/styles/colors';

import RelationCanvas from '../canvas/relation-canvas.jsx';
import ControlPanel from '../canvas/control-panel.jsx';
import GraphContainer from '../graph/graph-container.jsx';

export default class DefaultView extends React.Component {
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
        <div>
          <div style={{position: 'absolute', display: 'inline-block', top: top_relation, left: left_ref}}>
            <Chip backgroundColor={white}>
              {'Relation view'}
            </Chip>
          </div>
          <div style={{position: 'absolute', display: 'inline-block', top: top_relation+40, left: left_ref+30}}>
            <RelationCanvas
              id="relation_view"
              canvas_width={this.props.parent_state.canvas_width}
              canvas_height={this.props.parent_state.canvas_height}
              clicked_point={this.props.parent_state.clicked_point}
              loupe_point={this.props.parent_state.loupe_point}
              relation_list={this.props.parent_state.relation_list}
              tiff_index={this.props.parent_state.tiff_index}
              tiff_list={this.props.tiff_list}
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
              clicked_point={this.props.parent_state.clicked_point}
              loupe_point={this.props.parent_state.loupe_point}
              tiff_index={this.props.parent_state.tiff_index}
              tiff_list={this.props.tiff_list}
            />
          </div>
        </div>

        <div style={{position: 'absolute', display: 'inline-block', top: 200, left: 400}}>
          <GraphContainer
            id="time_series_graph_1"
            highlighted_line={this.props.parent_state.highlighted_line}
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
