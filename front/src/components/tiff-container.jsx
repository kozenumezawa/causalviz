import React from 'react';
import FlatButton from 'material-ui/FlatButton';

import ClickedCanvas from './canvas/clicked-canvas.jsx';
import EventCanvas from './canvas/event-canvas.jsx';
import * as drawingTool from '../utils/drawing-tool';
import Actions from '../actions/Actions';

export default class TiffContainer extends React.Component{
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
        <canvas id={this.props.id} width={this.props.canvas_width} height={this.props.canvas_height} style={{left: 0, top: 0, zIndex: 0}}></canvas>
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
          loupe_point={this.props.loupe_point}
        />
        <FlatButton
          label="Clear selection"
          style={{width: '50%'}}
          labelStyle={{fontSize: '10px'}}
          onClick={Actions.handleClearSelection}
        />
      </div>
    );
  }
}