import React from 'react'
import ThreeContainer from './components/three-container'
import { Grid, Row, Col } from 'react-bootstrap'

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
              aaa
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}