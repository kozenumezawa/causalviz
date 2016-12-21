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
  }

  handleIconClick() {
    this.setState({
        open: !this.state.open
    });
  }

  handleDefaultClick() {
    Action.handleDefaultClick();
    this.setState({
      open: !this.state.open
    });
  }

  handleKmeansClick() {
    Action.handleKmeansClick();
    this.setState({
      open: !this.state.open
    });
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
