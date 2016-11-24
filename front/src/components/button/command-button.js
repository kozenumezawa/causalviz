import React from 'react'
import FlatButton from 'material-ui/FlatButton'
import {white} from 'material-ui/styles/colors'

import Actions from '../../actions/Actions'

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  }
};

export default class commandButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleCorrelationClick() {
    // Actions.handleBeforeClick();
    console.log('a');
  }

  handleGrangerClick() {
    console.log('a');
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <FlatButton
          label="correlation"
          onClick={this.handleCorrelationClick}
        />
        <FlatButton
          label="Granger"
          onClick={this.handleGrangerClick}
        />
      </div>
    );
  }
}