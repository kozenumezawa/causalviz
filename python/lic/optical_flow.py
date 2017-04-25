# coding: utf-8
import numpy as np
import csv
import math
import pylab as plt

import lic_internal

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

    vectors = np.load('./npy/flow_vectors_0.npy')
    vectors = vectors.astype(np.float32)
    # for frame in range(all_time_series.shape[1]):

    for frame in range(1):
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
