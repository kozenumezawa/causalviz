# coding: utf-8
import numpy as np
import csv
import math

def get_lag_maximizing_corr(criteria_x, y):
    return 1

if __name__ == "__main__":
    all_time_series = []
    for i in range(15):
        file_name = '../timeseries_data/timeseries_' + str(i) + '.csv'
        f = open(file_name, 'r')
        dataReader = csv.reader(f)
        for row in dataReader:
            all_time_series.append(row[0:80])

    all_time_series = np.array(all_time_series)
    # print(all_time_series.shape)  #-> (37050, 80)

    for time_step in range(all_time_series.shape[1]):
        for (pixel_index, time_series) in enumerate(all_time_series):
            print(time_step, pixel_index)

    corr_win_pixels = 2
    corr_win_frames = 20
    target_frames = math.floor(corr_win_frames / 2)
    max_lag = 10
