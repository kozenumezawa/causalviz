import React from 'react';

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

export default class ThreeDimView extends React.Component {
  constructor(props) {
    super(props);

    const width = 500;
    const height = 500;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);

    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    const box = new THREE.Mesh(geometry, material);
    box.position.z = 0;

    this.scene.add(box);
    let light = new THREE.DirectionalLight(0xffffff);
    this.scene.add(light);
    light.position.set(1, 1, 1);

    this.renderer.render(this.scene, camera);
    this.controls = new OrbitControls(camera, this.renderer.domElement);
    // this.controls.target = new THREE.Vector3(1, 1, 1);
  }

  componentDidMount() {
    document.getElementById('three-view').appendChild(this.renderer.domElement);
  }
  
  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
  }

  render() {
    return (
      <div id="three-view" style={{position: 'absolute', display: 'inline-block', top: 500, left: 50}}>
      </div>
    );
  }
}
