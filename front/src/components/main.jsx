import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import Store from '../stores/Store'

import TiffContainer from './tiff-container.jsx'
import AppBar from './app-bar.jsx'
import StepButton from './button/step-button.jsx'
import GraphContainer from './graph-container.jsx'
import CommandButton from './button/command-button.jsx'
import RelationContainer from './relation-container.jsx'

function getAllState() {
  return {
    all_tiff_list     : Store.getAllTiffList(),
    tiff_index        : Store.getTiffIndex(),
    all_green_time    : Store.getAllGreenTime(),
    all_red_time      : Store.getAllRedTime(),
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
            <Col sm={5}>
              <TiffContainer
                id="tiff_output_1"
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
            <Col sm={1}>
              <div style={{position: 'absolute', right: 0}}> 255 </div>
              <div style={{position: 'absolute', top: 190, right: 0}}> 0 </div>
            </Col>
            <Col sm={6}>
              <GraphContainer
                id="time_series_graph_1"
                line_color="green"
                tiff_list={this.state.all_tiff_list[0]}
                green_time_series={this.state.all_green_time[0]}
                highlighted_line={this.state.highlighted_line}
              />
              <div style={{display: 'inline'}}> 1 </div>
              <div style={{position: 'absolute', display: 'inline', left: 190}}> time step </div>
              <div style={{position: 'absolute', display: 'inline', left: 420}}> 100 </div>
            </Col>
          </Row>
          <Row>
            <Col sm={5}>
              <TiffContainer
                id="tiff_output_2"
                tiff_list={this.state.all_tiff_list[1]}
                tiff_index={this.state.tiff_index}
                canvas_scale={canvas_scale}
                clicked_point={this.state.clicked_point}
                loupe_point={this.state.loupe_point}
              />
            </Col>
            <Col sm={1}>
              <div style={{position: 'absolute', right: 0}}> 255 </div>
              <div style={{position: 'absolute', top: 190, right: 0}}> 0 </div>
            </Col>
            <Col sm={6}>
              <GraphContainer
                id="time_series_graph_2"
                line_color="red"
                tiff_list={this.state.all_tiff_list[1]}
                green_time_series={this.state.all_red_time[1]}
                highlighted_line={this.state.highlighted_line}
              />
              <div style={{display: 'inline'}}> 1 </div>
              <div style={{position: 'absolute', display: 'inline', left: 190}}> time step </div>
              <div style={{position: 'absolute', display: 'inline', left: 420}}> 100 </div>
            </Col>
          </Row>
        </Grid>
        <Grid>
          <Row>
            <Col sm={5}>
              <RelationContainer
                id="relation_output"
                relation_list={this.state.relation_list}
                canvas_scale={canvas_scale}
                clicked_point={this.state.clicked_point}
                loupe_point={this.state.loupe_point}
              />
            </Col>
          </Row>
          <CommandButton />
        </Grid>

      </div>
    );
  }
}