import React from 'react'
import FlatButton from 'material-ui/FlatButton'

import Actions from '../../actions/Actions'

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
    return (
      <div>
        <FlatButton
          label="before"
          onClick={this.handleBeforeClick}
        />
        <FlatButton
          label="next"
          onClick={this.handleNextClick}
        />
      </div>
    );
  }
}