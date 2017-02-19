import React from 'react';

import Actions from '../../actions/Actions';
import ClusterSlider from './cluster-slider.jsx';
import * as drawingTool from '../../utils/drawing-tool';

export default class clusterButton extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.renderClusterLegend(this.props.cluster_list);
  }

  componentWillReceiveProps(nextProps) {
    nextProps.checked_cluster.forEach((element, idx) => {
      document.checkbox[idx].checked = element
    });

    this.renderClusterLegend(nextProps.cluster_list);
  }

  handleCheckClick(index) {
    Actions.handleCheckClick(index);
  }

  renderClusterLegend(cluster_list) {
    if(cluster_list.length === 0) {
      return;
    }

    const N_clusters = Math.max.apply(null, cluster_list) + 1;
    const color_map = drawingTool.getColorCategory(N_clusters);

    const N_canvas = 20;
    for(let i = 0; i < N_canvas; i++) {
      const id_canvas = this.props.id + i;
      const canvas = document.getElementById(id_canvas);
      if(canvas === null) {
        return;
      }
      const ctx = canvas.getContext('2d');

      if(i < N_clusters) {
        ctx.fillStyle = color_map[i];
        document.checkbox[i].style.visibility = "visible"
      } else {
        ctx.fillStyle = 'white';
        document.checkbox[i].style.visibility = "hidden"
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  render() {
    return (
      <div>
        <div style={{display:'inline-block'}}>
          <form name="checkbox">
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '0'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 0)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '1'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 1)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '2'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 2)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '3'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 3)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '4'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 4)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '5'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 5)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '6'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 6)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '7'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 7)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '8'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 8)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '9'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 9)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '10'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 10)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '11'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 11)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '12'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 12)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '13'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 13)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '14'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 14)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '15'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 15)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '16'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 16)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '17'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 17)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '18'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 18)} style={{display:'block', marginLeft:13}}></input>
            </div>
            <div style={{display:'inline-block'}}>
              <canvas id={this.props.id + '19'} style={{marginLeft:10}} width={20} height={20}></canvas>
              <input type="checkbox" value="on" onClick={this.handleCheckClick.bind(this, 19)} style={{display:'block', marginLeft:13}}></input>
            </div>
          </form>
        </div>

        <ClusterSlider
          slider_value = {this.props.slider_value}
        />
      </div>
    );
  }
}