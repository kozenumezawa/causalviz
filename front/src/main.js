import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import TiffContainer from './components/tiff-container'
import AppBar from './components/app-bar'
import StepButton from './components/button/step-button'

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