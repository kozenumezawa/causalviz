import scipy.spatial.distance

def clustering(all_time_series):
    from  scipy.spatial.distance  import pdist
    from scipy.cluster.hierarchy import linkage, dendrogram
    from matplotlib.pyplot import show

    pdist = pdist(all_time_series)
