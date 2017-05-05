import React from 'react';
import * as d3_scale from 'd3-scale';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';

import OverlayCanvas from './overlay-canvas.jsx';
import ClusterThreeDim from '../three/cluster-three-dim.jsx'

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
    if (cluster_list.length == 0) {
      return;
    }

    const color_map = d3_scale.schemeCategory20c;
    for(let i = 0; i < cluster_list.length; i++) {
      if (cluster_list[i] === pairTimeSeries.error) {
        this.ctx.fillStyle = 'black'
      } else if (selected_area.on === false && this.props.data_type === generalConst.DATA_WILD_TYPE && i % this.canvas.width > 250 && cluster_list[i] !== pairTimeSeries.error) {
        this.ctx.fillStyle = 'white'
      } else if (selected_area.on === false && this.props.data_type === generalConst.DATA_TRP_TYPE && i % this.canvas.width >= 65 && i / this.canvas.height >= 88 && cluster_list[i] !== pairTimeSeries.error) {
        this.ctx.fillStyle = 'white'
      } else if (selected_area.on === true && highlighted_lines.indexOf(i) !== -1) {
        this.ctx.fillStyle = 'white'
      } else {
        this.ctx.fillStyle = color_map[cluster_list[i]];
      }
      this.ctx.fillRect(i % this.canvas.width, i / this.canvas.width, 1, 1);
    }

    drawingTool.drawLoupeArea(this.canvas, this.ctx, loupe_point);
  }

  render() {
    const card_width = (this.props.canvas_width > 190) ? this.props.canvas_width : 190;
    return (
      <div>
        <Card
          containerStyle={{width: card_width}}
        >
          <CardHeader
            title={this.props.title_text}
            textStyle={{paddingRight: "0px"}}
          />
          <CardMedia
            //style={{textAlign:"center"}}
          >
            <canvas id={this.props.id} width={this.props.canvas_width} height={this.props.canvas_height} style={{width: this.props.canvas_width, minWidth: "0%", left: 0, top: 0, zIndex: 0}}></canvas>
            <OverlayCanvas
              id={this.props.id}
              canvas_width={this.props.canvas_width}
              canvas_height={this.props.canvas_height}
              clicked_point={this.props.clicked_point}
              selected_area={this.props.selected_area}
              loupe_point={this.props.loupe_point}
            />
          </CardMedia>
        </Card>

        <ClusterThreeDim
          canvas_width={this.props.canvas_width}
          canvas_height={this.props.canvas_height}
          cluster_list={this.props.cluster_list}
        />
      </div>
    );
  }
}
