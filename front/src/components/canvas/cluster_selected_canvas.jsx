import React from 'react'

import ClickedCanvas from './clicked_canvas.jsx'
import EventCanvas from './event_canvas.jsx'
import * as drawingTool from '../../utils/drawing-tool'

export default class ClusterDetailCanvas extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    this.drawFrame();
    this.renderData(this.props.cluster_list, this.props.loupe_point, this.props.checked_cluster);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps.cluster_list, nextProps.loupe_point, nextProps.checked_cluster);
  }

  renderData(cluster_list, loupe_point, checked_cluster) {
    if(cluster_list.length == 0) {
      return;
    }

    const n_clusters= Math.max.apply(null, cluster_list) + 1;
    const color_map = drawingTool.getColorCategory(n_clusters);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawFrame();
    for(let i = 0; i < cluster_list.length; i++) {
      for(let cluster_number = 0; cluster_number < checked_cluster.length; cluster_number++) {
        if(checked_cluster[cluster_number] === false){
          continue;
        }
        if(cluster_list[i] === cluster_number) {
          this.ctx.fillStyle = color_map[cluster_list[i]];
          this.ctx.fillRect(i % this.canvas.width, i / this.canvas.width, 1, 1);
          break;
        }
      }
    }

    // drawingTool.drawLoupeArea(this.canvas, this.ctx, loupe_point);
  }

  drawFrame() {
    // draw a frame
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.canvas.width, 0);
    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.lineTo(0, 0);
    this.ctx.stroke();
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