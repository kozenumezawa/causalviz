import React from 'react'

export default class TiffContainer extends React.Component{
  constructor(props) {
    super(props);
    this.display_canvas = null;
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
    const bias = 3;
    //  Element is created when first drawing
    if(this.display_canvas == null) {
      this.display_canvas = document.createElement('canvas');
      this.display_canvas.width = canvas.width * bias;
      this.display_canvas.height = canvas.height * bias;
      this.ctx = this.display_canvas.getContext('2d');
      this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width * bias, canvas.height * bias);

      const elem = document.getElementById('output_space');
      elem.appendChild(this.display_canvas);
    }
    this.ctx.beginPath();
    this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width * bias, canvas.height * bias);
    this.ctx.closePath();
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