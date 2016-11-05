const OrbitControls = require('three-orbit-controls')(THREE);

export default class ThreeRenderer {
  constructor() {
    const width = 500;
    const height = 500;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    document.getElementById('output_space').appendChild(this.renderer.domElement);

    const geometry = new THREE.CubeGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
    this.camera.position.z = 5;

    this.threeRender();

    window.fetch('ocean.json')
      .then((response) => response.json())
      .then((data) => {
        this.retrieveData(data);
      });
  }

  retrieveData(data) {
    const ocean_data = data.data_list;
    ocean_data.forEach((element, idx) => {
      console.log(element);
    });
  }

  threeRender() {
    requestAnimationFrame(this.threeRender.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}