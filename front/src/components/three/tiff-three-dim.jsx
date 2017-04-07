import React from 'react';

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

export default class TiffThreeDim extends React.Component{
  constructor(props) {
    super(props);

    const width = 500;
    const height = 500;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.z = 30;

    this.renderer.render(this.scene, this.camera);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new THREE.Vector3(0, 0, 0);

    this.animate = this.animate.bind(this);

    this.createBox();
  }


  componentDidMount() {
    document.getElementById('three-view').appendChild(this.renderer.domElement);
    this.animate();
  }

  componentWillUnmount() {
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  createBox() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    this.box = new THREE.Mesh(this.geometry, this.material);
    this.box.position.z = 0;

    this.scene.add(this.box);
  }

  render() {
    return (
      <div id="three-view" style={{position: 'absolute', display: 'inline-block', top: 500, left: 50}}>
      </div>
    );
  }
}
