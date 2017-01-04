import React from 'react'
import * as d3_scale from 'd3-scale'

import Actions from '../../actions/Actions'

const color_map = d3_scale.schemeCategory20c;
let line_heights = [];

export default class maximumSelector extends React.Component {
  constructor(props) {
    super(props);
    this.mouse_down = false;

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.ctx = this.canvas.getContext('2d');

    for(let i = 0, len = 6 + 1; i < len; i++) {
      line_heights[i] = this.canvas.height / 6 * i;
    }
    this.paintCanvas();

    this.canvas.addEventListener('mousedown', this.mouseDown)
    this.canvas.addEventListener('mousemove', this.mouseMove)
    this.canvas.addEventListener('mouseup', this.mouseUp)
    this.canvas.addEventListener('mouseout', this.mouseOut);
  }

  paintCanvas() {
    for(let i = 1, len = line_heights.length; i < len; i++) {
      this.ctx.fillStyle = color_map[i];
      const height = line_heights[i] - line_heights[i - 1];
      this.ctx.fillRect(0, line_heights[i - 1], this.canvas.width, height);
    }
  }

  mouseDown(e) {
    this.updateLineHeightsByMouse(e);
    this.mouse_down = true;
  }

  mouseMove(e) {
    if(this.mouse_down === false) {
      return;
    }
    this.updateLineHeightsByMouse(e);
  }

  mouseUp(e) {
    this.mouse_down = false;
  }

  mouseOut(e) {
    if(this.mouse_down === true) {
      this.mouse_down = false;
    }
  }

  updateLineHeightsByMouse(e) {
    const rect = e.target.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const nearest_idx = this.searchNearestLineIndex(y);

    line_heights[nearest_idx] = y;
    this.paintCanvas();
  }

  searchNearestLineIndex(y) {
    let minimum_distance = 10000;
    let nearest_index = 0;

    line_heights.forEach((height, idx) => {
      const distance = Math.abs(y - height);
      if(distance < minimum_distance) {
        minimum_distance = distance;
        nearest_index = idx;
      }
    });

    if(nearest_index === 0) {
      nearest_index += 1;
    }
    return nearest_index;
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width="420" height="150"></canvas>
      </div>
    );
  }
}