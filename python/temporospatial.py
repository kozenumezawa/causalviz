# coding: utf-8
import numpy as np
import csv
import math

def circular_window(k):
    return 1

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

    corr_win_pixels = 3
    corr_win_frames = 20
    target_frames = math.floor(corr_win_frames / 2)
    max_lag = 10

    print (temporo_spatial(corr_win_pixels, corr_win_frames, target_frames, max_lag))
