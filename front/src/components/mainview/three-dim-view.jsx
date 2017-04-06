import React from 'react';

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

export default class ThreeDimView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const width = 500;
    const height = 500;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.geometry = new THREE.BoxGeometry(20, 20, 20);
    this.material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    this.box = new THREE.Mesh(this.geometry, this.material);
    this.box.position.z = 0;

    this.scene.add(this.box);
    this.light = new THREE.DirectionalLight(0xffffff);
    this.scene.add(this.light);
    this.light.position.set(30, 30, 30);

    this.renderer.render(this.scene, this.camera);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new THREE.Vector3(30, 30, 30);

    this.animate = this.animate.bind(this);
    document.getElementById('three-view').appendChild(this.renderer.domElement);
    this.animate();
  }

  componentWillUnmount() {
    this.renderer = null;
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div id="three-view" style={{position: 'absolute', display: 'inline-block', top: 500, left: 50}}>
      </div>
    );
  }
}
