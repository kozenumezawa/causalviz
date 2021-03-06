import React from 'react';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';

import OverlayCanvas from './overlay-canvas.jsx';
import * as drawingTool from '../../utils/drawing-tool';

export default class ClusterCanvas extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
    drawingTool.drawFrame(this.canvas, this.ctx);
    this.renderData(this.props.cluster_list, this.props.loupe_point);
  }

  componentWillReceiveProps(nextProps) {
    this.renderData(nextProps.cluster_list, nextProps.loupe_point);
  }

  renderData(cluster_list, loupe_point) {
    if (cluster_list.length == 0) {
      return;
    }

    const n_clusters= Math.max.apply(null, cluster_list) + 1;
    const color_map = drawingTool.getColorCategory(n_clusters);
    
    for(let i = 0; i < cluster_list.length; i++) {
      this.ctx.fillStyle = color_map[cluster_list[i]];
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
              loupe_point={this.props.loupe_point}
              selected_area={this.props.selected_area}
            />
          </CardMedia>
        </Card>
      </div>
    );
  }
}
