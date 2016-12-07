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
    }
  }
  
  render() {
    return (
      <div>
        <canvas id={this.props.id+'clicked'} width="280" height="200" style={{position: 'absolute', display: 'block', top: 0, zIndex: 1}}></canvas>
      </div>
    );
  }
}


