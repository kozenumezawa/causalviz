# calculate correlation
import numpy as np
import json
import math

# input_file_name = "trp3data_mean.npy"
# output_file_name = "trp3_corr.json"
# width = 128

input_file_name = "wilddata_mean.npy"
output_file_name = "wild_corr.json"
width = 285

# input_file_name = "gaussian_wave.npy"
# output_file_name = "gaussian_corr.json"
# width = 128


mean_step = 3

all_time_series = np.load("./data/" + input_file_name)

corr_list = []

for (i, x) in enumerate(all_time_series):
    x = x.astype(np.float32)
    if (sum(x) == 0 or (i % width) % mean_step != 1 or math.floor(i / width) % mean_step != 0):
        corr_list.append([])
        continue
    corr_list.append([-2 for z in range(len(all_time_series))])

    for (j, y) in enumerate(all_time_series):
        y = y.astype(np.float32)
        if (sum(y) == 0 or (j % width) % mean_step != 1 or math.floor(j / width) % mean_step != 0):
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
f = open("./data/" + output_file_name, "w")
json.dump(saveJSON, f)
f.close()
