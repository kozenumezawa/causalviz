import React from 'react';

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

export default class TiffThreeDim extends React.Component{
  constructor(props) {
    super(props);

    this.boxes = [];

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

    this.axis = new THREE.AxisHelper(1000);
    this.scene.add(this.axis);

    this.createBox();
  }


  componentDidMount() {
    document.getElementById('three-view').appendChild(this.renderer.domElement);
    this.animate();
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
    this.createBox(nextProps.canvas_width, nextProps.canvas_height);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  createBox(width, height) {
    for (let i = 0; i < height; i++) {
      this.boxes[i] = [];

      for (let j = 0; j < width; j++) {
        const length = i;
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const c = 0x0000ff * (i / height);
        const material = new THREE.MeshBasicMaterial({ color: c });
        this.boxes[i][j] = new THREE.Mesh(geometry, material);

        this.boxes[i][j].position.x = j;
        this.boxes[i][j].position.y = -i;
        this.boxes[i][j].position.z = length / 2;

        this.scene.add(this.boxes[i][j]);
      }
    }
  }

  render() {
    return (
      <div id="three-view" style={{position: 'absolute', display: 'inline-block', top: 500, left: 50}}>
      </div>
    );
  }
}
