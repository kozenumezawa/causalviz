import React from 'react'
import ThreeContainer from './components/three-container'

export default class main extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <ThreeContainer />
      </div>
    );
  }
}