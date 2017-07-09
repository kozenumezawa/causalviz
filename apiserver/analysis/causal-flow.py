# calculate correlation
import numpy as np
import json
import math
from CausalCalculator import CausalCalculator

def calcCausalFlow(granger_list):
    flow_x = 0
    flow_y = 0

    for i in [-1, 0, 1]:
        flow_x += -1 * granger_list[-1 + 1][i + 1] + granger_list[1 + 1][i + 1]
        flow_y += -1 * granger_list[i + 1][-1 + 1] + granger_list[i + 1][1 + 1]
    return [flow_x, flow_y]

if __name__ == "__main__":
    mean_step = 3

    # input_file_name = "trp3data_mean.npy"
    # output_file_name = "trp3_flow.json"
    # width = 128

    # input_file_name = "wilddata_mean.npy"
    # output_file_name = "wild_flow.json"
    # width = 285
    # mean_step = 5

    input_file_name = "gaussian_wave.npy"
    output_file_name = "gaussian_flow.json"
    width = 128


    all_time_series = np.load("./data/" + input_file_name)

    vector_list = []

    for (i, x) in enumerate(all_time_series):
        x = x.astype(np.float32)
        if (sum(x) == 0 or (i % width) % mean_step != 1 or math.floor(i / width) % mean_step != 0):
            vector_list.append([])
            continue

        granger_list = []
        for x_idx in [-1, 0, 1]:
            row_granger = []
            for y_idx in [-1, 0, 1]:
                if x_idx == 0 and y_idx == 0:
                    row_granger.append(0)
                    continue
                y = all_time_series[i + x_idx + y_idx * width]
                y = y.astype(np.float32)
                if (sum(y) == 0):
                    row_granger.append(0)
                    continue
                calc_yx = CausalCalculator(X=y[:, np.newaxis], Y_cause=x[:, np.newaxis])
                k, m = 1, 5
                Gx_to_y = calc_yx.calcGrangerCausality(k=k, m=m)
                row_granger.append(Gx_to_y)
            granger_list.append(row_granger)
        vector_list.append(calcCausalFlow(granger_list))

    saveJSON = {
        "data": vector_list
    }
    f = open("./data/" + output_file_name, "w")
    json.dump(saveJSON, f)
    f.close()
