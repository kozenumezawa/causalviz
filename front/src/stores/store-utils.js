export function getRGBAFromTiff(canvas) {
  const ctx = canvas.getContext('2d');
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const rgba = image.data; // rgba = [R, G, B, A, R, G, B, A, ...] (hex data)
  return rgba;
}

export function getScalarFromGrayCanvas(canvas) {
  const rgba = getRGBAFromTiff(canvas);
  let scalar_list = [];
  for (let i = 0; i < rgba.length / 4; i++) {
    const scalar = rgba[i * 4];  // Use red only because r=g=b in gray scale
    scalar_list.push(scalar);
  }
  return scalar_list;
}

export function transposeTimeSeries(all_time_series_inverse) {
  let time_series = [];
  for (let i = 0; i < all_time_series_inverse[0].length; i++) {
    time_series[i] = [];
    for (let j = 0; j < all_time_series_inverse.length; j++) {
      time_series[i][j] = all_time_series_inverse[j][i];
    }
  }
  return time_series;
}

export function createTimeSeriesInverse(tiff_canvas, legend_canvas) {
  let time_series_inverse = [];
  const tiff_rgba = getRGBAFromTiff(tiff_canvas);
  if (legend_canvas !== null) {
    const legend_rgba = getRGBAFromTiff(legend_canvas);
    const color_map = legend_rgba.slice(0, legend_rgba.length / legend_canvas.height);

    // get scalar from data
    for (let i = 0; i < tiff_rgba.length / 4; i++) {
      let scalar = 0;
      const r = tiff_rgba[i * 4 + 0];
      const g = tiff_rgba[i * 4 + 1];
      const b = tiff_rgba[i * 4 + 2];
      const a = tiff_rgba[i * 4 + 3];
      for (let j = 0; j < color_map.length / 4; j++) {
        if (r === color_map[j * 4 + 0] && g === color_map[j * 4 + 1] && b === color_map[j * 4 + 2] && a === color_map[j * 4 + 3]) {
          scalar = j;
          break;
        }
      }
      time_series_inverse.push(scalar);
    }
  } else {
    // get scalar from data
    for (let i = 0; i < tiff_rgba.length / 4; i++) {
      let scalar = 0;
      const r = tiff_rgba[i * 4 + 0];
      const g = tiff_rgba[i * 4 + 1];
      const b = tiff_rgba[i * 4 + 2];
      const a = tiff_rgba[i * 4 + 3];
      scalar = r;
      time_series_inverse.push(scalar);
    }
  }

  return time_series_inverse;
}

// create csv file for Python
export function createCsvFromTimeSeries(time_series) {
  const tableToCsvString = function(table, index) {
    const N_DATA = table.length;
    let str = '';
    const imax = N_DATA / 15 * (index + 1);
    for (let i = N_DATA / 15 * index; i < imax; ++i) {
      let row = table[i];
      for (let j = 0, jmax = row.length - 1; j <= jmax; ++j) {
        str += String(row[j]);
        if (j !== jmax) {
          str += ',';
        }
      }
      str += '\n';
    }
    return str;
  };

  const createDataUriFromString = function(str) {
    return 'data:text/csv,' + encodeURIComponent(str);
  };

  const downloadDataUri = function(uri, filename) {
    let link = document.createElement('a');
    link.download = filename;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCsv = function(table) {
    for (let i = 0; i < 15; i++) {
      const filename = 'timeseries_' + String(i) + '.csv';
      const uri = createDataUriFromString(tableToCsvString(table, i));
      downloadDataUri(uri, filename);
    }
  };
  downloadCsv(time_series);
  // console.log(time_series.length); -> 37050
}
