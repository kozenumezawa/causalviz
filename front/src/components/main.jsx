import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import Store from '../stores/Store'

import TiffContainer from './tiff-container.jsx'
import AppBar from './app-bar.jsx'
import StepButton from './button/step-button.jsx'
import GraphContainer from './graph-container.jsx'
import CommandButton from './button/command-button.jsx'
import LegendContainer from './legend-container.jsx'
import SelectPalette from './canvas/select_palette.jsx'

function getAllState() {
  return {
    all_tiff_list     : Store.getAllTiffList(),
    tiff_index        : Store.getTiffIndex(),
    legend_tiff       : Store.getLegendTiff(),
    all_time_series   : Store.getAllTimeSeries(),
    relation_list     : Store.getRelationList(),
    highlighted_line  : Store.getHighlightedLine(),
    clicked_point     : Store.getClickedPoint(),
    loupe_point       : Store.getLoupePoint()
  }
}

export default class main extends React.Component {
  constructor(props) {
    super(props);
    this.state = getAllState();
  }

  componentDidMount() {
    Store.addChangeListener(this._onChange.bind(this));
  }

  _onChange() {
    this.setState(getAllState());
  }

  render() {
    const canvas_scale = 2;
    return (
      <div>
        <AppBar />
        <br />
        <Grid>
          <Row className="show-grid">
            <LegendContainer
              id="legend_output"
              legend_tiff={this.state.legend_tiff}
            />
            <Col sm={5}>
              <TiffContainer
                id="tiff_output_1"
                tiff_list={this.state.all_tiff_list[0]}
                tiff_index={this.state.tiff_index}
                canvas_scale={canvas_scale}
                clicked_point={this.state.clicked_point}
                loupe_point={this.state.loupe_point}
              />
            </Col>
            <Col sm={6}>
              <div style={{position: 'absolute', right: 0}}> 255 </div>
              <div style={{position: 'absolute', top: 190, right: 0}}> 0 </div>
              <GraphContainer
                id="time_series_graph_1"
                line_color="green"
                tiff_list={this.state.all_tiff_list[0]}
                tiff_index={this.state.tiff_index}
                time_series={this.state.all_time_series[0]}
                highlighted_line={this.state.highlighted_line}
              />
              <div style={{display: 'inline'}}> 1 </div>
              <div style={{position: 'absolute', display: 'inline', left: 190}}> time step </div>
              <div style={{position: 'absolute', display: 'inline', left: 420}}> 100 </div>
            </Col>
          </Row>
        </Grid>
        <Grid>
          <Row className="show-grid">
            <Col sm={5}>
              <SelectPalette
                id="select_palette"
                tiff_list={this.state.all_tiff_list[0]}
                tiff_index={this.state.tiff_index}
                canvas_scale={canvas_scale}
                clicked_point={this.state.clicked_point}
                loupe_point={this.state.loupe_point}
              />
              <StepButton
                tiff_list={this.state.all_tiff_list[0]}
                tiff_index={this.state.tiff_index}
              />
            </Col>
          </Row>

          <CommandButton />
        </Grid>

      </div>
    );
  }
}