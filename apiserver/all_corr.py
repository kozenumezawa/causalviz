# calculate correlation
import numpy as np
import json
import math

all_time_series = np.load('./data/trp3data.npy')
corr_list = []

for (i, x) in enumerate(all_time_series):
    x = x.astype(np.float32)
    corr_list.append([-2 for z in range(len(all_time_series))])
    if (0 in x):
        continue

    for (j, y) in enumerate(all_time_series):
        y = y.astype(np.float32)
        if (0 in y):
            corr_list[i][j] = -2
        else:
            corr = np.corrcoef(x, y)[0][1]
            if math.isnan(corr):
                corr_list[i][j] = -2
            else:
                corr_list[i][j] = corr

saveJSON = {
    "data": corr_list
}
f = open("./trp3_corr.json", "w")
json.dump(saveJSON, f)
f.close()
