import React from 'react'
import TiffViewer from '../tiff-viewer'

export default class TiffContainer extends React.Component{
  constructor(props) {
    super(props);
    this.tiff_viewer = new TiffViewer();
  }

  componentDidMount() {
  }

  getRenderTiffList() {
    let key = 0;
    const tiff_list = this.tiff_viewer.getTiffList();
    const renderList = tiff_list.map((tiffFile) => {
      return (
        <div key={key++}>{tiffFile}</div>
      );
    });
    return (
      <div>
        {renderList}
      </div>
    );
  }

  render() {
    return (
      <div id="output_space">
        {(() => {
          this.getRenderTiffList()
        })()}
      </div>
    );
  }
}