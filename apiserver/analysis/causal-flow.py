# calculate correlation
import numpy as np
import json
import math
from CausalCalculator import CausalCalculator

def calcCausalFlow(granger_list):
    flow_x = 0
    flow_y = 0
    intensity = 0

    for i in [-1, 0, 1]:
        flow_x += -1 * granger_list[-1 + 1][i + 1] + granger_list[1 + 1][i + 1]
        flow_y += -1 * granger_list[i + 1][-1 + 1] + granger_list[i + 1][1 + 1]

    for i in [-1, 0, 1]:
        for j in [-1, 0, 1]:
            intensity += granger_list[i + 1][j + 1]
    intensity *= math.sqrt(flow_x * flow_x + flow_y * flow_y)
    return [flow_x, flow_y, intensity]

def isOutside(idx, N):
    if idx < 0 or idx >= N:
        return True
    return False

def getCausalFlow(all_time_series, x_block_center, mean_step, N):
    if (sum(all_time_series[x_block_center]) == 0 or (x_block_center % width) % mean_step != 1 or math.floor(x_block_center / width) % mean_step != 0):
        return []
    x_block = []
    for y_idx in block_idx:
        for x_idx in block_idx:
            if isOutside(x_block_center + x_idx + (width * y_idx), N):
                continue
            x_block.append(all_time_series[x_block_center + x_idx + (width * y_idx)])
    x_block = np.array(x_block)
    x_block = x_block.T

    granger_list = []
    for block_x_idx in [-mean_step, 0, mean_step]:
        row_granger = []
        for block_y_idx in [-mean_step, 0, mean_step]:
            if block_x_idx == 0 and block_y_idx == 0:
                row_granger.append(0)
                continue
            y_block_center_idx = x_block_center + block_x_idx + block_y_idx * width

            if (isOutside(y_block_center_idx, N) or sum(all_time_series[y_block_center_idx]) == 0):
                row_granger.append(0)
                return []

            y_block = []
            for y_idx in block_idx:
                for x_idx in block_idx:
                    if isOutside(y_block_center_idx + x_idx + (width * y_idx), N):
                        return []
                    y_block.append(all_time_series[y_block_center_idx + x_idx + (width * y_idx)])
            y_block = np.array(y_block)
            y_block = y_block.T

            calc_yx = CausalCalculator(X=y_block, Y_cause=x_block)
            k, m = 1, 1
            Gx_to_y = calc_yx.calcGrangerCausality(k=k, m=m)
            row_granger.append(Gx_to_y)
        granger_list.append(row_granger)
    return calcCausalFlow(granger_list)

if __name__ == "__main__":
    mean_step = 3
    block_r = 1     # radius of each block
    block_idx = [i for i in range(-block_r, block_r + 1)]

    input_file_name = "trp3data_mean.npy"
    output_file_name = "trp3_flow.json"
    width = 128

    # input_file_name = "wilddata_mean.npy"
    # output_file_name = "wild_flow.json"
    # width = 285
    # mean_step = 5

    # input_file_name = "gaussian_wave_sub.npy"
    # output_file_name = "gaussian_flow.json"
    # width = 128

    all_time_series = np.load("./data/" + input_file_name)
    all_time_series = all_time_series.astype(np.float32)
    N = all_time_series.shape[0]

    vector_list = []
    for (x_block_center, _) in enumerate(all_time_series):
        vector_list.append(getCausalFlow(all_time_series, x_block_center, mean_step, N))

    saveJSON = {
        "data": vector_list
    }
    f = open("./data/" + output_file_name, "w")
    json.dump(saveJSON, f)
    f.close()
