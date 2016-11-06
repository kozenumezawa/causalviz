import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import ThreeContainer from './components/three-container'
import GraphContainer from './components/graph-container'
import AppBar from './components/app-bar'




export default class main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      raw_data: null
    };
  }

  componentDidMount() {
    window.fetch('ocean.json')
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          raw_data: data
        });
      });
  }

  render() {
    return (
      <div>
        <AppBar />
        <br />
        <Grid>
          <Row className="show-grid">
            <Col md={7}>
              <ThreeContainer
                raw_data={this.state.raw_data}
              />
            </Col>
            <Col md={5}>
              <GraphContainer
                raw_data={this.state.raw_data}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}