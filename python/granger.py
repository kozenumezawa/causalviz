# coding: utf-8

# input pair of data and learn
# this program focuses on
# S and T(Salinity causes Temperature) and VS(Velocity causes Salinity)

import matplotlib.pyplot as plt
import numpy
import random
import math

rawdata = numpy.load('../ocean.npy') # rawdata.shape = (10100, 2, 212)

# data = numpy.zeros((rawdata.shape[0] * 2, rawdata.shape[2] * 2), dtype=numpy.float32)
# s = numpy.zeros((rawdata.shape[0], rawdata.shape[2]), dtype=numpy.float32)
# t = numpy.zeros((rawdata.shape[0], rawdata.shape[2]), dtype=numpy.float32)
#
#     for i in range(rawdata.shape[0]):
#         st[i, :rawdata.shape[2]] = rawdata[i, 0]          #   S(salinity)
#         st[i, rawdata.shape[2]:] = rawdata[i, 1]          #   T(water temperature)
#
#     PIXELS = data.shape[1]  # = 424
#
#
#             times = [i for i in range(PIXELS)]
#             output = y_3.eval(session=sess3, feed_dict={ x3: inputdata, keep_prob3: 1.0 })
#             plt.plot(times, inputdata[0], color='r', lw=2)
#             plt.plot(times, output[0], color='g', lw=1)
#         plt.show()
