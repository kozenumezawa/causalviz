# coding: utf-8
import numpy as np
import csv
import math

def get_lag_maximizing_corr(frame, target_pixel, all_time_series, win_frames, max_lag, width, height):
    if np.sum(all_time_series[target_pixel]) == 0:
        return 0
    n_frames = width * height
    win_frames = int(2 * math.floor(win_frames / 2))
    start_frame = max(0, frame - win_frames / 2)
    stop_frame = min(n_frames - 1, frame + win_frames / 2)
    if start_frame == 0:
        stop_frame = win_frames
    elif stop_frame == width * height - 1:
        start_frame = n_frames - win_frames

    target_time_series = all_time_series[target_pixel][start_frame:stop_frame]

    corr_list = []
    idx_list = []
    for x in [-1, 0, 1]:
        for y in [-1, 0, 1]:
            if x == 0 and y == 0:
                continue
            idx = target_pixel + x + y * width
            if idx < 0 or idx >= width * height:
                continue
            # Todo: shift time series
            y_time_series = all_time_series[idx][start_frame:stop_frame]
            corr_list.append(np.corrcoef(target_time_series, y_time_series)[0][1])
            idx_list.append([idx)




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
    all_time_series = all_time_series.astype(np.float64)
    # print(all_time_series.shape)  #-> (37050, 80)


    win_pixels = 1
    win_frames = 20
    max_lag = 10
    width = 285
    height = 130
    for frame in range(all_time_series.shape[1]):
        for (target_pixel, time_series) in enumerate(all_time_series):
            lag = get_lag_maximizing_corr(frame, target_pixel, all_time_series, win_frames, max_lag, width, height)
            if lag == 0:
                lag = 'error'
