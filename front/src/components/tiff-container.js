import React from 'react'
import TiffViewer from '../tiff-viewer'

export default class TiffContainer extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let test = new TiffViewer();
  }

  render() {
    return (
      <div id="output_space">
      </div>
    );
  }
}