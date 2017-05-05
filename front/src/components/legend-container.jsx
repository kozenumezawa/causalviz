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
    this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width="256" height="32" style={{transform: "rotate(-90deg)"}}></canvas>
        {/*<div style={{position: 'relative', display: 'inline-block', top:0, left: 0}}> { 100 } </div>*/}
        {/*<div style={{position: 'relative', display: 'inline-block', top:0, left: 300}}> { 50 } </div>*/}
        {/*<div style={{position: 'relative', display: 'inline-block', top:0, left: 120}}> ΔF/F0(%)</div>*/}
        {/*<div style={{position: 'relative', display: 'inline-block', top:0, left: 300}}> { 0 } </div>*/}
        {/*<div style={{position: 'relative', display: 'inline-block', top:0, left: 300}}> { -50 } </div>*/}
      </div>
    );
  }
}