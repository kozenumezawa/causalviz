import React from 'react';

import * as drawingTool from '../../utils/drawing-tool';
import * as pairTimeSeries from '../../utils/pair-time-series';
import generalConst from '../../constants/general-constants'

export default class CorrelationCanvas extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');

    drawingTool.drawFrame(this.canvas, this.ctx);
    this.renderData(this.props.cluster_list, this.props.loupe_point, this.props.selected_area, this.props.highlighted_lines);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps.cluster_list, nextProps.loupe_point, nextProps.selected_area, nextProps.highlighted_lines);
  }

  renderData(cluster_list, loupe_point, selected_area, highlighted_lines) {
    if (cluster_list == null || cluster_list.length === 0) {
      return;
    }

    const n_clusters= Math.max.apply(null, cluster_list) + 1;
    const color_map = drawingTool.getColorCategory(n_clusters);

    for(let i = 0; i < cluster_list.length; i++) {
      if (cluster_list[i] === pairTimeSeries.error) {
        this.ctx.fillStyle = 'black'
      } else if (selected_area.on === false && this.props.data_type === generalConst.DATA_WILD_TYPE && i % this.canvas.width > 250 && cluster_list[i] !== pairTimeSeries.error) {
        this.ctx.fillStyle = 'white'
      } else if (selected_area.on === false && this.props.data_type === generalConst.DATA_TRP_TYPE && i % this.canvas.width >= 65 && i / this.canvas.height >= 76 && cluster_list[i] !== pairTimeSeries.error) {
        this.ctx.fillStyle = 'white'
      } else if (selected_area.on === true && highlighted_lines.indexOf(i) !== -1) {
        this.ctx.fillStyle = 'white'
      } else if (cluster_list[i] === -10) {
        this.ctx.fillStyle = 'black'
      } else {
        this.ctx.fillStyle = color_map[cluster_list[i]];
      }
      this.ctx.fillRect(i % this.canvas.width, i / this.canvas.width, 1, 1);
    }

    drawingTool.drawLoupeArea(this.canvas, this.ctx, loupe_point);
  }

  render() {
    return (
      <canvas id={this.props.id} width={this.props.canvas_width} height={this.props.canvas_height} style={{position: 'absolute', width: this.props.canvas_width, minWidth: "0%", zIndex: 0}}></canvas>
    );
  }
}
