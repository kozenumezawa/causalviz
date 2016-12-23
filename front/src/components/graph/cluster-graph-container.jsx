import React from 'react'
import * as d3_scale from 'd3-scale'

import HighlightCanvas from './highlight-canvas.jsx'
import IndicatorCanvas from './indicator-canvas.jsx'
import * as drawingTool from '../../utils/drawing-tool'

export default class clusterGraphContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    this.renderData(this.props.cluster_time_series, this.props.clustering_list, this.props.highlighted_line);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.highlighted_line !== nextProps.highlighted_line) {
      this.renderData(nextProps.cluster_time_series, nextProps.clustering_list, nextProps.highlighted_line);
    }

    if(this.props.cluster_time_series.toString() !== nextProps.cluster_time_series.toString()) {
      this.renderData(nextProps.cluster_time_series, nextProps.clustering_list, nextProps.highlighted_line);
    }
  }

  renderData(time_series, clustering_list, highlighted_line) {
    if(time_series.length === 0) {
      return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const color_map = d3_scale.schemeCategory20c;
    if(highlighted_line !== -1) {
      let line_opts = {
        color: 'gray',
        width: 0.1
      };
      const selected_cluster = clustering_list[highlighted_line];
      this.props.all_time_series.forEach((element, idx) => {
        if(clustering_list[idx] === selected_cluster) {
          drawingTool.lineGraph(this.canvas, element, line_opts);
        }
      });
      line_opts.color = color_map[selected_cluster];
      line_opts.width = 1.5;
      drawingTool.lineGraph(this.canvas, time_series[selected_cluster], line_opts);
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
          highlight_time_series={this.props.cluster_time_series[this.props.highlighted_line]}
        />
        <IndicatorCanvas
          id={this.props.id}
          tiff_list={this.props.tiff_list}
          tiff_index={this.props.tiff_index}
        />
      </div>
    );
  }
}
