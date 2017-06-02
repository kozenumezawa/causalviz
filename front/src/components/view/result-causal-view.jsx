import React from 'react';
import RadioButton from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';

import Actions from '../../actions/Actions'

import CausalContainer from '../container/causal-container.jsx'

const styles = {
  block: {
    display: 'flex'
  },
  block2: {
    margin: 0
  },
  radio: {
    fontSize: 12
  },
  button: {
    // width: 12,
    height: 30,
    fontSize: 12
  }
};

export default class ResultCausalView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 'upper'
    };

    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  setAnchor(position) {
    this.setState({
      position: position
    });
  }

  handleSaveClick() {
    Actions.handleSaveClick(this.state.position);
  }

  render() {
    return (
      <div>
        <CausalContainer
          id="tiff_output_2"
          canvas_width={this.props.parent_state.canvas_width}
          canvas_height={this.props.parent_state.canvas_height}
          clicked_point={this.props.parent_state.clicked_point}
          loupe_point={this.props.parent_state.loupe_point}
          selected_area={this.props.parent_state.selected_area}
          tiff_index={this.props.parent_state.tiff_index}
          tiff_list={this.props.tiff_list}
          vector_fields={this.props.parent_state.vector_fields}
          causal_data={this.props.parent_state.causal_data}
        />

        <div style={styles.block}>
          <div style={styles.block2}>
            <span>Save to </span>
            <RadioButton
              onClick={this.setAnchor.bind(this, 'upper')}
              label="Upper" checked={this.state.position === 'upper'}
              style={styles.radio}
            />
            <RadioButton
              onClick={this.setAnchor.bind(this, 'lower')}
              label="Lower" checked={this.state.position === 'lower'}
              style={styles.radio}
            />
            <RaisedButton
              onClick={this.handleSaveClick}
              label="Save"
              style={styles.button}
            />
          </div>
        </div>
      </div>
    );
  }
}
