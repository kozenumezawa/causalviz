import React from 'react';

import GraphLegend from './graph-legend.jsx'
import HighlightCanvas from './highlight-canvas.jsx';
import IndicatorCanvas from './indicator-canvas.jsx';
import * as drawingTool from '../../utils/drawing-tool';

export default class clusterGraphContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    drawingTool.drawFrame(this.canvas, this.ctx);
    this.renderData(this.props.cluster_time_series, this.props.cluster_list, this.props.highlighted_lines);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.highlighted_lines !== nextProps.highlighted_lines) {
      this.renderData(nextProps.cluster_time_series, nextProps.cluster_list, nextProps.highlighted_lines);
    }

    if (this.props.cluster_time_series.toString() !== nextProps.cluster_time_series.toString()) {
      this.renderData(nextProps.cluster_time_series, nextProps.cluster_list, nextProps.highlighted_lines);
    }
  }

  renderData(time_series, cluster_list, highlighted_lines) {
    if (time_series.length === 0) {
      return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    drawingTool.drawFrame(this.canvas, this.ctx);

    const n_clusters= Math.max.apply(null, cluster_list) + 1;
    const color_map = drawingTool.getColorCategory(n_clusters);
    if (highlighted_lines.length !== 0) {
      // Selected cluster must be displayed
      // let line_opts = {
      //   color: 'gray',
      //   width: 0.1
      // };
      // const selected_cluster = cluster_list[highlighted_lines[0]];
      // this.props.all_time_series.forEach((element, idx) => {
      //   if (cluster_list[idx] === selected_cluster) {
      //     drawingTool.lineGraph(this.canvas, element, line_opts);
      //   }
      // });
      // line_opts.color = color_map[selected_cluster];
      // line_opts.width = 1.5;
      // drawingTool.lineGraph(this.canvas, time_series[selected_cluster], line_opts);
    } else {
      time_series.forEach((element, idx) => {
        const line_opts = {
          color: color_map[idx],
          width: 1.5
        };
        drawingTool.lineGraph(this.canvas, element, line_opts);
      });
    }
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width="420" height="150" style={{left: 0, top: 0, zIndex: 0}}></canvas>
        <HighlightCanvas
          id={this.props.id}
          line_color={'black'}
          line_width={2}
          highlight_time_series={this.props.cluster_time_series[this.props.highlighted_lines]}
        />
        <IndicatorCanvas
          id={this.props.id}
          tiff_list={this.props.tiff_list}
          tiff_index={this.props.tiff_index}
        />

        <GraphLegend
          tiff_list={this.props.tiff_list}
        />
      </div>
    );
  }
}
