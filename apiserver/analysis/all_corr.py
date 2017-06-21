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
    if (0 in x or (i % width) % mean_step != 1 or math.floor(i / width) % mean_step != 0):
        corr_list.append([])
        continue
    corr_list.append([-2 for z in range(len(all_time_series))])

    for (j, y) in enumerate(all_time_series):
        y = y.astype(np.float32)
        if (0 in y or (j % width) % mean_step != 1 or math.floor(j / width) % mean_step != 0):
            corr_list[i][j] = -2
        else:
            corr = np.corrcoef(x, y)[0][1]
            if math.isnan(corr):
                corr_list[i][j] = -2
            else:
                corr_list[i][j] = np.round(corr, 2)

saveJSON = {
    "data": corr_list
}
f = open("./data/trp3_corr.json", "w")
json.dump(saveJSON, f)
f.close()
