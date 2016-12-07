import React from 'react'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton';

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
    Actions.handleCorrelationClick();
  }

  handleGrangerClick() {
    console.log('a');
  }

  handleLoupeClick() {
    Actions.handleLoupeClick();
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <FlatButton
          label="correlation"
          disabled={true}
          onClick={this.handleCorrelationClick}
        />
        <FlatButton
          label="Granger"
          onClick={this.handleGrangerClick}
        />
        <div className="btn btn-link" onClick={this.handleLoupeClick}>
          <span className="glyphicon glyphicon-search" ></span>
        </div>
      </div>
    );
  }
}