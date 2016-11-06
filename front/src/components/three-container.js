import React from 'react'

import ThreeRenderer from '../three-renderer'

export default class ThreeContainer extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="output_space">
        {(() => {
          if(this.props.raw_data != null) {
            this.ThreeRenderer = new ThreeRenderer(this.props.raw_data);
          }
        })()}
      </div>
    );
  }
}