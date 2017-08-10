import React from 'react';
import Toggle from 'material-ui/Toggle';
import IconButton from 'material-ui/IconButton'
import Crop from 'material-ui/svg-icons/image/crop';
import Search from 'material-ui/svg-icons/action/search';

import Actions from '../../actions/Actions';

const styles = {
  icon_style: {
    width: 20,
    height: 20
  },
  icon_button: {
    width: 40,
    height: 40,
    padding: 0
  },
  block: {
    maxWidth: 250,
  },
};

export default class commandButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleLoupeClick() {
    Actions.handleLoupeClick();
  }

  handleCropClick() {
    Actions.handleCropClick();
  }

  render() {
    return (
      <div>
        <div style={styles.block}>
          <Toggle
            onToggle={this.handleLoupeClick}
            label={
              <IconButton
                tooltip="Select area"
                iconStyle={styles.icon_style}
                style={styles.icon_button}
              >
                <Search />
              </IconButton>
            }
            style={styles.toggle}
          />

          <Toggle
            onToggle={this.handleCropClick}
            label={
              <IconButton
                tooltip="Select area"
                iconStyle={styles.icon_style}
                style={styles.icon_button}
              >
                <Crop />
              </IconButton>
            }
            style={styles.toggle}
          />
        </div>
      </div>
    );
  }
}