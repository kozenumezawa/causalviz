import React from 'react';
import Slider from 'material-ui/Slider';

import Actions from '../../actions/Actions';

export default class clusterSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slider: 10
    };

    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      slider: nextProps.slider_value
    });
  }

  handleSliderChange(event, value) {
    Actions.handleClusterChange(value);
  }

  renderClusterController() {
    return (
      <div>
        {this.state.slider}
      </div>
    );
  }

  render() {
    return (
      <div>
        <Slider
          min={1}
          max={20}
          step={1}
          defaultValue={6}
          value={this.state.slider}
          onChange={this.handleSliderChange}
          style={{width: 300, height: 14}}
          sliderStyle={{marginBottom: 15}}
        />
        {
          (() => {
            return this.renderClusterController()
          })()
        }
      </div>
    );
  }
}