# -*- coding: utf-8 -*-
def draw_heatmap(data, row_labels, column_labels):
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots()
    heatmap = ax.pcolor(data, cmap=plt.cm.Blues)

    ax.set_xticks(np.arange(data.shape[0]) + 0.5, minor=False)
    ax.set_yticks(np.arange(data.shape[1]) + 0.5, minor=False)

    ax.invert_yaxis()
    ax.xaxis.tick_top()

    ax.set_xticklabels(row_labels, minor=False)
    ax.set_yticklabels(column_labels, minor=False)
    plt.show()
    return heatmap


if __name__ == "__main__":
    import numpy as np
    import json
    import matplotlib.pyplot as plt
    import csv
    from sklearn.cluster import spectral_clustering

    data_step = 4

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
    data_pixel_list = []
    for (i, pixel_corr) in enumerate(corr_list):
        if len(pixel_corr) == 0:
            continue

        graph_row = []
        for (pixel, corr) in enumerate(pixel_corr):
            if len(corr_list[pixel]) == 0:
                continue

            if corr == -2 or corr < 0.8:
                graph_row.append(0)
            elif i == pixel:
                graph_row.append(0)  # i == j のとき0
            else:
                graph_row.append(corr)
        graph.append(graph_row)
        data_pixel_list.append(i)
    graph = np.array(graph)

    n_clusters = 5
    labels = spectral_clustering(graph, n_clusters=n_clusters)

    f = open('./data/graph.csv', 'w')
    writer = csv.writer(f)
    for row in graph:
        writer.writerows([row])
    f.close()

    f = open('./data/data_pixel.csv', 'w')
    writer = csv.writer(f)
    writer.writerows([data_pixel_list])
    f.close()

    f = open('./data/labels.csv', 'w')
    writer = csv.writer(f)
    writer.writerows([["labels"]])
    for label in labels:
        writer.writerows([[label]])
    f.close()

    # labesに沿って、グラフをソート
    # 行をsort
    graph_sorted = []
    original_idx = []
    for i in range(n_clusters):
        for (row_idx, cluster_idx) in enumerate(labels):
            if i == cluster_idx:
                graph_sorted.append(graph[row_idx])
                original_idx.append(row_idx)

    # 列をsort
    graph_sorted = np.array(graph_sorted)
    graph_sorted_T = graph_sorted.transpose()
    graph_sorted = []
    for i in range(n_clusters):
        for (row_idx, cluster_idx) in enumerate(labels):
            if i == cluster_idx:
                graph_sorted.append(graph_sorted_T[row_idx])
    graph_sorted = np.array(graph_sorted)
    graph_sorted = graph_sorted.transpose()

    # sort後のgraphを書き込み
    f = open('./data/graph_sorted.csv', 'w')
    writer = csv.writer(f)
    for row in graph_sorted:
        writer.writerows([row])
    f.close()

    # d3.jsのために書き込み
    f = open('./data/graph_sorted_d3.csv', 'w')
    writer = csv.writer(f)
    writer.writerows([["original_idx", "in", "out", "value"]])
    for (i, row) in enumerate(graph_sorted):
        for (j, value) in enumerate(row):
            writer.writerows([[original_idx[i], i, j, value]])
    f.close()

    draw_heatmap(graph_sorted, range(len(graph_sorted)), range(len(graph_sorted)))