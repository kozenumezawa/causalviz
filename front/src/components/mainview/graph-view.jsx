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
        const x = idx % canvas.width;
        const y = Math.floor(idx / canvas.width);

        const circle = [x * this.scale, y * this.scale, 2];  // [x, y, r]
        pixel_list.push(circle);

        const r = tiff_rgba[idx * 4 + 0];
        const g = tiff_rgba[idx * 4 + 1];
        const b = tiff_rgba[idx * 4 + 2];
        if (time_series[0] !== 0 && this.isSamplingPoint(idx, canvas.width)) {
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
            if (corr > 0.8) {
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

    const max = 1;
    const min = -1;

    const colorScale = d3.scale.linear().domain([min, max]).range(["#E5F0FF", "#2C14BC"]); //カラースケールを作成

    const  x_range  = d3.range(1 + d3.max(this.corr_list, function(d){ return Number(d.time)}));

    const data = 	d3.nest().key(function(d){return d.type;}).entries(this.corr_list); //CSVから取得したデータをdateフィールドの値でネスト

    const tbody = d3.select('body').append('table').append('tbody'); //table作成
    const tfoot = d3.select('table').append('tfoot'); //tableにtfootをappend

    tfoot.append('th'); //空th追加

    //tfootに時間thを追加
    tfoot.selectAll('class')
      .data(x_range)
      .enter()
      .append('th')
      .attr("class", "hours")
      .text(function(d){ return d});


    //tr追加
    var trs = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr')

    //thに年月日を追加
    trs.append('th').text(function(d){
      return d.key;
    });


    //td追加
    trs.selectAll('td')
      .data(function(d){ return d.values} )
      .enter()
      .append('td')
      .style("background-color", function(d){ return colorScale(d.value); })
      .on('mouseover', function(d){
        d3.select(this).text(d.value); //mouoverした際に訪問者数を表示
      })
      .on("mouseout", function(d){
        d3.select(this).text("");
      });

    var svg = d3.select("body").append("svg");

    //凡例
    var svg = d3.select('svg');
    //凡例を配置するグループ要素を追加
    var legendView = svg.append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(20,20)");

    //スケールを元に凡例を生成する
    var legend = d3.legend.color().scale(colorScale);

    //凡例を描画する
    svg.select(".legendQuant")
      .call(legend);

    this.drawSVG = true;
  }

  render() {
    return (
      <div id="graphsvg"></div>
    );
  }
}
