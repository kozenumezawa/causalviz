# coding: utf-8
import numpy as np
import csv
import math
import pylab as plt

import lic_internal

def get_lag_maximizing_corr(frame, center_pixel, all_time_series, win_frames, max_lag, width, height):
    if np.sum(all_time_series[center_pixel]) == 0:
        return np.array([0, 0]).astype(np.float64)
    n_frames = all_time_series.shape[1]
    n_pixels = width * height

    win_frames = int(2 * math.floor(win_frames / 2))
    start_frame = max(0, frame - win_frames / 2)
    stop_frame = min(n_frames - 1, frame + win_frames / 2)
    if start_frame == 0:
        stop_frame = win_frames
    elif stop_frame == width * height - 1:
        start_frame = n_frames - win_frames

    corr_list = []
    lag_list = []
    pixel_list = []
    vec_list = []
    ROOT_INV = 1 / math.sqrt(2)
    for x in [-1, 0, 1]:
        for y in [-1, 0, 1]:
            if x == 0 and y == 0:
                continue
            pixel = center_pixel + x + y * width
            if pixel < 0 or pixel >= n_pixels:
                continue
            y_time_series = all_time_series[pixel][start_frame:stop_frame]
            if np.sum(y_time_series) == 0:
                return np.array([0, 0]).astype(np.float64)

            lag_range = int(math.floor(max_lag / 2))
            for lag in range(-lag_range, lag_range):
            # for lag in range(0, lag_range):
                if start_frame + lag < 0 or stop_frame + lag >= n_frames:
                    continue
                center_time_series = all_time_series[center_pixel][start_frame + lag : stop_frame + lag]
                corr_list.append(np.corrcoef(center_time_series, y_time_series)[0][1])
                lag_list.append(lag)
                pixel_list.append(pixel)
                if [x, y] == [-1, -1]:
                    vec_list.append(np.array([-ROOT_INV, -ROOT_INV]))
                elif [x, y] == [-1, 0]:
                    vec_list.append(np.array([-1, 0]))
                elif [x, y] == [-1, 1]:
                    vec_list.append(np.array([-ROOT_INV, ROOT_INV]))
                elif [x, y] == [0, -1]:
                    vec_list.append(np.array([0, -1]))
                elif [x, y] == [0, 1]:
                    vec_list.append(np.array([0, 1]))
                elif [x, y] == [1, -1]:
                    vec_list.append(np.array([ROOT_INV, -ROOT_INV]))
                elif [x, y] == [1, 0]:
                    vec_list.append(np.array([1, 0]))
                elif [x, y] == [1, 1]:
                    vec_list.append(np.array([ROOT_INV, ROOT_INV]))

    max_corr = np.max(corr_list)
    max_index = np.argmax(np.array(corr_list))
    max_lag = lag_list[max_index]
    max_pixel = pixel_list[max_index]
    vector = np.array(vec_list[max_index])

    if max_lag <= 0:
        return np.array([0, 0]).astype(np.float64)

    # Calculate the magnitude of vector
    target_value = all_time_series[max_pixel][frame + max_lag]
    center_value = all_time_series[center_pixel][frame]
    vector = vector * (target_value - center_value) / max_lag
    return vector.astype(np.float64)


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
    vectors = np.zeros((height, width, 2), dtype=np.float32)
    for frame in range(all_time_series.shape[1]):
    # for frame in range(1):
        for (center_pixel, time_series) in enumerate(all_time_series):
            vector = get_lag_maximizing_corr(frame, center_pixel, all_time_series, win_frames, max_lag, width, height)
            vectors[center_pixel / width][center_pixel % width] = vector

        dpi = 100
        texture = np.random.rand(width, width).astype(np.float32)

        plt.bone()

        kernellen=31
        kernel = np.sin(np.arange(kernellen)*np.pi/kernellen)
        kernel = kernel.astype(np.float32)

        image = lic_internal.line_integral_convolution(vectors, texture, kernel)

        plt.clf()
        plt.axis('off')
        plt.figimage(image)
        plt.gcf().set_size_inches((width/float(dpi), height/float(dpi)))
        plt.savefig("./result/flow-%02d.png"%frame,dpi=dpi)
