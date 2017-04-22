# coding: utf-8
import numpy as np
import csv

all_time_series = []
for i in range(15):
    file_name = './timeseries_data/timeseries_' + str(i) + '.csv'
    f = open(file_name, 'r')
    dataReader = csv.reader(f)
    for row in dataReader:
        all_time_series.append(row[0:80])

all_time_series = np.array(all_time_series)
# print(all_time_series.shape)  #-> (37050, 80)
