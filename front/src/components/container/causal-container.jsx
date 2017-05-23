import React from 'react';
import {Card, CardHeader, CardMedia, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton'
import PlayArrow from 'material-ui/svg-icons/AV/play-arrow';
import SkipNext from 'material-ui/svg-icons/AV/skip-next';
import SkipPrevious from 'material-ui/svg-icons/AV/skip-previous';

import * as drawingTool from '../../utils/drawing-tool';
import Actions from '../../actions/Actions';

import CausalCanvas from '../canvas/causal-canvas.jsx'

export default class CausalContainer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      tiff_index: 0
    };

    this.handleBeforeClick = this.handleBeforeClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePlayClick = this.handlePlayClick.bind(this);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');
  }

  componentWillReceiveProps(nextProps) {
    this.drawData(nextProps);
  }

  handleBeforeClick() {
    let before = this.state.tiff_index - 1;
    if (before === -1) {
      before = this.props.tiff_list.length - 1;
    }
    this.setState({
      tiff_index: before
    });
    this.drawData(this.props);
  }

  handleNextClick() {
    this.setState({
        tiff_index: this.getNextTiffIndex()
    });
    this.drawData(this.props);
  }

  handlePlayClick() {
    const playTiff = setInterval(() => {
      const next = this.getNextTiffIndex();
      this.setState({
        tiff_index: next
      });
      if (next === this.props.tiff_list.length - 1) {
        clearInterval(playTiff);
        this.setState({
          tiff_index: 0
        });
      }
      this.drawData(this.props);
    }, 100);
  }

  drawData(props) {
    if (props.tiff_list.length === 0) {
      return null
    }

    // draw a base image
    const canvas = props.tiff_list[this.state.tiff_index];
    this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.canvas.width, this.canvas.height);

    drawingTool.drawLoupeArea(this.canvas, this.ctx, props.loupe_point)
  }

  getNextTiffIndex() {
    const next = this.state.tiff_index + 1;
    if (next === this.props.tiff_list.length) {
      return 0;
    }
    return next;
  }

  render() {
    let frames = '- / -';
    if (this.props.tiff_list !== undefined) {
      frames = (this.state.tiff_index + 1) + ' / ' + this.props.tiff_list.length;
    }
    const card_width = (this.props.canvas_width > 230) ? this.props.canvas_width : 230;

    const title = this.props.opt_type || "Vector Field";

    return (
      <div>
        <Card
          style={{width: card_width}}
        >
          <CardHeader
            title={title}
            textStyle={{paddingRight: "0px"}}
          />
          <CardMedia>
            <div style={{height: this.props.canvas_height, position: 'relative', display: 'flex', justifyContent: 'center'}}>
              <canvas id={this.props.id} width={this.props.canvas_width} height={this.props.canvas_height} style={{position: 'absolute', width: this.props.canvas_width, minWidth: "0%", zIndex: 0}}></canvas>
              <CausalCanvas
                id={this.props.id}
                canvas_width={this.props.canvas_width}
                canvas_height={this.props.canvas_height}
                clicked_point={this.props.clicked_point}
                loupe_point={this.props.loupe_point}
                selected_area={this.props.selected_area}
                tiff_index={this.state.tiff_index}
                causal_data={this.props.causal_data}
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