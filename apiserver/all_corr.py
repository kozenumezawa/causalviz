# calculate correlation
import numpy as np
import json

all_time_series = np.load('./data/trp3data.npy')
corr_list = []

for (i, x) in enumerate(all_time_series):
    corr_list.append([-2 for z in range(len(all_time_series))])
    if (x[0] == 0):
        continue

    for (j, y) in enumerate(all_time_series):
        if (y[0] == 0):
            corr_list[i][j] = -2
        else:
            corr_list[i][j] = np.corrcoef(x, y)[0][1]

saveJSON = {
    "data": corr_list
}
f = open("./trp3_corr.json", "w")
json.dump(saveJSON, f)
f.close()
