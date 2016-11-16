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
            document.body.append(canvas);
          }
        });
      });
  }

  getTiffList() {
    return this.tiff_list;
  }
}
