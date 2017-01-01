# coding: utf-8
import numpy as np
import csv
import json

import k_means
import hierarchical_clustering


all_time_series = []
for i in range(15):
    file_name = './timeseries_data/timeseries_' + str(i) + '.csv'
    f = open(file_name, 'r')
    dataReader = csv.reader(f)
    for row in dataReader:
        all_time_series.append(row[0:80])

# print(all_time_series.shape)  #-> (37050, 80)

for i in range(20):
    n_clusters = i + 1
    result_json = k_means.clustering(all_time_series, n_clusters)
    file_name = "../front/dist/cluster/k_means_" + str(n_clusters) + ".json"
    output_file = open(file_name, "w")
    json.dump(result_json, output_file)
