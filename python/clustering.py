# coding: utf-8
import numpy as np
import csv

import k_means
import hierarchical_clustering

all_time_series = []
for i in range(15):
    file_name = './timeseries_data/timeseries_' + str(i) + '.csv'
    f = open(file_name, 'r')
    dataReader = csv.reader(f)
    for row in dataReader:
        all_time_series.append(row[0:80])

# print(test.shape)  #-> (37050, 80)

n_clusters = 6
test = k_means.clustering(all_time_series, n_clusters)

hierarchical_clustering.clustering(all_time_series)

print(test)
