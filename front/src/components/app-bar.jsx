import React from 'react'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

import Action from '../actions/Actions'
import generalConstants from '../constants/general-constants'
import eventConstants from '../constants/event-constants'

const DropDown = (props) => {
  return(
    <div>
      <DropDownMenu
        value={props.value}
        onChange={props.onChange}
        labelStyle={{color: 'white'}}
        underlineStyle={{display: 'none'}}
      >
        <MenuItem value={generalConstants.DATA_WILD_TYPE} primaryText="wild-type" />
        <MenuItem value={generalConstants.DATA_TRP_TYPE} primaryText="trp-3 mutant" />
      </DropDownMenu>
    </div>
  );
};

export default class CausalVisAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      dropdown_value: props.data_type
    };

    this.handleIconClick = this.handleIconClick.bind(this);
    this.handleDropChange = this.handleDropChange.bind(this);
    this.handleDefaultClick = this.handleDefaultClick.bind(this);
    this.handleKmeansClick = this.handleKmeansClick.bind(this);
    this.handleMaximumClick = this.handleMaximumClick.bind(this);
    this.handleCrossCorrelation = this.handleCrossCorrelation.bind(this);
    this.handleTraceFlow = this.handleTraceFlow.bind(this);
  }

  handleIconClick() {
    this.setState({
        open: !this.state.open
    });
  }

  handleDropChange(event, index, value) {
    this.setState({
      dropdown_value: value
    });
    Action.handleDropChange(value);
  }

  handleDefaultClick() {
    this.setState({
      open: !this.state.open
    });
    Action.handleDefaultClick();
  }

  handleKmeansClick() {
    this.setState({
      open: !this.state.open
    });
    Action.handleKmeansClick();
  }

  handleMaximumClick() {
    this.setState({
      open: !this.state.open
    });
    Action.handleMaximumClick();
  }

  handleCrossCorrelation() {
    this.setState({
      open: !this.state.open
    });
    Action.handleCrossCorrelation();
  }

  handleTraceFlow() {
    this.setState({
      open: !this.state.open
    });
    Action.handleTraceFlow();
  }

  renderAppBar() {
    if(this.state.open === true) {
      return(
        <div>
          <AppBar
            style={{height: 64}}
            iconElementRight={
              <DropDown
                value={this.state.dropdown_value}
                onChange={this.handleDropChange}
              />
            }
          />
          <Drawer
            width={250}
          >
            <AppBar
              title="CausalVis"
              onLeftIconButtonTouchTap={this.handleIconClick}
            />
            <MenuItem onTouchTap={this.handleDefaultClick}>default view</MenuItem>
            <MenuItem onTouchTap={this.handleKmeansClick}>k-means clustering</MenuItem>
            <MenuItem onTouchTap={this.handleMaximumClick}>maximum value clustering</MenuItem>
            <MenuItem onTouchTap={this.handleCrossCorrelation}>Cross Correlation</MenuItem>
            <MenuItem onTouchTap={this.handleTraceFlow}>Trace Flow</MenuItem>
          </Drawer>
        </div>
      );
    } else {
      return (
        <AppBar
          title="CausalVis"
          style={{height: 64}}
          onLeftIconButtonTouchTap={this.handleIconClick}
          iconElementRight={
            <DropDown
              value={this.state.dropdown_value}
              onChange={this.handleDropChange}
            />
          }
        />
      );
    }
  }

  render() {
    return (
      <div>
        {(() => {
          return this.renderAppBar();
        })()}
      </div>
    );
  }
}
