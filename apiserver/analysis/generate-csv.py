# coding: utf-8

import numpy

import csv
import numpy as np

def main():
    mean_step = 3

    input_file_name = "trp3data_mean.npy"
    output_file_name = "trp3_corr.json"
    width = 128

    # input_file_name = "wilddata_mean.npy"
    # output_file_name = "wild_corr.json"
    # width = 285
    # mean_step = 5

    # input_file_name = "gaussian_wave_sub.npy"
    # output_file_name = "gaussian_corr.json"
    # width = 128


    all_time_series = np.load("./data/" + input_file_name)
    all_time_series = np.array(all_time_series, dtype=np.float)

    # x = all_time_series[7000]
    # y = all_time_series[6990]

    # x = all_time_series[3500]
    # y = all_time_series[3510]

    x = all_time_series[3500]
    y = all_time_series[7000]

    f = open('./data/test.csv', 'w')
    writer = csv.writer(f)

    data = [['time', 'x', 'y']]
    writer.writerows(data)

    for i, scalar in enumerate(x):
        writer.writerows([[i, x[i], y[i]]])
    f.close()

if __name__ == '__main__':
    main()
