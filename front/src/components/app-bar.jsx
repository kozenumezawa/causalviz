import React from 'react'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import Action from '../actions/Actions'

export default class CausalVisAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};

    this.handleIconClick = this.handleIconClick.bind(this);
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
              iconClassNameRight="muidocs-icon-navigation-expand-more"
              onClick={this.handleIconClick}
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
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onClick={this.handleIconClick}
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
