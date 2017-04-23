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

def matlab_find(np_array, value):
    if np_array.ndim == 1:
        x_list = []
        y_list = []
        for (i, x) in enumerate(np_array):
            if x == value:
                x_list.append(i)
                y_list.append(0)
        x = np.array(x_list)
        y = np.array(y_list)
    else:
        [y, x] = np.where(np.transpose(np_array) == value)
    return [x, y]

def templates(k, points):
    points_dim = points.ndim
    direction = np.zeros(points.ndim, 1)

def temporo_spatial(k, corr_win, frames, max_lag):
    dim1 = 285
    dim2 = 130
    win = circular_window(k)

    k_half = int(math.ceil((k + 1.0) / 2.0))

    a1 = np.array([])
    if k % 2 == 0:
        a1 = win[:k_half - 1]
    else:
        a1 = win[:k_half]

    a1flip = np.flipud(a1)
    [x1, y1] = matlab_find(a1flip, 1)

    a2 = win[k + k_half:]
    [x2, y2] = matlab_find(a2, 1)

    a3 = np.transpose(win[0][k_half : k + k_half])
    [x3, y3] = matlab_find(a3, 1)

    a4 = np.transpose(win[win.shape[1] - 1][k_half : k + k_half])
    [x4, y4] = matlab_find(a4, 1)

    points = np.array([[k + k_half + np.flipud(x2), np.flipud(y2)],
                       [k_half + np.flipud(x3), y3],
                       [k_half + 1 - x1, y1],
                       [k_half + x4, 2 * k + y4]])

    # a = np.zeros((2 * k + 1, 2 * k + 1))
    # for i in range(points.ndim):
    #     a[points[i][0]][points[i][1]] = 1
    [T1, T2, T3, T4] = templates(k, points)
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

    corr_win_pixels = 2
    corr_win_frames = 20
    target_frames = math.floor(corr_win_frames / 2)
    max_lag = 10

    temporo_spatial(corr_win_pixels, corr_win_frames, target_frames, max_lag)
