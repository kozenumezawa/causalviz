import React from 'react';

export default class GraphLegend extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div style={{position: 'relative', display: 'inline-block', top:-160, left: -25}}> 100 </div>
        <div style={{position: 'relative', display: 'inline-block', top:-20, left: -50}}> -50 </div>

        <div style={{position: 'relative', display: 'inline-block', top:0, left: -50}}> 0 </div>
        <div style={{position: 'relative', display: 'inline-block', top:0, left: 120}}> Time (seconds) </div>
        <div style={{position: 'relative', display: 'inline-block', top:0, left: 260}}> 40 </div>
      </div>
    );
  }
}
