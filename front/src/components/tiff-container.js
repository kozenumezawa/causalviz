import React from 'react'
import TiffViewer from '../tiff-viewer'

export default class TiffContainer extends React.Component{
  constructor(props) {
    super(props);
    this.tiff_viewer = new TiffViewer();
  }

  componentDidMount() {
  }
  
  getRenderPngList() {
    let key = 0;
    const png_list = this.tiff_viewer.getPngList();
    const render_list = png_list.map((pngFile) => {
      return (
        <div key={key++}>
          <img src={pngFile} />
        </div>
      );
    });

    return (
      <div>
        {render_list}
      </div>
    );
  }

  render() {
    return (
      <div id="output_space">
        {(() => {
          return this.getRenderPngList();
        })()}

      </div>
    );
  }
}