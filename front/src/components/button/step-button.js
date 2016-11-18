import React from 'react'
import FlatButton from 'material-ui/FlatButton'

export default class stepButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleBeforeClick() {
    console.log('before');
  }

  handleNextClick() {
    console.log('next');
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