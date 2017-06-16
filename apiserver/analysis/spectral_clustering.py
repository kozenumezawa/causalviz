# -*- coding: utf-8 -*-
def draw_heatmap(data, row_labels, column_labels):
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots()
    heatmap = ax.pcolor(data, cmap=plt.cm.Blues)

    ax.set_xticks(np.arange(data.shape[0]) + 0.5, minor=False)
    ax.set_yticks(np.arange(data.shape[1]) + 0.5, minor=False)

    ax.invert_yaxis()
    ax.xaxis.tick_top()

    # ax.set_xticklabels(row_labels, minor=False)
    # ax.set_yticklabels(column_labels, minor=False)
    plt.show()
    return heatmap


if __name__ == "__main__":
    import numpy as np
    import json
    import math
    import matplotlib.pyplot as plt
    import csv
    from sklearn.cluster import spectral_clustering

    data_step = 5

    f = open("./trp3_corr.json", "r")
    json_data = json.load(f)

    # corr_listは二次元配列であり、corr_list[全pixel][各ピクセルとのcorrelation]を表す。
    # ただし、各ピクセルは、data_step間隔でサンプリングされており、データがない点では
    # corr_list[pixel] == []
    # である。また、correlationが計算不能な点では、
    # corr_list[pixel][対象pixel] = -2
    # が格納されている。

    corr_list = json_data["data"]

    graph = []
    for pixel_corr in corr_list:
        if len(pixel_corr) == 0:
            continue

        graph_row = []
        for (pixel, corr) in enumerate(pixel_corr):
            if len(corr_list[pixel]) == 0:
                continue

            if corr == -2 or corr < 0.7:
                graph_row.append(0)
            else:
                graph_row.append(corr)
        graph.append(graph_row)

    graph = np.array(graph)

    labels = spectral_clustering(graph, n_clusters=4)

    f = open('./data/graph.csv', 'w')
    writer = csv.writer(f)
    for row in graph:
        writer.writerows([row])
    f.close()

    f = open('./data/labels.csv', 'w')
    writer = csv.writer(f)
    writer.writerows([labels])
    f.close()







# all_time_series = np.load('./data/trp3data.npy')
# corr_list = []
#
# for (i, x) in enumerate(all_time_series):
#     x = x.astype(np.float32)
#     if (0 in x or i % 5 != 0):
#         corr_list.append([])
#         continue
#     corr_list.append([-2 for z in range(len(all_time_series))])
#
#     for (j, y) in enumerate(all_time_series):
#         y = y.astype(np.float32)
#         if (0 in y or j % 5 != 0):
#             corr_list[i][j] = -2
#         else:
#             corr = np.corrcoef(x, y)[0][1]
#             if math.isnan(corr):
#                 corr_list[i][j] = -2
#             else:
#                 corr_list[i][j] = np.round(corr, 2)
#
# saveJSON = {
#     "data": corr_list
# }
#
# json.dump(saveJSON, f)
# f.close()
