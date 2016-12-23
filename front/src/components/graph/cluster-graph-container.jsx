import React from 'react'
import * as d3_scale from 'd3-scale'

import HighlightCanvas from './highlight-canvas.jsx'
import IndicatorCanvas from './indicator-canvas.jsx'
import * as drawingTool from '../../utils/drawing-tool'

export default class clusterGraphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.already_drawn = false;

  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    this.renderData(this.props.cluster_time_series, this.props.clustering_list);
  }

  componentWillReceiveProps(nextProps) {
    if(this.already_drawn === true) {
      return;
    }
    if(this.props.cluster_time_series.toString() !== nextProps.cluster_time_series.toString()) {
      this.renderData(nextProps.cluster_time_series, nextProps.clustering_list);
    }
  }

  renderData(time_series, clustering_list) {
    if(time_series.length === 0) {
      return;
    }

    let line_opts = {
      color: 'gray',
      width: 0.1
    };
    this.props.all_time_series.forEach((element, idx) => {
      if(clustering_list[idx] === 8) {
        drawingTool.lineGraph(this.canvas, element, line_opts);
      }
    });

    const color_map = d3_scale.schemeCategory20c;
    time_series.forEach((element, idx) => {
      line_opts = {
        color: color_map[idx],
        width: 1.5
      };
      drawingTool.lineGraph(this.canvas, element, line_opts);
    });
    this.already_drawn = true;
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
