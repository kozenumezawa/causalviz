import React from 'react'

export default class relationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.already_drawn = false;
  }

  renderData() {
    console.log(this.props);
    this.already_drawn = true;
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} width="360" height="300"></canvas>
      </div>
    );
  }
}
