import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton'
import PlayArrow from 'material-ui/svg-icons/AV/play-arrow';
import SkipNext from 'material-ui/svg-icons/AV/skip-next';
import SkipPrevious from 'material-ui/svg-icons/AV/skip-previous';

import ClickedCanvas from './canvas/clicked-canvas.jsx';
import EventCanvas from './canvas/event-canvas.jsx';
import * as drawingTool from '../utils/drawing-tool';
import Actions from '../actions/Actions';

export default class TiffContainerCard extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tiff_list.length === 0) {
      return null
    }

    // draw a base image
    const canvas = nextProps.tiff_list[nextProps.tiff_index];
    this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.canvas.width, this.canvas.height);

    drawingTool.drawLoupeArea(this.canvas, this.ctx, nextProps.loupe_point)
  }

  render() {
    return (
      <div>
        <Card
          containerStyle={{width: this.props.canvas_width}}
        >
          <CardHeader
            title="Ca2+ Response"
            textStyle={{paddingRight: "0px"}}
          />
          <CardMedia
            // style={{textAlign:"center"}}
          >
            <canvas id={this.props.id} width={this.props.canvas_width} height={this.props.canvas_height} style={{width: this.props.canvas_width, minWidth: "0%", left: 0, top: 0, zIndex: 0}}></canvas>
            <ClickedCanvas
              id={this.props.id}
              canvas_width={this.props.canvas_width}
              canvas_height={this.props.canvas_height}
              clicked_point={this.props.clicked_point}
              loupe_point={this.props.loupe_point}
            />
            <EventCanvas
              id={this.props.id}
              canvas_width={this.props.canvas_width}
              canvas_height={this.props.canvas_height}
              clicked_point={this.props.clicked_point}
              loupe_point={this.props.loupe_point}
            />
          </CardMedia>
          <CardActions>
            <IconButton tooltip="Before">
              <SkipPrevious />
            </IconButton>
            {/*<PlayArrow />*/}
            <IconButton tooltip="Next">
              <SkipNext />
            </IconButton>
          </CardActions>
        </Card>
      </div>
    );
  }
}