import React from 'react';

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

export default class TiffThreeDim extends React.Component{
  constructor(props) {
    super(props);

    this.geometries = [];
    this.materials = [];
    this.boxes = [];

    const width = 500;
    const height = 500;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.x = 100;
    this.camera.position.y = -70;
    this.camera.position.z = 450;

    this.renderer.render(this.scene, this.camera);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.target = new THREE.Vector3(this.camera.position.x, this.camera.position.y, 0);

    this.animate = this.animate.bind(this);

    this.axis = new THREE.AxisHelper(1000);
    this.scene.add(this.axis);
  }


  componentDidMount() {
    document.getElementById('three-view').appendChild(this.renderer.domElement);
    this.animate();
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
    this.removeAllBox();
    this.createBox(nextProps.canvas_width, nextProps.canvas_height, nextProps.tiff_list, nextProps.tiff_index, nextProps.time_series);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  createBox(width, height, tiff_list, tiff_index, time_series) {
    const canvas = tiff_list[tiff_index];
    const ctx = canvas.getContext('2d');
    const tiff_image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tiff_rgba = tiff_image.data; // image_rgba = [R, G, B, A, R, G, B, A, ...] (hex data)

    this.geometry = new THREE.Geometry();
    this.geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    this.geometry.vertices.push(new THREE.Vector3(10, 0, 0));
    this.geometry.vertices.push(new THREE.Vector3(10, 10, 0));
    this.geometry.vertices.push(new THREE.Vector3(0, 10, 0));
    this.geometry.vertices.push(new THREE.Vector3(0, 0, 10));
    this.geometry.vertices.push(new THREE.Vector3(10, 0, 10));
    this.geometry.vertices.push(new THREE.Vector3(10, 10, 10));
    this.geometry.vertices.push(new THREE.Vector3(0, 10, 10));

    this.geometry.faces.push(new THREE.Face3(0, 2, 1, null, new THREE.Color(1, 0, 0)));
    this.geometry.faces.push(new THREE.Face3(0, 3, 2, null, new THREE.Color(1, 0, 0)));

    this.geometry.faces.push(new THREE.Face3(1, 6, 5, null, new THREE.Color(1, 0, 0)));
    this.geometry.faces.push(new THREE.Face3(1, 2, 6, null, new THREE.Color(1, 0, 0)));

    this.geometry.faces.push(new THREE.Face3(0, 5, 4, null, new THREE.Color(1, 0, 0)));
    this.geometry.faces.push(new THREE.Face3(0, 1, 5, null, new THREE.Color(1, 0, 0)));

    this.geometry.faces.push(new THREE.Face3(0, 7, 3, null, new THREE.Color(1, 0, 0)));
    this.geometry.faces.push(new THREE.Face3(0, 4, 7, null, new THREE.Color(1, 0, 0)));

    this.geometry.faces.push(new THREE.Face3(3, 6, 2, null, new THREE.Color(1, 0, 0)));
    this.geometry.faces.push(new THREE.Face3(3, 7, 6, null, new THREE.Color(1, 0, 0)));

    this.geometry.faces.push(new THREE.Face3(4, 6, 7, null, new THREE.Color(1, 0, 0)));
    this.geometry.faces.push(new THREE.Face3(4, 5, 6, null, new THREE.Color(1, 0, 0)));

    // this.geometry.faces.push(new THREE.Face3(0, 3, 7));
    // this.geometry.faces.push(new THREE.Face3(0, 7, 4));
    //
    // this.geometry.faces.push(new THREE.Face3(3, 2, 6));
    // this.geometry.faces.push(new THREE.Face3(3, 6, 7));
    //
    // this.geometry.faces.push(new THREE.Face3(4, 7, 6));
    // this.geometry.faces.push(new THREE.Face3(4, 6, 5));

    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();

    this.material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);


    for (let i = 0; i < height; i++) {
      this.geometries[i] = [];
      this.materials[i] = [];
      this.boxes[i] = [];

      for (let j = 0; j < width; j++) {
        const r = tiff_rgba[(i * width + j ) * 4 + 0] / 255;
        const g = tiff_rgba[(i * width + j ) * 4 + 1] / 255;
        const b = tiff_rgba[(i * width + j ) * 4 + 2] / 255;
        if (r === 0 && g === 0 && b === 0) {
          continue;
        }
        const pixel_color = new THREE.Color(r, g, b);

        const length = time_series[i * width + j][tiff_index] / 10;
        this.geometries[i][j] = new THREE.BoxGeometry(1, 1, length);
        this.materials[i][j] = new THREE.MeshBasicMaterial({ color: pixel_color });
        this.boxes[i][j] = new THREE.Mesh(this.geometries[i][j], this.materials[i][j]);
        this.boxes[i][j].position.x = j;
        this.boxes[i][j].position.y = -i;
        this.boxes[i][j].position.z = length / 2;

        this.scene.add(this.boxes[i][j]);
      }
    }
  }

  removeAllBox() {
    if (this.boxes.length !== 0) {
      for (let i = 0; i < this.boxes.length; i++) {
        for (let j = 0; j < this.boxes[i].length; j++) {
          this.scene.remove(this.boxes[i][j]);

          if (this.geometries[i][j] != null) {
            this.geometries[i][j].dispose();
            this.materials[i][j].dispose();
          }
        }
      }
      this.boxes = [];
    }
  }

  render() {
    return (
      <div id="three-view" style={{position: 'absolute', display: 'inline-block', top: 500, left: 50}}>
      </div>
    );
  }
}
