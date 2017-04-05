# coding: utf-8
import numpy as np
import csv
import json

import k_means
import maximum_clustering
import hierarchical_clustering
import cross_correlation

all_time_series = []
for i in range(15):
    file_name = './timeseries_data/timeseries_' + str(i) + '.csv'
    f = open(file_name, 'r')
    dataReader = csv.reader(f)
    for row in dataReader:
        all_time_series.append(row[0:80])
# print(all_time_series.shape)  #-> (37050, 80)


print("Choose an algorithm")
print("1: K-means")
print("2: Maximum value")
print("3: Cross correlation")

x = raw_input()
x = int(x)

if x == 1:
    for i in range(20):
        n_clusters = i + 1
        result_json = k_means.clustering(all_time_series, n_clusters)
        file_name = "../front/dist/cluster/k_means_" + str(n_clusters) + ".json"
        output_file = open(file_name, "w")
        json.dump(result_json, output_file)

if x==2:
    result_json = maximum_clustering.clustering(all_time_series)
    file_name = "../front/dist/cluster/maximum.json"
    output_file = open(file_name, "w")
    json.dump(result_json, output_file)

if x==3:
    cross_correlation.clustering(all_time_series)
