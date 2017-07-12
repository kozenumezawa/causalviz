# calculate causal direction using cross correlation from each point to every point

import numpy as np
import json
import math

if __name__ == "__main__":
    mean_step = 3

    # input_file_name = "trp3data_mean.npy"
    # output_file_name = "trp3_corr_directed.json"
    # width = 128

    # input_file_name = "wilddata_mean.npy"
    # output_file_name = "wild_corr.json"
    # width = 285
    # mean_step = 5

    input_file_name = "gaussian_wave.npy"
    output_file_name = "gaussian_corr.json"
    width = 128


    all_time_series = np.load("./data/" + input_file_name)
    all_time_series = np.array(all_time_series, dtype=np.float)

    corr_list = []

    for (i, x) in enumerate(all_time_series):
        if (sum(x) == 0 or (i % width) % mean_step != 1 or math.floor(i / width) % mean_step != 0):
            corr_list.append([])
            continue

        corr_list.append([0 for _ in range(len(all_time_series))])

        lag = 5
        back_x = x[lag:]
        front_x = x[:len(x)-lag]
        for (j, y) in enumerate(all_time_series):
            if (sum(y) == 0  or (j % width) % mean_step != 1 or math.floor(j / width) % mean_step != 0):
                corr_list[i][j] = 0
            else:
                corr = np.corrcoef(x, y)[0][1]
                if math.isnan(corr):
                    corr_list[i][j] = 0
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
    f = open("./data/" + output_file_name, "w")
    json.dump(saveJSON, f)
    f.close()
