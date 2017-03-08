import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';


import Actions from '../../actions/Actions';

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  }
};

export default class commandButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown_value: 1
    };

    this.handleDropChange = this.handleDropChange.bind(this);
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

  handleDropChange(event, index, data_pixel) {
    this.setState({
      dropdown_value: data_pixel
    });
    Actions.handleDataPixelChange(data_pixel)
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <div className="btn btn-link">
          <Toggle
            onToggle={this.handleLoupeClick}
          />
          <span className="glyphicon glyphicon-search" ></span>
        </div>
        <FlatButton
          label="correlation"
          disabled={true}
          onClick={this.handleCorrelationClick}
        />
        <FlatButton
          label="Granger"
          onClick={this.handleGrangerClick}
        />
        <DropDownMenu
          value={this.state.dropdown_value}
          onChange={this.handleDropChange}
          labelStyle={{
              color: 'black',
              lineHeight: '37px'
            }}
          iconStyle={{
              height: '30px',
              padding: '6px'
            }}
          underlineStyle={{display: 'none'}}
        >
          <MenuItem value={1} primaryText="1pixel/data" />
          <MenuItem value={2} primaryText="4pixel/data" />
        </DropDownMenu>
      </div>
    );
  }
}