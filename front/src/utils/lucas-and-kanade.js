
// @params
//
// all_time_series[area][time_step] : scalar not RGBA format
// old_time_step
// new_time_step

export function lucasAndKanade(all_time_series, old_time_step, new_time_step, width, height, step) {
  let u =0, v = 0, uu = 0, vv = 0;
  let zones = [];

  const win_step = step * 2 + 1;

  const w_max = width - step - 1;
  const h_max = height - step - 1;

  for (let global_y = step + 1; global_y < h_max; global_y += win_step) {
    for (let global_x = step + 1; global_x < w_max; global_x += win_step) {
      let A2 = 0, A1B2 = 0, B1 = 0, C1 = 0, C2 = 0;

      for (let local_y = -step; local_y <= step; local_y++) {
        for (let local_x = -step; local_x <= step; local_x++) {
          const address = (global_y + local_y) * width + global_x + local_x;
          const gradX = all_time_series[address - 1][new_time_step] - all_time_series[address + 1][new_time_step];
          const gradY = all_time_series[address - width][new_time_step] - all_time_series[address + width][new_time_step];
          const gradT = all_time_series[address][old_time_step] - all_time_series[address][new_time_step]

          A2 += gradX * gradX;
          A1B2 += gradX * gradY;
          B1 += gradY * gradY;
          C2 += gradX * gradT;
          C1 += gradY * gradT;
        }
      }

      const delta = (A1B2 * A1B2 - A2 * B1);

      if (delta !== 0) {
        /* system is not singular - solving by Kramer method */
        const I_delta = step / delta;
        const delta_x = -(C1 * A1B2 - C2 * B1);
        const delta_y = -(A1B2 * C2 - A2 * C1);

        u = delta_x * I_delta;
        v = delta_y * I_delta;
      } else {
        /* singular system - find optical flow in gradient direction */
        const norm = (A1B2 + A2) * (A1B2 + A2) + (B1 + A1B2) * (B1 + A1B2);
        if (norm !== 0) {
          const I_grad_norm = step / norm;
          const temp = -(C1 + C2) * I_grad_norm;

          u = (A1B2 + A2) * temp;
          v = (B1 + A1B2) * temp;
        } else {
          u = 0;
          v = 0;
        }
      }

      if (-win_step < u && u < win_step && -win_step < v && v < win_step) {
        uu += u;
        vv += v;
        zones.push({
          x: global_x,
          y: global_y,
          u: u,
          v: v
        });
      }
    }
  }

  return {
    zones : zones,
    u : uu / zones.length,
    v : vv / zones.length
  };
}