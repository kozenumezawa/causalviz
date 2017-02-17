import React from 'react'

import ClickedCanvas from './clicked-canvas.jsx'
import EventCanvas from './event-canvas.jsx'

export default class OverlayCanvas extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ClickedCanvas
          id={this.props.id}
          canvas_width={this.props.canvas_width}
          canvas_height={this.props.canvas_height}
          clicked_point={this.props.clicked_point}
          loupe_point={this.props.loupe_point}
        />
        <EventCanvas
          id={this.props.id}
          canvas_width={this.props.canvas_width}
          canvas_height={this.props.canvas_height}
          loupe_point={this.props.loupe_point}
        />
      </div>
    );
  }
}


