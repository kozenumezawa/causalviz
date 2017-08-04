import React from 'react';

import generalConst from '../constants/general-constants'

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.renderCanvas = this.renderCanvas.bind(this);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');

    this.drawData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.drawData(nextProps);
  }

  drawData(props) {
    if (props.legend_tiff === null) {
      return null
    }
    const canvas = props.legend_tiff;
    this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  }

  renderCanvas() {
    let left = 150;
    switch (this.props.render_contents) {
      case generalConst.VIEW_CROSS_CORRELATION:
        if (this.props.data_type === generalConst.DATA_WILD_TYPE) {
          left += 50;
        }
        return (
          <canvas id={this.props.id} width="256" height="32" style={{position: "absolute", top: -190, left: left, transform: "rotate(-90deg)"}}></canvas>
        );
      case generalConst.VIEW_GRANGER_CAUSALITY:
        if (this.props.data_type === generalConst.DATA_WILD_TYPE) {
          left += 50;
        }
        return (
          <canvas id={this.props.id} width="256" height="32" style={{position: "absolute", top: -190, left: left, transform: "rotate(-90deg)"}}></canvas>
        );
      case generalConst.VIEW_DEFAULT:
        return (
          <div>
            <canvas id={this.props.id} width="256" height="32"></canvas>
            <div style={{width: 256, display: 'flex', justifyContent: 'space-between'}}>
              <div> -50 </div>
              <div> ΔF/F0(%)</div>
              <div> 100 </div>
            </div>
          </div>
        );
      default:
        return (
          <div>

          </div>
        );
    }
  }

  render() {
    return (
      <div>
        { (() => {
          return this.renderCanvas()
          })()
        }
      </div>
    );
  }
}