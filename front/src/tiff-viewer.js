export default class TiffViewer {
  constructor () {
    window.fetch('Substack.tif')
      .then((response) => {
        response.arrayBuffer().then((buffer) => {
          const tiff = new Tiff({ buffer: buffer });
          for (let i = 0, len = tiff.countDirectory(); i < len; i++) {
            tiff.setDirectory(i);
            var canvas = tiff.toCanvas();
            document.body.append(canvas);
          }
        });
      });
  }
}
