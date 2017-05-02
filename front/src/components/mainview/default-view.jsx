import React from 'react';
import Chip from 'material-ui/Chip';
import {white} from 'material-ui/styles/colors';

import layoutConst from '../../constants/layout-constants'
import RelationCanvas from '../canvas/relation-canvas.jsx';
import GraphContainer from '../graph/graph-container.jsx';

export default class DefaultView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>
          <div style={{position: 'absolute', display: 'inline-block', top: layoutConst.SECOND_STAGE, left: layoutConst.LEFT_REF}}>
            <Chip backgroundColor={white}>
              {'Relation view'}
            </Chip>
          </div>
          <div style={{position: 'absolute', display: 'inline-block', top: layoutConst.SECOND_STAGE+40, left: layoutConst.LEFT_REF+30}}>
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
