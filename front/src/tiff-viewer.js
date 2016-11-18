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

            const new_canvas = document.createElement('canvas');
            new_canvas.width = canvas.width * 2;
            new_canvas.height = canvas.height * 2;
            var ctx = new_canvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width * 2, canvas.height * 2);
            // var ctx = canvas.getContext('2d');
            // ctx.drawImage(canvas, 0, 0, cavwidth, canvas.height, 0, 0, canvas.width * 2, canvas.height * 2);

            const elem = document.getElementById("output_space");
            elem.appendChild(new_canvas);
          }
        });
      });
  }

  getTiffList() {
    return this.tiff_list;
  }
}
