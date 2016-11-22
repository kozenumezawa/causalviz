import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import Store from '../stores/Store'

import TiffContainer from './tiff-container'
import AppBar from './app-bar'
import StepButton from './button/step-button'
import GraphContainer from './graph-container'

function getAllState() {
  return {
    tiff_list: Store.getTiffList(),
    tiff_index: Store.getTiffIndex()
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
    return (
      <div>
        <AppBar />
        <br />
        <Grid>
          <Row className="show-grid">
            <Col md={6}>
              <TiffContainer
                tiff_list={this.state.tiff_list}
                tiff_index={this.state.tiff_index}
              />
              <StepButton
                tiff_list={this.state.tiff_list}
                tiff_index={this.state.tiff_index}
              />
            </Col>
            <Col md={6}>
              <GraphContainer
                tiff_list={this.state.tiff_list}
                tiff_index={this.state.tiff_index}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}