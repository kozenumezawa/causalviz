export default class TiffViewer {
  constructor () {
    this.tiff_list = [];
    window.fetch('Substack.tif')
      .then((response) => {
        response.arrayBuffer().then((buffer) => {
          const tiff = new Tiff({ buffer: buffer });
          for (let i = 0, len = tiff.countDirectory(); i < len; i++) {
            tiff.setDirectory(i);
            const canvas = tiff.toCanvas();
            this.tiff_list.push(canvas);
            this.appendCanvas(canvas, "output_space");
          }
        });
      });
  }

  appendCanvas(canvas, id) {
    const display_canvas = document.createElement('canvas');
    const bias = 3;
    display_canvas.width = canvas.width * bias;
    display_canvas.height = canvas.height * bias;
    const ctx = display_canvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width * bias, canvas.height * bias);

    const elem = document.getElementById(id);
    elem.appendChild(display_canvas);
  }

  removeCanvas(canvas, id) {

  }

  getTiffList() {
    return this.tiff_list;
  }
}
