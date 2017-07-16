import React from 'react';
import * as d3_scale from 'd3-scale';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';

import CorrelationCanvas from '../canvas/correlation-canvas.jsx'
import OverlayCanvas from '../canvas/overlay-canvas.jsx';
import ClusterThreeDim from '../three/cluster-three-dim.jsx'

import * as drawingTool from '../../utils/drawing-tool';
import * as pairTimeSeries from '../../utils/pair-time-series';
import generalConst from '../../constants/general-constants'

export default class CorrelationContainer extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    const card_width = (this.props.canvas_width > 190) ? this.props.canvas_width : 190;
    return (
      <div>
        <div style={{width: card_width}}>
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
              <div style={{height: this.props.canvas_height, position: 'relative', display: 'flex', justifyContent: 'center'}}>
                <CorrelationCanvas
                  id={this.props.id}
                  canvas_width={this.props.canvas_width}
                  canvas_height={this.props.canvas_height}
                  clicked_point={this.props.clicked_point}
                  cluster_list={this.props.cluster_list}
                  data_type={this.props.data_type}
                  highlighted_lines={this.props.highlighted_lines}
                  loupe_point={this.props.loupe_point}
                  selected_area={this.props.selected_area}
                />
                <OverlayCanvas
                  id={this.props.id + "_overlay"}
                  canvas_width={this.props.canvas_width}
                  canvas_height={this.props.canvas_height}
                  clicked_point={this.props.clicked_point}
                  selected_area={this.props.selected_area}
                  loupe_point={this.props.loupe_point}
                />
              </div>
            </CardMedia>
          </Card>
        </div>

        <div style={{top: 50, height: this.props.canvas_height, position: 'relative', display: 'flex', justifyContent: 'center'}}>
          <ClusterThreeDim
            canvas_width={this.props.canvas_width}
            canvas_height={this.props.canvas_height}
            cluster_list={this.props.cluster_list}
          />
        </div>
      </div>
    );
  }
}
