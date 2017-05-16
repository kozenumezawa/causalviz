import React from 'react';
import {Card, CardHeader, CardMedia, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton'
import PlayArrow from 'material-ui/svg-icons/AV/play-arrow';
import SkipNext from 'material-ui/svg-icons/AV/skip-next';
import SkipPrevious from 'material-ui/svg-icons/AV/skip-previous';

import * as drawingTool from '../../utils/drawing-tool';
import Actions from '../../actions/Actions';

import VectorCanvas from '../canvas/vector-canvas.jsx'

export default class ResultContainer extends React.Component{
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

  handleBeforeClick() {
    Actions.handleBeforeClick();
  }

  handleNextClick() {
    Actions.handleNextClick();
  }

  handlePlayClick() {
    Actions.handlePlayClick();
  }

  render() {
    let frames = '- / -';
    if (this.props.tiff_list !== undefined) {
      frames = (this.props.tiff_index + 1) + ' / ' + this.props.tiff_list.length;
    }
    const card_width = (this.props.canvas_width > 230) ? this.props.canvas_width : 230;
    return (
      <div>
        <Card
          style={{width: card_width}}
        >
          <CardHeader
            title="Vector Field"
            textStyle={{paddingRight: "0px"}}
          />
          <CardMedia>
            <div style={{height: this.props.canvas_height, position: 'relative', display: 'flex', justifyContent: 'center'}}>
              <canvas id={this.props.id} width={this.props.canvas_width} height={this.props.canvas_height} style={{position: 'absolute', width: this.props.canvas_width, minWidth: "0%", zIndex: 0}}></canvas>
              <VectorCanvas
                id={this.props.id}
                canvas_width={this.props.canvas_width}
                canvas_height={this.props.canvas_height}
                clicked_point={this.props.clicked_point}
                loupe_point={this.props.loupe_point}
                selected_area={this.props.selected_area}
                tiff_index={this.props.tiff_index}
                vector_fields={this.props.vector_fields}
              />
            </div>
          </CardMedia>
          <CardText
            style={{padding: '0px'}}
          >
            <IconButton
              tooltip="Before"
              style={{top: '5px'}}
              onClick={this.handleBeforeClick}
            >
              <SkipPrevious />
            </IconButton>
            { frames }
            <IconButton
              tooltip="Next"
              style={{top: '5px'}}
              onClick={this.handleNextClick}
            >
              <SkipNext />
            </IconButton>

            <IconButton
              tooltip="Play"
              style={{top: '5px', right: 0}}
              onClick={this.handlePlayClick}
            >
              <PlayArrow />
            </IconButton>
          </CardText>
        </Card>
      </div>
    );
  }
}