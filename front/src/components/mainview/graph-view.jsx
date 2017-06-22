import React from 'react';

import * as drawingTool from '../../utils/drawing-tool'


import GraphContainer from '../graph/graph-container.jsx';

export default class GraphView extends React.Component {
  constructor(props) {
    super(props);
    this.drawSVG = false;

    this.scale = 5;
  }

  componentDidMount() {
    // window.fetch('http://localhost:3000/api/v1/getcorr', {
    //   mode: 'cors',
    //   method: 'GET',
    //   headers: {
    //     'content-type': 'application/json',
    //   }
    // })
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((json) => {
    //     this.corr_list = json.data
    //     this.drawData(this.props);
    //   });
    window.fetch("trp3_corr.json")
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.corr_list = json.data
        this.drawData(this.props);
      });

    this.canvas = document.getElementById("cluster_canvas");
    this.ctx = this.canvas.getContext('2d');
  }

  componentWillReceiveProps(nextProps) {
    this.drawData(nextProps);
  }

  drawData(props) {
    if (props.tiff_list.length === 0) {
      return null;
    }

    if (this.drawSVG === true) {
      return null;
    }

    if (this.corr_list == null) {
      return null
    }

    const canvas = props.tiff_list[0];
    const ctx = canvas.getContext('2d');

    const width = canvas.width * this.scale;
    const height = canvas.height * this.scale;

    const tiff_image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tiff_rgba = tiff_image.data; // image_rgba = [R, G, B, A, R, G, B, A, ...] (hex data)

    const svg = d3.select("#graphsvg")
      .append("svg");
    svg.attr("width", width);
    svg.attr("height", height);

    const pixel_list = [];
    const color_list = [];
    props.parent_state.all_time_series.forEach((time_series, idx) => {
        const x = idx % canvas.width;
        const y = Math.floor(idx / canvas.width);

        const circle = [x * this.scale, y * this.scale, 2];  // [x, y, r]
        pixel_list.push(circle);

        const r = tiff_rgba[idx * 4 + 0];
        const g = tiff_rgba[idx * 4 + 1];
        const b = tiff_rgba[idx * 4 + 2];
        if (time_series.indexOf(0) < 0 && this.isSamplingPoint(idx, canvas.width)) {
          color_list.push([255, 0, 255]);
        } else {
          color_list.push([r, g, b]);
        }
      });

    const circles = svg.selectAll('circle').data(pixel_list).enter().append('circle')
      .attr("cx", (d) => { return d[0] })
      .attr("cy", (d) => { return d[1] })
      .attr("r", (d) => { return d[2] })
      .style("fill", (d, i) => {
        return d3.rgb(color_list[i][0], color_list[i][1], color_list[i][2]);
      })
      .on("mouseover", (selected_pixel) => {
        svg.selectAll("line").remove();
        
        // d3.select(this).style("fill", "orange");
        const x_idx = (selected_pixel[0] / this.scale + selected_pixel[1] / this.scale * canvas.width);
        const x = props.parent_state.all_time_series[x_idx];
        if (x[0] === 0) {
          return;
        }

        props.parent_state.all_time_series.forEach((y, y_idx) => {
          if (y[0] !== 0 && this.isSamplingPoint(y_idx, canvas.width) && this.corr_list[x_idx].length !== 0) {
            const corr = this.corr_list[x_idx][y_idx];
            if (corr > 0.9) {
              svg.append("line").data(pixel_list)
                .style("stroke", "black")  // colour the line
                .attr("x1", (d) => {
                  return selected_pixel[0]
                })
                .attr("y1", (d) => {
                  return selected_pixel[1]
                })
                .attr("x2", (d) => {
                  return pixel_list[y_idx][0]
                })
                .attr("y2", (d) => {
                  return pixel_list[y_idx][1]
                });
            }
          }
        });
      });

    // draw data
    const color = d3.schemeCategory10;
    // const color = drawingTool.getColorCategory(10);
    d3.csv('labels.csv', (csv) => {
      // draw a base image
      this.canvas.width = canvas.width * this.scale;
      this.canvas.height = canvas.height * this.scale;
      this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.canvas.width, this.canvas.height);

      let color_list_idx = 0;
      props.parent_state.all_time_series.forEach((time_series, idx) => {
        const x = idx % canvas.width * this.scale;
        const y = Math.floor(idx / canvas.width) * this.scale;

        if (time_series.indexOf(0) < 0 && this.isSamplingPoint(idx, canvas.width)) {
          const mean_step = 3;
          this.ctx.fillStyle = color[Number(csv[color_list_idx++].labels)];
          this.ctx.fillRect(x - 1, y - 1, mean_step * this.scale, mean_step * this.scale);
        }
      });

      // graph sortedに沿って、heat mapを描画
      window.fetch("graph_sorted.json")
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          const graph_sorted = json.data;
          const n_cluster_list = json.n_cluster_list;

          const heatmap_canvas = document.getElementById("heatmap_canvas");
          const heatmap_ctx = heatmap_canvas.getContext('2d');

          const cell_size = 1;
          const legend_width = 15;
          heatmap_canvas.width = graph_sorted.length * cell_size + legend_width;
          heatmap_canvas.height = graph_sorted.length * cell_size + legend_width;

          // fill color
          let n_cluster_cnt = 0;
          let cluster_idx = 0;
          graph_sorted.forEach((row, row_idx) => {
            if (n_cluster_cnt < n_cluster_list[cluster_idx]) {
              heatmap_ctx.fillStyle = color[cluster_idx];
            } else {
              heatmap_ctx.fillStyle = color[++cluster_idx];
              n_cluster_cnt = 0;
            }
            n_cluster_cnt++;
            row.forEach((cell, cell_idx) => {
              if (cell !== 0) {
                heatmap_ctx.fillRect(cell_idx * cell_size + legend_width, row_idx * cell_size + legend_width, cell_size, cell_size);
              }
            });
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

          n_cluster_list.forEach((data, idx) => {
            const x = center + center_r * Math.cos(idx * circle_interval);
            const y = center + center_r * Math.sin(idx * circle_interval);

            const r = arrow_canvas.width / 16;
            arrow_ctx.beginPath();
            arrow_ctx.arc(x, y, r, 0, Math.PI * 2);
            arrow_ctx.stroke();
            arrow_ctx.closePath();
            arrow_ctx.fillStyle = color[idx];
            arrow_ctx.fill();
          });

        });
    });

    this.drawSVG = true;
  }

  isSamplingPoint(idx, width) {
    const mean_step = 3;
    const x = idx % width;
    const y = Math.floor(idx / width);
    if (x % mean_step === 1 && y % mean_step === 0) {
      return true;
    }
    return false;
  }

  render() {
    return (
    <div>
      <div id="graphsvg"></div>
      <canvas id="cluster_canvas"></canvas>
      <canvas id="heatmap_canvas"></canvas>
      <div><canvas id="arrow_canvas"></canvas></div>
    </div>
    );
  }
}
