import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import ThreeContainer from './components/three-container'
import GraphContainer from './components/graph-container'

export default class main extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Grid>
          <Row className="show-grid">
            <Col md={8}>
              <ThreeContainer />
            </Col>
            <Col md={4}>
              <GraphContainer />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}