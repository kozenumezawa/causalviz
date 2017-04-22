# coding: utf-8
import numpy as np
import csv
import math

def circular_window(k):
    import scipy.spatial.distance as distance
    n_col = 2 * k + 1
    win = np.zeros((n_col, n_col))

    for i in range(n_col):
        for j in range(n_col):
            a = distance.pdist(np.array([[i + 1, j + 1], [k + 1, k + 1]]))
            if k % 2 == 0:
                if a > min(math.sqrt(5 * k * k / 4 - 3 * k + 2), k) and a <= math.sqrt(5 * k * k / 4 - k + 1):
                    win[i, j] = 1
            else:
                if a >= min(math.sqrt(2) * (k - 1), k) and a <= math.sqrt(5 * k * k / 4 - k / 2 + 1 / 4):
                    win[i, j] = 1
    return win

def temporo_spatial(k, corr_win, frames, max_lag):
    win = circular_window(k)
    return win

if __name__ == "__main__":
    all_time_series = []
    for i in range(15):
        file_name = './timeseries_data/timeseries_' + str(i) + '.csv'
        f = open(file_name, 'r')
        dataReader = csv.reader(f)
        for row in dataReader:
            all_time_series.append(row[0:80])

    all_time_series = np.array(all_time_series)
    # print(all_time_series.shape)  #-> (37050, 80)

    corr_win_pixels = 4
    corr_win_frames = 20
    target_frames = math.floor(corr_win_frames / 2)
    max_lag = 10

    print (temporo_spatial(corr_win_pixels, corr_win_frames, target_frames, max_lag))
