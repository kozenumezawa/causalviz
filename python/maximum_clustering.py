def clustering(all_time_series):
    # conduct clustering by using maximum values
    ## calculate max values in each timeseries
    max_value_list = []
    for timeseries in all_time_series:
        mex_value_list.append(max(timeseries))

    ## clustering by using a max value list


    # calculate each average
    average_time_series = []
    clustering_frequency = []   # count number of elements in each cluster
    ## initialize
    for i in range(n_clusters):
        clustering_frequency.append(0)
        average_time_series.append([])
        for j in range(all_time_series[0].size):
            average_time_series[i].append(0)
    ## calculate clustering frequency and total value of each cluster
    for (i, time_series) in enumerate(all_time_series):
        cluster_number = kmeans_labels[i]
        clustering_frequency[cluster_number] += 1
        for (j, scalar) in enumerate(time_series):
            average_time_series[cluster_number][j] += float(scalar.tolist())

    ## calculatea average
    np_average_time_series = np.array(average_time_series)
    for i in range(len(clustering_frequency)):
        np_average_time_series[i] /= clustering_frequency[i]

    # create a response message
    responseMsg = {
        "labels": kmeans_labels.tolist(),
        "average": np_average_time_series.tolist()
    }

    return responseMsg
