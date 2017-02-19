import React from 'react';

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.legend_tiff === null) {
      return null
    }
    const canvas = nextProps.legend_tiff;
    this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width="256" height="32"></canvas>
      </div>
    );
  }
}