# calculate correlation
import numpy as np
import json
import math

mean_step = 3

all_time_series = np.load('./data/trp3data_mean.npy')
width = 128

corr_list = []

for (i, x) in enumerate(all_time_series):
    x = x.astype(np.float32)
    if (sum(x) == 0 or (i % width) % mean_step != 1 or math.floor(i / width) % mean_step != 0):
        corr_list.append([])
        continue
    corr_list.append([-2 for z in range(len(all_time_series))])

    lag = 5
    back_x = x[lag:]
    front_x = x[:len(x)-lag]
    for (j, y) in enumerate(all_time_series):
        y = y.astype(np.float32)
        if (sum(y) == 0  or (j % width) % mean_step != 1 or math.floor(j / width) % mean_step != 0):
            corr_list[i][j] = -2
        else:
            corr = np.corrcoef(x, y)[0][1]
            if math.isnan(corr):
                corr_list[i][j] = -2
                continue

            back_corr = np.corrcoef(back_x, y[:len(y)-lag])[0][1]
            front_corr = np.corrcoef(front_x, y[lag:])[0][1]

            each_corr = [back_corr, corr, front_corr]
            max_idx = each_corr.index(max(each_corr))

            if max_idx == -1:
                corr_list[i][j] = 0
            elif max_idx == 0:
                corr_list[i][j] = 0
            else:
                corr_list[i][j] = front_corr

saveJSON = {
    "data": corr_list
}
f = open("./data/trp3_corr.json", "w")
json.dump(saveJSON, f)
f.close()
