# coding: utf-8
import numpy as np
import csv

for i in range(15):
    file_name = './timeseries_data/timeseries_' + str(i) + '.csv'
    f = open(file_name, 'r')
    dataReader = csv.reader(f)

    for row in dataReader:
        print(row)
