import React from 'react'
import Chip from 'material-ui/Chip'
import {white} from 'material-ui/styles/colors'

import MaximumCanvas from '../canvas/maximum-canvas.jsx'
import MaximumSelector from '../input/maximum-selector.jsx'

export default class MaximumValueClusteringView extends React.Component {
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
            {'Maximum Value Cluster view'}
          </Chip>
        </div>
        <div style={{position: 'absolute', display: 'inline-block', top: top_relation+40, left: left_ref+30}}>
          <MaximumCanvas
            id="maximum_view"
            canvas_width={this.props.parent_state.canvas_width}
            canvas_height={this.props.parent_state.canvas_height}
            clicked_point={this.props.parent_state.clicked_point}
            loupe_point={this.props.parent_state.loupe_point}
            maximum_list={this.props.parent_state.maximum_list}
          />
        </div>
        <div style={{position: 'absolute', display: 'inline-block', top: top_relation+100, left: 400}}>
          <Chip backgroundColor={white}>
            {'Maximum Selector'}
          </Chip>
        </div>
        <div style={{position: 'absolute', display: 'inline-block', top: top_relation+150, left: 400}}>
          <MaximumSelector
            id="maximum_selector"
          />
        </div>
      </div>
    );
  }
}
