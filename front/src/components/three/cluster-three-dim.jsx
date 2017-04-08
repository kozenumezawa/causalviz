import React from 'react';
import * as d3_scale from 'd3-scale';

import * as pairTimeSeries from '../../utils/pair-time-series'

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

export default class ClusterThreeDim extends React.Component{
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
  }


  componentDidMount() {
    document.getElementById('three-view').appendChild(this.renderer.domElement);
    this.animate();
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
    this.removeAllBox();
    this.createBox(nextProps.canvas_width, nextProps.canvas_height, nextProps.cluster_list);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  createBox(width, height, cluster_list) {
    this.geometry = new THREE.Geometry();
    const color_map = d3_scale.schemeCategory20c;

    for(let i = 0; i < cluster_list.length; i++) {
      if (cluster_list[i] === pairTimeSeries.error) {
        continue;
      }
      const pixel_color = new THREE.Color(parseInt((color_map[cluster_list[i]].slice(1)), 16));
      const length = cluster_list[i];
      this.addBoxToGeometry(i % width, - (i / width), 0, 1, 1, length, pixel_color);
    }

    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();

    this.material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
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
      <div id="three-view" style={{position: 'absolute', display: 'inline-block', top: 400, left: 50}}>
      </div>
    );
  }
}
