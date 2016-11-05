import React from 'react'
import {scaleLinear, scaleOrdinal, schemeCategory10, line} from 'd3'

export default class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      render_graph : []
    };
  }

  componentDidMount() {
    window.fetch('ocean.json')
      .then((response) => response.json())
      .then((data) => {
        this.retrieveData(data);
      });
  }

  retrieveData(data) {
    // Array[3]Array[10100].{s,t}
    const ocean_data = data.data_list;
    ocean_data.forEach((element, idx) => {

    });

    const svgWidth = 300
    const svgHeight = 250
    const contentWidth = svgWidth
    const contentHeight = svgHeight
    const xScale = scaleLinear()
      .domain([0, ocean_data[0][0].s.length - 1])
      .range([0, contentWidth])
    const yScale = scaleLinear()
      .domain([0, 50])
      .range([contentHeight, 0])
    const l = line()
      .x((_, i) => xScale(i))
      .y((d) => yScale(+d))
    const color = scaleOrdinal(schemeCategory10)
    const dataOpacity = 0.02
    const featureOpacity = 0.5

    const graph =
      (<svg width={svgWidth} height={svgHeight}>
        <g transform='translate(50,50)'>
          <g>{
            ocean_data[0].map(({s}, i) => <path key={i} d={l(s)} fill='none' stroke={color(0)} opacity={dataOpacity} />)
          }</g>
          <g>{
            ocean_data[0].map(({t}, i) => <path key={i} d={l(t)} fill='none' stroke={color(1)} opacity={dataOpacity} />)
          }</g>
        </g>
        <g transform='translate(950,50)'>{
          ['salinity', 'temperature'].map((label, i) => {
            return <g key={i} transform={`translate(50,${i * 30})`}>
              <rect x='-25' fill={color(i)} width='20' height='20' />
              <text y='12'>{label}</text>
            </g>
          })
        }</g>
      </svg>
      );
    this.setState({
      render_graph : graph
    });
  }

  render() {
    return (
      <div>
        { this.state.render_graph }
      </div>
    );
  }
}
