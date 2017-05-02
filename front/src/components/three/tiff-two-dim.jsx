import React from 'react';

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

export default class TiffThreeDim extends React.Component{
  constructor(props) {
    super(props);
    this.mesh = null;

    const width = 500;
    const height = 500;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1500);
    this.camera.position.x = 63;
    this.camera.position.y = -147;
    this.camera.position.z = 180;

    this.renderer.render(this.scene, this.camera);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.target = new THREE.Vector3(this.camera.position.x, -50, 0);

    this.animate = this.animate.bind(this);

    this.axis = new THREE.AxisHelper(1000);
    this.scene.add(this.axis);
    this.createBox(props.canvas_width, props.canvas_height, props.tiff_list, props.tiff_index, props.time_series);
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
    if (tiff_list.length === 0) {
      return;
    }
    const canvas = tiff_list[tiff_index];
    const ctx = canvas.getContext('2d');
    const tiff_image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tiff_rgba = tiff_image.data; // image_rgba = [R, G, B, A, R, G, B, A, ...] (hex data)

    this.geometry = new THREE.Geometry();

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const r = tiff_rgba[(i * width + j ) * 4 + 0] / 255;
        const g = tiff_rgba[(i * width + j ) * 4 + 1] / 255;
        const b = tiff_rgba[(i * width + j ) * 4 + 2] /  255;
        if (r === 0 && g === 0 && b === 0) {
          continue;
        }
        const pixel_color = new THREE.Color(r, g, b);

        const length = 1;
        this.addPlaneToGeometry(j, -i, 0, 1, 1, pixel_color);
      }
    }

    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();

    this.material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  addPlaneToGeometry(x, y, z, width, height, color) {
      const vertex_0 = this.geometry.vertices.push(new THREE.Vector3(x        , y         , z)) - 1;
      const vertex_1 = this.geometry.vertices.push(new THREE.Vector3(x + width, y         , z)) - 1;
      const vertex_2 = this.geometry.vertices.push(new THREE.Vector3(x + width, y + height, z)) - 1;
      const vertex_3 = this.geometry.vertices.push(new THREE.Vector3(x        , y + height, z)) - 1;

      this.geometry.faces.push(new THREE.Face3(vertex_0, vertex_1, vertex_2, null, color));
      this.geometry.faces.push(new THREE.Face3(vertex_0, vertex_2, vertex_3, null, color));
  }

  addBoxToGeometry(x, y, z, width , height, length, color) {
    const vertex_0 = this.geometry.vertices.push(new THREE.Vector3(x        , y         , z)) - 1;
    const vertex_1 = this.geometry.vertices.push(new THREE.Vector3(x + width, y         , z)) - 1;
    const vertex_2 = this.geometry.vertices.push(new THREE.Vector3(x + width, y + height, z)) - 1;
    const vertex_3 = this.geometry.vertices.push(new THREE.Vector3(x        , y + height, z)) - 1;
    const vertex_4 = this.geometry.vertices.push(new THREE.Vector3(x        , y         , length)) - 1;
    const vertex_5 = this.geometry.vertices.push(new THREE.Vector3(x + width, y         , length)) - 1;
    const vertex_6 = this.geometry.vertices.push(new THREE.Vector3(x + width, y + height, length)) - 1;
    const vertex_7 = this.geometry.vertices.push(new THREE.Vector3(x        , y + height, length)) - 1;

    this.geometry.faces.push(new THREE.Face3(vertex_0, vertex_2, vertex_1, null, color));
    this.geometry.faces.push(new THREE.Face3(vertex_0, vertex_3, vertex_2, null, color));

    this.geometry.faces.push(new THREE.Face3(vertex_1, vertex_6, vertex_5, null, color));
    this.geometry.faces.push(new THREE.Face3(vertex_1, vertex_2, vertex_6, null, color));

    this.geometry.faces.push(new THREE.Face3(vertex_0, vertex_5, vertex_4, null, color));
    this.geometry.faces.push(new THREE.Face3(vertex_0, vertex_1, vertex_5, null, color));

    this.geometry.faces.push(new THREE.Face3(vertex_0, vertex_7, vertex_3, null, color));
    this.geometry.faces.push(new THREE.Face3(vertex_0, vertex_4, vertex_7, null, color));

    this.geometry.faces.push(new THREE.Face3(vertex_3, vertex_6, vertex_2, null, color));
    this.geometry.faces.push(new THREE.Face3(vertex_3, vertex_7, vertex_6, null, color));

    this.geometry.faces.push(new THREE.Face3(vertex_4, vertex_6, vertex_7, null, color));
    this.geometry.faces.push(new THREE.Face3(vertex_4, vertex_5, vertex_6, null, color));
  }

  removeAllBox() {
    if (this.mesh === null) {
      return;
    }

    this.scene.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
    this.mesh = null;
  }

  render() {
    return (
      <div id="three-view" style={{position: 'absolute', display: 'inline-block', top: 500, left: 50}}>
      </div>
    );
  }
}
