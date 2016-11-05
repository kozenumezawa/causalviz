import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import ThreeContainer from './components/three-container'
import GraphContainer from './components/graph-container'
import AppBar from './components/app-bar'




export default class main extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <AppBar />
        <br />
        <Grid>
          <Row className="show-grid">
            <Col md={7}>
              <ThreeContainer />
            </Col>
            <Col md={5}>
              <GraphContainer />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}