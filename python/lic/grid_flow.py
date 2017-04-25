# coding: utf-8
import numpy as np
import csv
import math
import pylab as plt

import matplotlib.pyplot as plt

if __name__ == "__main__":
    all_time_series = []
    for i in range(15):
        file_name = '../timeseries_data/timeseries_' + str(i) + '.csv'
        f = open(file_name, 'r')
        dataReader = csv.reader(f)
        for row in dataReader:
            all_time_series.append(row[0:80])

    all_time_series = np.array(all_time_series)
    all_time_series = all_time_series.astype(np.float64)
    # print(all_time_series.shape)  #-> (37050, 80)


    win_pixels = 1
    win_frames = 20
    max_lag = 10
    width = 285
    height = 130

    X = []
    Y = []
    U = []
    V = []

    all_vectors = np.load('./npy/flow_vectors.npy')
    for frame in range(all_vectors.shape[0]):
        for (center_pixel, time_series) in enumerate(all_time_series):
            x = center_pixel % width
            y = center_pixel / width
            X.append(x)
            Y.append(y)
            U.append(all_vectors[frame][y][x][0])
            V.append(all_vectors[frame][y][x][1])

        plt.figure()
        plt.quiver(X, Y, U, V, angles='xy', scale_units='xy', scale=1)
        # plt.xlim([-1,3])
        # plt.ylim([-1,3])
        plt.grid()
        plt.draw()
        plt.show()
