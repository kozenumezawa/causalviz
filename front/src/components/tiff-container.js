import React from 'react'
import TiffViewer from '../tiff-viewer'

export default class TiffContainer extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  renderTiff() {
    if(this.props.tiff_list.length == 0) {
      return null
    }
    this.appendCanvas(this.props.tiff_list[this.props.tiff_index]);
  }

  appendCanvas(canvas) {
    const display_canvas = document.createElement('canvas');
    const bias = 3;
    display_canvas.width = canvas.width * bias;
    display_canvas.height = canvas.height * bias;
    const ctx = display_canvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width * bias, canvas.height * bias);

    const elem = document.getElementById('output_space');
    elem.appendChild(display_canvas);
  }

  render() {
    return (
      <div id="output_space">
        {(() => {
          this.renderTiff();
        })()}

      </div>
    );
  }
}