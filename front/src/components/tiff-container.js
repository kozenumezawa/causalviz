import React from 'react'
import Action from '../actions/Actions'

export default class TiffContainer extends React.Component{
  constructor(props) {
    super(props);
    this.display_canvas = null;
  }

  componentDidMount() {
  }

  renderTiff() {
    if(this.props.tiff_list === undefined) {
      return null
    }
    this.appendCanvas(this.props.tiff_list[this.props.tiff_index]);
  }

  appendCanvas(canvas) {
    const bias = this.props.canvas_scale;
    //  Element is created when first drawing
    if(this.display_canvas == null) {
      this.display_canvas = document.createElement('canvas');
      this.display_canvas.width = canvas.width * bias;
      this.display_canvas.height = canvas.height * bias;
      this.ctx = this.display_canvas.getContext('2d');
      this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width * bias, canvas.height * bias);

      const elem = document.getElementById(this.props.id);
      elem.appendChild(this.display_canvas);
    }
    //  Update canvas
    this.ctx.beginPath();
    this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width * bias, canvas.height * bias);
    this.ctx.closePath();

    this.display_canvas.addEventListener('click', this.onClickCanvas, false);
  }

  onClickCanvas(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    Action.handleTiffClick(x, y);
  }

  render() {
    return (
      <div id={this.props.id}>
        {(() => {
          this.renderTiff();
        })()}
      </div>
    );
  }
}