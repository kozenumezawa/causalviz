# calculate granger causality from each point to every point
import numpy as np
import json
import math
from CausalCalculator import CausalCalculator

def isOutside(idx, N):
    if idx < 0 or idx >= N:
        return True
    return False

if __name__ == "__main__":
    mean_step = 3
    k, m = 1, 20

    input_file_name = "trp3data_mean.npy"
    output_file_name = "trp3_granger.json"
    width = 128

    # input_file_name = "wilddata_mean.npy"
    # output_file_name = "wild_granger.json"
    # width = 285
    # mean_step = 5

    # input_file_name = "gaussian_wave_sub.npy"
    # output_file_name = "gaussian_granger.json"
    # width = 128


    all_time_series = np.load("./data/" + input_file_name)
    all_time_series = np.array(all_time_series, dtype=np.float)
    N = all_time_series.shape[0]

    granger_list = []

    for (i, x) in enumerate(all_time_series):
        if i % 100 == 0:
            print i

        if (sum(x) == 0 or (i % width) % mean_step != 1 or math.floor(i / width) % mean_step != 0):
            granger_list.append([])
            continue

        granger_list.append([0 for _ in range(len(all_time_series))])
        for y_idx in range(-10, 10):
            for x_idx in range(-10, 10):
                j = i + x_idx + (width * y_idx)
                if isOutside(j, N):
                    continue
                y = all_time_series[j]
                if (sum(y) == 0 or (j % width) % mean_step != 1 or math.floor(j / width) % mean_step != 0):
                    granger_list[i][j] = 0
                    continue
                granger_calculator = CausalCalculator(X=y[:, np.newaxis], Y_cause=x[:, np.newaxis])
                Gx_to_y = granger_calculator.calcGrangerCausality(k=k, m=m)
                granger_list[i][j] = Gx_to_y

    saveJSON = {
        "data": granger_list
    }
    f = open("./data/" + output_file_name, "w")
    json.dump(saveJSON, f)
    f.close()
