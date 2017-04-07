import React from 'react';

import TiffThreeDim from '../three/tiff-three-dim.jsx'

export default class ThreeDimView extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <TiffThreeDim />
      </div>
    );
  }
}
