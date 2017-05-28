import React from 'react';

export default class GraphLegend extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div style={{position: 'relative', display: 'inline-block', top:-160, left: -45}}> 100 </div>
        <div style={{position: 'relative', display: 'inline-block', top:-20, left: -70}}> -50 </div>

        <div style={{position: 'relative', display: 'inline-block', top:0, left: -70}}> -1.8 </div>
        <div style={{position: 'relative', display: 'inline-block', top:0, left: 120}}> Time (s)</div>
        <div style={{position: 'relative', display: 'inline-block', top:0, left: 260}}> 32</div>
      </div>
    );
  }
}
