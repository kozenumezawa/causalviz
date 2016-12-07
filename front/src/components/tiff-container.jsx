import React from 'react'

import ClickedCanvas from './canvas/clicked_canvas.jsx'
import EventCanvas from './canvas/event_canvas.jsx'

export default class TiffContainer extends React.Component{
  constructor(props) {
    super(props);
    this.display_canvas = null;
  }

  renderTiff() {
    if(this.props.tiff_list === undefined) {
      return null
    }
    this.appendCanvas(this.props.tiff_list[this.props.tiff_index]);
  }

  appendCanvas(canvas) {
    //  Element is created to draw for the first time
    if(this.display_canvas == null) {
      this.display_canvas = document.getElementById(this.props.id);
      this.ctx = this.display_canvas.getContext('2d');
      this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.display_canvas.width, this.display_canvas.height);
    }
    //  Update canvas
    this.ctx.beginPath();
    this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.display_canvas.width, this.display_canvas.height);
    this.ctx.closePath();
  }
  
  render() {
    return (
      <div>
        <canvas id={this.props.id} width="280" height="200" style={{left: 0, top: 0, zIndex: 0}}></canvas>
        <ClickedCanvas
          id={this.props.id}
          clicked_point={this.props.clicked_point}
        />
        <EventCanvas
          id={this.props.id}
        />
        
        {(() => {
          this.renderTiff();
        })()}
      </div>
    );
  }
}