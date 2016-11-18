import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import TiffContainer from './components/tiff-container'
import GraphContainer from './components/graph-container'
import AppBar from './components/app-bar'

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
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}