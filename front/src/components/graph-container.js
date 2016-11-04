import React from 'react'

export default class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      render_graph : []
    };
  }

  componentDidMount() {
    window.fetch('ocean.json')
      .then((response) => response.json())
      .then((data) => {
        this.retrieveData(data);
      });
  }

  retrieveData(data) {
    const ocean_data = data.data_list;
    ocean_data.forEach((element, idx) => {

    });
    let test = [];
    test.push("a");
    this.setState({
      render_graph : test
    });
  }

  render() {
    return (
      <div>
        { this.state.render_graph }
      </div>
    );
  }
}
