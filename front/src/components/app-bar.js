import React from 'react'
import AppBar from 'material-ui/AppBar'
import injectTapEventPlugin from 'react-tap-event-plugin'

export default class CausalVisAppBar extends React.Component {
  constructor(props) {
    super(props);
    injectTapEventPlugin();
  }

  handleClick() {
    console.log('a');
  }

  render() {
    return (
      <div>
        <AppBar
          title="CausalVis"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onClick={this.handleClick}
        />
      </div>
    );
  }
}
