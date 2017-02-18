import React from 'react'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

import Action from '../actions/Actions'

export default class CausalVisAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      drop_value: 1
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

  handleDropChange() {
    console.log('a');
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
          <AppBar />
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
          onLeftIconButtonTouchTap={this.handleIconClick}
          iconElementRight={
            <DropDownMenu
              value={this.state.drop_value}
              onChange={this.handleDropChange}
              style={{height: 45}}
              labelStyle={{color: 'white'}}
              underlineStyle={{opacity: 1}}
            >
              <MenuItem value={1} primaryText="Never" />
              <MenuItem value={2} primaryText="Every Night" />
              <MenuItem value={3} primaryText="Weeknights" />
              <MenuItem value={4} primaryText="Weekends" />
              <MenuItem value={5} primaryText="Weekly" />
            </DropDownMenu>
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
