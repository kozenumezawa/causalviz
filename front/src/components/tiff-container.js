import React from 'react'
import Action from '../actions/Actions'

export default class TiffContainer extends React.Component{
  constructor(props) {
    super(props);
    this.display_canvas = null;
    this.onClickCanvas = this.onClickCanvas.bind(this);
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
    //  Element is created when first drawing
    if(this.display_canvas == null) {
      this.display_canvas = document.getElementById(this.props.id);
      this.ctx = this.display_canvas.getContext('2d');
      this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.display_canvas.width, this.display_canvas.height);

      const overlapped_canvas = document.getElementById(this.props.id + 'overlapped');
      overlapped_canvas.addEventListener('click', this.onClickCanvas, false);
    }
    //  Update canvas
    this.ctx.beginPath();
    this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.display_canvas.width, this.display_canvas.height);
    this.ctx.closePath();
  }

  onClickCanvas(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    Action.handleTiffClick(x, y);

    // draw a point
    const overlapped_canvas = document.getElementById(this.props.id + 'overlapped');
    const ctx = overlapped_canvas.getContext('2d');
    ctx.clearRect(0, 0, overlapped_canvas.width, overlapped_canvas.height);
    ctx.fillStyle='orange';
    ctx.fillRect(x, y, 2, 2);
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width="280" height="200" style={{left: 0, top: 0, zIndex: 0}}></canvas>
        <canvas id={this.props.id+'overlapped'} width="280" height="200" style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
        
        {(() => {
          this.renderTiff();
        })()}
      </div>
    );
  }
}