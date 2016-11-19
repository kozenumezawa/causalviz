import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import Store from '../stores/Store'

import TiffContainer from './tiff-container'
import AppBar from './app-bar'
import StepButton from './button/step-button'


export default class main extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <AppBar />
        <br />
        <Grid>
          <Row className="show-grid">
            <Col md={7}>
              <TiffContainer />
            </Col>
            <Col md={5}>
              <StepButton />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}