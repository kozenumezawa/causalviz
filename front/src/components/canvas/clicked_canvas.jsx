import React from 'react'

export default class ClickedCanvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id + 'clicked');
    this.ctx = this.canvas.getContext('2d');
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.clicked_point.x !== -1) {
      // draw a point
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle='white';
      this.ctx.fillRect(nextProps.clicked_point.x, nextProps.clicked_point.y, 2, 2);

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
  }
  
  render() {
    return (
      <div>
        <canvas id={this.props.id+'clicked'} width="285" height="130"  style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
      </div>
    );
  }
}


