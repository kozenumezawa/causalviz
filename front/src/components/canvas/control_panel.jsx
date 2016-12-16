import React from 'react'

import ClickedCanvas from './clicked_canvas.jsx'
import EventCanvas from './event_canvas.jsx'

export default class ControlPanel extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.tiff_list === undefined) {
      return null
    }
    
    const canvas = nextProps.tiff_list[nextProps.tiff_index];
    // this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.canvas.width, this.canvas.height);
    const ctx = canvas.getContext('2d');
    const tiff_image = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const tiff_rgba = tiff_image.data; // image_rgba = [R, G, B, A, R, G, B, A, ...] (hex data)

    // make a palatte
    for(let i = 0; i < tiff_rgba.length / 4; i++) {
      const r = tiff_rgba[i * 4 + 0];
      const g = tiff_rgba[i * 4 + 1];
      const b = tiff_rgba[i * 4 + 2];
      if(r == 0 && g == 0 && b == 0) {
        this.ctx.fillStyle='black';
      } else {
        this.ctx.fillStyle='white';
      }
      this.ctx.fillRect(i % this.canvas.width, i / this.canvas.width, 1, 1);
    }

    // magnify the area which is surrounded by a loupe
    if(nextProps.loupe_point.on == true && nextProps.loupe_point.x != -1) {
      const loupe_point = nextProps.loupe_point;
      const magnify_length = loupe_point.side * 2;
      const magnify_x = loupe_point.x - loupe_point.side;
      const magnify_y = loupe_point.y - loupe_point.side;

      const clipped_length = loupe_point.side;
      const clipped_x = loupe_point.x - clipped_length / 2;
      const clipped_y = loupe_point.y - clipped_length / 2;

      this.ctx.drawImage(this.canvas, clipped_x, clipped_y, clipped_length, clipped_length
        , magnify_x, magnify_y, magnify_length, magnify_length);
    }
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width="285" height="130" style={{left: 0, top: 0, zIndex: 0}}></canvas>
        <ClickedCanvas
          id={this.props.id}
          clicked_point={this.props.clicked_point}
          loupe_point={this.props.loupe_point}
        />
        <EventCanvas
          id={this.props.id}
          loupe_point={this.props.loupe_point}
        />
      </div>
    );
  }
}
