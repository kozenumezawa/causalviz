import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import {white} from 'material-ui/styles/colors';

import Actions from '../../actions/Actions';

const styles = {
  chip: {
    margin: 4
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  }
};

export default class stepButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleBeforeClick() {
    Actions.handleBeforeClick();
  }

  handleNextClick() {
    Actions.handleNextClick();
  }

  render() {
    let pages = '- / -';
    if (this.props.tiff_list !== undefined) {
      pages = (this.props.tiff_index + 1) + ' / ' + this.props.tiff_list.length;
    }
    return (
      <div style={styles.wrapper}>
        <FlatButton
          label="before"
          onClick={this.handleBeforeClick}
        />
        <Chip
          backgroundColor={white}
          style={styles.chip}
        >
          {pages}
        </Chip>
        <FlatButton
          label="next"
          onClick={this.handleNextClick}
        />
      </div>
    );
  }
}