import React from 'react';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import IconButton from 'material-ui/IconButton'
import Crop from 'material-ui/svg-icons/Image/crop';

import generalConst from '../../constants/general-constants'

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
      dropdown_value: props.filter_type
    };
    this.handleDropChange = this.handleDropChange.bind(this);
  }

  handleLoupeClick() {
    Actions.handleLoupeClick();
  }

  handleDropChange(event, index, filter_type) {
    this.setState({
      dropdown_value: filter_type
    });
    Actions.handleFilterTypeChange(filter_type);
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <IconButton
          tooltip="Select area"
          style={{top: '5px'}}
          onClick={this.handleNextClick}
        >
          <Crop />
        </IconButton>
        <div className="btn btn-link">
          <Toggle
            onToggle={this.handleLoupeClick}
          />
          <span className="glyphicon glyphicon-search" ></span>
        </div>
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
          <MenuItem value={generalConst.FILTER_NONE} primaryText="FILTER: None" />
          <MenuItem value={generalConst.FILTER_MEAN} primaryText="FILTER: MEAN" />
        </DropDownMenu>
      </div>
    );
  }
}