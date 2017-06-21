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

    // Change color according to labels
    // d3.csv('labels.csv', (csv) => { //csvデータの読み込み
    //   color_list = [];
    //   let color_list_idx = 0;
    //   props.parent_state.all_time_series.forEach((time_series, idx) => {
    //     const r = tiff_rgba[idx * 4 + 0];
    //     const g = tiff_rgba[idx * 4 + 1];
    //     const b = tiff_rgba[idx * 4 + 2];
    //     if (time_series[0] !== 0 && this.isSamplingPoint(idx, canvas.width)) {
    //       const color = d3.schemeCategory10;
    //       const rgb = color[Number(csv[color_list_idx++].labels)];
    //       const r   = parseInt(rgb.substring(1,3), 16);
    //       const g = parseInt(rgb.substring(3,5), 16);
    //       const b  = parseInt(rgb.substring(5,7), 16);
    //       color_list.push([r, g, b]);
    //     } else {
    //       // color_list.push([r, g, b]);
    //       color_list.push([255, 255, 255]);
    //     }
    //   });
   // });

    // draw data
    const color = d3.schemeCategory10;
    // const color = drawingTool.getColorCategory(10);
    d3.csv('labels.csv', (csv) => {
      // draw a base image
      this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.canvas.width, this.canvas.height);

      let color_list_idx = 0;
      props.parent_state.all_time_series.forEach((time_series, idx) => {
        const x = idx % canvas.width;
        const y = Math.floor(idx / canvas.width);

        if (time_series.indexOf(0) < 0 && this.isSamplingPoint(idx, canvas.width)) {
          const mean_step = 3;
          this.ctx.fillStyle = color[Number(csv[color_list_idx++].labels)];
          this.ctx.fillRect(x - 1, y - 1, mean_step, mean_step);
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

          const canvas = document.getElementById("heatmap_canvas");
          const ctx = canvas.getContext('2d');

          const cell_size = 1;
          const legend_width = 15;
          canvas.width = graph_sorted.length * cell_size + legend_width;
          canvas.height = graph_sorted.length * cell_size + legend_width;

          // fill color
          let n_cluster_cnt = 0;
          let cluster_idx = 0;
          graph_sorted.forEach((row, row_idx) => {
            if (n_cluster_cnt < n_cluster_list[cluster_idx]) {
              ctx.fillStyle = color[cluster_idx];
            } else {
              ctx.fillStyle = color[++cluster_idx];
              n_cluster_cnt = 0;
            }
            n_cluster_cnt++;
            row.forEach((cell, cell_idx) => {
              if (cell !== 0) {
                ctx.fillRect(cell_idx * cell_size + legend_width, row_idx * cell_size + legend_width, cell_size, cell_size);
              }
            });
          });

          // draw line and legend to the heat map
          drawingTool.drawFrame(canvas, ctx);
          ctx.line_color = "black";
          ctx.lineWidth = 1;
          ctx.beginPath();
          let ctx_x = legend_width - 1;
          n_cluster_list.forEach((n_cluster, idx) => {
            // draw legend
            ctx.fillStyle = color[idx];
            ctx.fillRect(ctx_x, 0, n_cluster * cell_size, legend_width);
            ctx.fillRect(0, ctx_x, legend_width, n_cluster * cell_size);

            // draw line
            ctx_x += n_cluster * cell_size;
            ctx.moveTo(ctx_x, legend_width);
            ctx.lineTo(ctx_x, canvas.height );

            ctx.moveTo(legend_width, ctx_x);
            ctx.lineTo(canvas.width, ctx_x);
          });
          ctx.closePath();
          ctx.stroke();



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
      <canvas id="cluster_canvas" width="128" height="96"></canvas>
      <canvas id="heatmap_canvas"></canvas>
    </div>
    );
  }
}
