import React from 'react';
import Chip from 'material-ui/Chip';
import {white} from 'material-ui/styles/colors';

import layoutConst from '../../constants/layout-constants'
import MaximumCanvas from '../canvas/maximum-canvas.jsx';
import MaximumSelector from '../input/maximum-selector.jsx';

export default class MaximumValueClusteringView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div style={{position: 'absolute', display: 'inline-block', top: layoutConst.SECOND_STAGE, left: layoutConst.LEFT_REF}}>
          <Chip backgroundColor={white}>
            {'Maximum Value Cluster view'}
          </Chip>
        </div>
        <div style={{position: 'absolute', display: 'inline-block', top: layoutConst.SECOND_STAGE+40, left: layoutConst.LEFT_REF+30}}>
          <MaximumCanvas
            id="maximum_view"
            canvas_width={this.props.parent_state.canvas_width}
            canvas_height={this.props.parent_state.canvas_height}
            clicked_point={this.props.parent_state.clicked_point}
            loupe_point={this.props.parent_state.loupe_point}
            maximum_list={this.props.parent_state.maximum_list}
          />
        </div>
        <div style={{position: 'absolute', display: 'inline-block', top: layoutConst.SECOND_STAGE+100, left: 400}}>
          <Chip backgroundColor={white}>
            {'Maximum Selector'}
          </Chip>
        </div>
        <div style={{position: 'absolute', display: 'inline-block', top: layoutConst.SECOND_STAGE+150, left: 400}}>
          <MaximumSelector
            id="maximum_selector"
          />
        </div>
      </div>
    );
  }
}
