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
    # import matplotlib.pyplot as plt
    import csv

    # input_file_name = "trp3_granger.json"
    # output_file_name = "trp3"

    # input_file_name = "wild_granger.json"
    # output_file_name = "wild"

    input_file_name = "gaussian_granger.json"
    output_file_name = "gaussian"

    n_clusters = 5

    data_step = 4

    f = open("./data/" + input_file_name, "r")
    json_data = json.load(f)

    granger_list = json_data["data"]

    graph = []
    data_pixel_list = []
    for (i, pixel_granger) in enumerate(granger_list):
        if len(pixel_granger) == 0:
            continue

        graph_row = []
        for (pixel, granger) in enumerate(pixel_granger):
            if len(granger_list[pixel]) == 0:
                continue

            if granger < 3:
                graph_row.append(0)
            elif i == pixel:
                graph_row.append(0)  # if i == j
            else:
                graph_row.append(granger)
        graph.append(graph_row)
        data_pixel_list.append(i)

    graph = np.array(graph)
    # draw_heatmap(graph, range(len(graph)), range(len(graph)))

    # write graph
    f = open('./data/' + output_file_name + '_graph_sorted.json', "w")
    saveJSON = {
        "data": graph.tolist(),
        "n_cluster_list": [len(graph)]
    }
    json.dump(saveJSON, f)
    f.close()