import React from 'react';

import * as drawingTool from '../../utils/drawing-tool'
import generalConst from '../../constants/general-constants'
import TiffContainer from '../container/tiff-container.jsx'

export default class GraphView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      corr_list: [],
      mean_step: 3
    };
    this.scale = 4;
  }

  componentDidMount() {
    this.canvas = document.getElementById("cluster_canvas");
    this.ctx = this.canvas.getContext('2d');
  }

  componentWillReceiveProps(nextProps) {
    // tiff_listが更新されてから処理をする必要があるので、データの変更が起きたか調べるのはtiff_listを用いる
    if (this.state.corr_list.length === 0 || this.props.tiff_list.toString() !== nextProps.tiff_list.toString()) {
      const data_type = nextProps.parent_state.data_type;
      const name = this.getName(data_type);

      this.setState({
        mean_step: (data_type === generalConst.DATA_WILD_TYPE) ? 5 : 3
      });

      // this.drawData(nextProps, name);
      this.drawData(nextProps, name);
    }
  }

  getName(data_type) {
    if (data_type === generalConst.DATA_TRP_TYPE) {
      return 'trp3';
    } else if (data_type === generalConst.DATA_WILD_TYPE) {
      return 'wild';
    }
    return 'gaussian';
  }

  drawData(props, name) {
    if (props.tiff_list.length === 0) {
      return null;
    }

    const canvas = props.tiff_list[0];
    const ctx = canvas.getContext('2d');

    const width = canvas.width * this.scale;
    const height = canvas.height * this.scale;

    const tiff_image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tiff_rgba = tiff_image.data; // image_rgba = [R, G, B, A, R, G, B, A, ...] (hex data)
    
    // draw heatmap and canvas according to the graph
    window.fetch(name + '_graph_sorted.json')
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const graph_sorted = json.data;
        const n_cluster_list = json.n_cluster_list;
        const ordering = json.ordering;
        const not_isolated_list = json.not_isolated_list;

        const color = drawingTool.getColorCategory(n_cluster_list.length);

        // draw a canvas
        this.canvas.width = canvas.width * this.scale;
        this.canvas.height = canvas.height * this.scale;
        this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.canvas.width, this.canvas.height);

        const heatmap_canvas = document.getElementById("heatmap_canvas");
        const heatmap_ctx = heatmap_canvas.getContext('2d');

        const cell_size = 1;
        const legend_width = 15;
        heatmap_canvas.width = graph_sorted.length * cell_size + legend_width;
        heatmap_canvas.height = graph_sorted.length * cell_size + legend_width;

        // Save the index of sampling points
        const sampling_idx_list = [];
        props.parent_state.all_time_series.forEach((time_series, idx) => {
          if (this.sum(time_series) !== 0 && this.isSamplingPoint(idx, canvas.width)) {
            sampling_idx_list.push(idx);
          }
        });

        // 各クラスターのstartとstopのindexを保存
        let cluster_range_list = [];
        n_cluster_list.reduce((prev, current, idx) => {
          const end_pixel = prev + current;
          cluster_range_list.push({
            start: prev,
            end: end_pixel
          });
          return end_pixel;
        }, 0);

        // fill color
        let cluster_idx = 0;
        graph_sorted.forEach((row, row_idx) => {
          if (row_idx >= cluster_range_list[cluster_idx].end) {
            cluster_idx++;
          }

          // draw row color to the heatmap
          heatmap_ctx.fillStyle = color[cluster_idx];
          row.forEach((cell, cell_idx) => {
            if (cell === true) {
              heatmap_ctx.fillRect(cell_idx * cell_size + legend_width, row_idx * cell_size + legend_width, cell_size, cell_size);
            }
          });

          // draw the canvas according to the cluster
          this.ctx.fillStyle = color[cluster_idx];
          const original_idx = not_isolated_list[ordering.indexOf(row_idx)];  // ordering.indexOf(row_idx) = the index before clustering. this value is needed to be transformed to the original index because the isolated rows are deleted from the original data.
          const idx = sampling_idx_list[original_idx];
          const x = idx % canvas.width * this.scale;
          const y = Math.floor(idx / canvas.width) * this.scale;
          this.ctx.fillRect(x - 1, y - 1, this.state.mean_step * this.scale, this.state.mean_step * this.scale);
        });

        // draw line and legend to the heat map
        drawingTool.drawFrame(heatmap_canvas, heatmap_ctx);
        heatmap_ctx.line_color = "black";
        heatmap_ctx.lineWidth = 1;
        heatmap_ctx.beginPath();
        let heatmap_ctx_x = legend_width - 1;
        n_cluster_list.forEach((n_cluster, idx) => {
          // draw legend
          heatmap_ctx.fillStyle = color[idx];
          heatmap_ctx.fillRect(heatmap_ctx_x, 0, n_cluster * cell_size, legend_width);
          heatmap_ctx.fillRect(0, heatmap_ctx_x, legend_width, n_cluster * cell_size);

          // draw line
          heatmap_ctx_x += n_cluster * cell_size;
          heatmap_ctx.moveTo(heatmap_ctx_x, legend_width);
          heatmap_ctx.lineTo(heatmap_ctx_x, heatmap_canvas.height );

          heatmap_ctx.moveTo(legend_width, heatmap_ctx_x);
          heatmap_ctx.lineTo(heatmap_canvas.width, heatmap_ctx_x);
        });
        heatmap_ctx.closePath();
        heatmap_ctx.stroke();


        const arrow_canvas = document.getElementById("arrow_canvas");
        const arrow_ctx = arrow_canvas.getContext('2d');
        arrow_canvas.width = 400;
        arrow_canvas.height = 400;

        // 極座標を用いて円形に配置
        const center = arrow_canvas.width / 2;
        const center_r = arrow_canvas.width / 4;
        const circle_interval = 2 * Math.PI / n_cluster_list.length;
        const circle_r = arrow_canvas.width / 16;

        let circle_coord_list = [];
        n_cluster_list.forEach((n_cluster, idx) => {
          const x = center + center_r * Math.cos(idx * circle_interval);
          const y = center + center_r * Math.sin(idx * circle_interval);
          circle_coord_list.push({
            x: x,
            y: y
          });

          arrow_ctx.beginPath();
          arrow_ctx.arc(x, y, circle_r, 0, Math.PI * 2);
          arrow_ctx.stroke();
          arrow_ctx.closePath();
          arrow_ctx.fillStyle = color[idx];
          arrow_ctx.fill();
        });

        // 因果関係を表すcausal matrixを生成
        let causal_matrix = [];
        n_cluster_list.forEach((n_cluster, row_cluster_idx) => {
          causal_matrix.push([]);
          const row_range = cluster_range_list[row_cluster_idx];

          cluster_range_list.forEach((range, col_cluster_idx) => {
            if (row_cluster_idx === col_cluster_idx) {
              causal_matrix[row_cluster_idx][col_cluster_idx] = 0;
              return;
            }
            const col_range = range;
            let causal_cnt = 0;
            for (let row_idx = row_range.start; row_idx < row_range.end; row_idx++) {
              for (let col_idx = col_range.start; col_idx < col_range.end; col_idx++) {
                causal_cnt += Math.ceil(graph_sorted[row_idx][col_idx]);
              }
            }

            const area = n_cluster * n_cluster_list[col_cluster_idx];
            if (causal_cnt > area / 2.5) {
              causal_matrix[row_cluster_idx][col_cluster_idx] = 1;
            } else {
              causal_matrix[row_cluster_idx][col_cluster_idx] = 0;
            }
          });
        });

        // draw arrows
        arrow_ctx.fillStyle = 'black';
        arrow_ctx.beginPath();
        causal_matrix.forEach((row, row_idx) => {
          row.forEach((causal_flag, col_idx) => {
            if (causal_flag === 1) {
              const origin = circle_coord_list[row_idx];
              const end = circle_coord_list[col_idx];

              // 矢印が円の外側に来るように補正
              const distance = Math.sqrt(Math.pow(end.y - origin.y, 2) * Math.pow(end.x - origin.x, 2));
              const theta = Math.acos((end.x - origin.x) / distance);
              const end_x = end.x - circle_r * Math.cos(theta);
              const end_y = (end.y > origin.y) ? end.y - circle_r * Math.sin(theta) : end.y + circle_r * Math.sin(theta);

              this.arrow(arrow_ctx, origin.x, origin.y, end_x, end_y, [0, 2, -20, 2, -20, 8]);
            }
          });

        });
        arrow_ctx.fill();
      });
    window.fetch(name + "_flow.json")
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const flow_canvas = document.getElementById("flow_canvas");
        const flow_ctx = flow_canvas.getContext('2d');
        flow_canvas.width = canvas.width * this.scale;
        flow_canvas.height = canvas.height * this.scale;
        flow_ctx.drawImage(props.tiff_list[10], 0, 0, canvas.width, canvas.height, 0, 0, flow_canvas.width, flow_canvas.height);

        const all_time_series= props.parent_state.all_time_series;
        json.data.forEach((vector, idx) => {
          const time_series = all_time_series[idx];
          if (this.sum(time_series) !== 0 && this.isSamplingPoint(idx, canvas.width)) {
            const x = idx % canvas.width * this.scale;
            const y = Math.floor(idx / canvas.width) * this.scale;

            let intensity = vector[2];
            if (intensity < 1) {
              return;
            }
            if (intensity > 3) {
              intensity = 3;
            }
            const v_x = vector[0] * intensity;
            const v_y = vector[1] * intensity;

            if (v_x > 0 && v_y > 0) {
              flow_ctx.strokeStyle = 'red';
              flow_ctx.fillStyle = "red";
            } else if (v_x > 0 && v_y <= 0) {
                flow_ctx.strokeStyle = 'green';
                flow_ctx.fillStyle = "green";
            } else if (v_x <= 0 && v_y <= 0) {
              flow_ctx.strokeStyle = 'blue';
              flow_ctx.fillStyle = "blue";
            } else {
              flow_ctx.strokeStyle = 'yellow';
              flow_ctx.fillStyle = "yellow";
            }

            flow_ctx.beginPath();
            // flow_ctx.moveTo(x, y);
            // flow_ctx.lineTo(x + v_x, y + v_y);
            // flow_ctx.stroke();

            this.arrow(flow_ctx, x, y, x + v_x, y + v_y, [0, 1, -6, 1, -6, 3]);
          }
          flow_ctx.fill();
        });
        // const cell_size = 1;
        // const legend_width = 15;
        // heatmap_canvas.width = graph_sorted.length * cell_size + legend_width;
        // heatmap_canvas.height = graph_sorted.length * cell_size + legend_width;
      });
  }

  isSamplingPoint(idx, width) {
    const x = idx % width;
    const y = Math.floor(idx / width);
    if (x % this.state.mean_step === 1 && y % this.state.mean_step === 0) {
      return true;
    }
    return false;
  }

  // ref: http://qiita.com/frogcat/items/2f94b095b4c2d8581ff6
  arrow(ctx, startX, startY, endX, endY, controlPoints) {
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    const sin = dy / len;
    const cos = dx / len;
    let a = [];
    a.push(0, 0);
    for (let i = 0; i < controlPoints.length; i += 2) {
      const x = controlPoints[i];
      const y = controlPoints[i + 1];
      a.push(x < 0 ? len + x : x, y);
    }
    a.push(len, 0);
    for (let i = controlPoints.length; i > 0; i -= 2) {
      const x = controlPoints[i - 2];
      const y = controlPoints[i - 1];
      a.push(x < 0 ? len + x : x, -y);
    }
    a.push(0, 0);
    for (let i = 0; i < a.length; i += 2) {
      const x = a[i] * cos - a[i + 1] * sin + startX;
      const y = a[i] * sin + a[i + 1] * cos + startY;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  };

  sum(arr) {
    return arr.reduce((prev, current) => {
      return prev+current;
    });
  }

  render() {
    return (
    <div>
      <TiffContainer
        id="tiff_output"
        canvas_width={this.props.parent_state.canvas_width}
        canvas_height={this.props.parent_state.canvas_height}
        clicked_point={this.props.parent_state.clicked_point}
        loupe_point={this.props.parent_state.loupe_point}
        selected_area={this.props.parent_state.selected_area}
        tiff_index={this.props.parent_state.tiff_index}
        tiff_list={this.props.tiff_list}
      />
      <div><canvas id="flow_canvas"></canvas></div>
      <div id="graphsvg"></div>
      <canvas id="cluster_canvas"></canvas>
      <canvas id="heatmap_canvas"></canvas>
      <div><canvas id="arrow_canvas"></canvas></div>
    </div>
    );
  }
}
