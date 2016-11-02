import React from 'react'

import ThreeRenderer from '../three-renderer'

export default class ThreeContainer extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.ThreeRenderer = new ThreeRenderer();
  }

  render() {
    return (
      <div id="output_space">
      </div>
    );
  }
}