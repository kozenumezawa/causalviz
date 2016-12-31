def clustering(all_time_series, n_clusters):
    import numpy as np
    from sklearn.cluster import KMeans

    all_time_series = np.array(all_time_series)

    # conduct k-means
    kmeans_model = KMeans(n_clusters=n_clusters, random_state=10).fit(all_time_series)
    kmeans_labels = kmeans_model.labels_

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
            average_time_series[cluster_number][j] += scalar

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
