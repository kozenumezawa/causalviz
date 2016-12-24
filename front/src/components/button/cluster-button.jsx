import React from 'react'
import * as d3_scale from 'd3-scale'

import Actions from '../../actions/Actions'

export default class clusterButton extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    nextProps.checked_cluster.forEach((element, idx) => {
      document.checkbox[idx].checked = element
    });
  }

  handleCheckClick(index) {
    Actions.handleCheckClick(index);
  }

  renderCanvas() {
    let render_canvas = [];

    let N_cluster = Math.max.apply(null, this.props.clustering_list) + 1;
    if(N_cluster === -Infinity) {
      N_cluster = 20;
    }

    for(let i = 0; i < N_cluster; i++) {
      const id_canvas = this.props.id + i;
      render_canvas.push(
        <div key={i} style={{display:'inline-block'}}>
          <canvas id={id_canvas} style={{marginLeft:10}} width={20} height={20}></canvas>
          <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, i)} style={{display:'block', marginLeft:13}}></input>
        </div>
      );
    }
    return render_canvas;
  }

  renderClusterLegend() {
    if(this.props.clustering_list.length === 0) {
      return;
    }
    const color_map = d3_scale.schemeCategory20c;
    const N_cluster = Math.max.apply(null, this.props.clustering_list) + 1;
    for(let i = 0; i < N_cluster; i++) {
      const id_canvas = this.props.id + i;
      const canvas = document.getElementById(id_canvas);
      if(canvas === null) {
        return;
      }
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = color_map[i];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  render() {
    return (
      <div>
        <div style={{display:'inline-block'}}>
          <form name="checkbox">
            {(() => {
              return this.renderCanvas();
            })()}
          </form>

          {(() => {
            return this.renderClusterLegend();
          })()}
        </div>
      </div>
    );
  }
}