import React from 'react';

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
        const x = idx % canvas.width * this.scale;
        const y = Math.floor(idx / canvas.width) * this.scale;
        const circle = [x, y, 2];  // [x, y, r]
        pixel_list.push(circle);

        const r = tiff_rgba[idx * 4 + 0];
        const g = tiff_rgba[idx * 4 + 1];
        const b = tiff_rgba[idx * 4 + 2];
        if (idx % 5 === 0 && time_series[0] !== 0) {
          color_list.push([0, 0, 255]);
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
        // if (x[0] === 0 || x_idx > 3000) {
        if (x[0] === 0) {
          return;
        }

        props.parent_state.all_time_series.forEach((y, y_idx) => {
          if (y[0] !== 0 && y_idx % 10 === 0 || this.corr_list[x_idx].length !== 0) {
            const corr = this.corr_list[x_idx][y_idx];
            if (corr > 0.7) {
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
    this.drawSVG = true;
  }

  render() {
    return (
      <div id="graphsvg"></div>
    );
  }
}
