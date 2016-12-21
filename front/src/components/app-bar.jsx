import React from 'react'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

export default class CausalVisAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};

    this.handleIconClick = this.handleIconClick.bind(this);
  }

  handleIconClick() {
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
            <MenuItem onTouchTap={this.handleClose}>default view</MenuItem>
            <MenuItem onTouchTap={this.handleClose}>k-means clustering</MenuItem>
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
