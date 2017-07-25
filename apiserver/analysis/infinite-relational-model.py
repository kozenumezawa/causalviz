def getFileName(file_type, algorithm):
    input_file_name = ""
    output_file_name = ""

    if file_type == "wild":
        input_file_name = "wild_" + algorithm + ".json"
        output_file_name = "wild"
    elif file_type == "trp3":
        input_file_name = "trp3_" + algorithm + ".json"
        output_file_name = "trp3"
    elif file_type == "gaussian":
        input_file_name = "gaussian_" + algorithm + ".json"
        output_file_name = "gaussian"
    return (input_file_name, output_file_name)

if __name__ == "__main__":
    import numpy as np
    import json
    # import matplotlib.pyplot as plt
    import csv
    import seaborn as sns
    import matplotlib.pylab as plt
    import sys

    import matplotlib.patches as patches
    import time
    import itertools as it
    from multiprocessing import cpu_count
    from microscopes.common.rng import rng
    from microscopes.common.relation.dataview import numpy_dataview
    from microscopes.models import bb as beta_bernoulli
    from microscopes.irm.definition import model_definition
    from microscopes.irm import model, runner, query
    from microscopes.kernels import parallel
    from microscopes.common.query import groups, zmatrix_heuristic_block_ordering, zmatrix_reorder

    if len(sys.argv) <= 3:
        print "input data type, algorithm, threshold"
        print "data type Ex: 'wild', 'trp3', 'gaussian'"
        print "algorithm Ex: 'granger', 'corr'"
        print "threshold Ex: 0.5, 2"
        sys.exit()
    file_type = sys.argv[1]
    algorithm = sys.argv[2]
    threshold = float(sys.argv[3])

    input_file_name, output_file_name = getFileName(file_type=file_type, algorithm=algorithm)

    f = open("./data/" + input_file_name, "r")
    json_data = json.load(f)

    granger_list = json_data["data"]

    graph = []
    data_pixel_list = []

    # calculate graph
    for (i, pixel_granger) in enumerate(granger_list):
        if len(pixel_granger) == 0:
            continue
        graph_row = []
        for (pixel, granger) in enumerate(pixel_granger):
            if len(granger_list[pixel]) == 0:
                continue

            if granger < threshold:
                graph_row.append(False)
            elif i == pixel:
                graph_row.append(False)  # if i == j
            else:
                graph_row.append(True)
                # graph_row.append(granger)
        graph.append(graph_row)

    graph = np.array(graph, dtype=np.bool)

    not_isolated_list = []
    for (i, row) in enumerate(graph):
        if np.sum(row) < 30:   # remove isolated node
            continue

        if True in row:
            not_isolated_list.append(i)
            continue

    graph = graph[not_isolated_list]
    graph = graph[:,not_isolated_list]

    N = len(graph)
    print "graph size = ", N

    labels = [i if i % 200 == 0 else '' for i in xrange(N)]
    # sns.heatmap(graph, linewidths=0, cbar=False, xticklabels=labels, yticklabels=labels)
    # plt.xlabel('index')
    # plt.ylabel('index')
    # plt.title('Granger Martix')
    # plt.show()

    # conduct Infinite Relational Model
    defn = model_definition([N], [((0, 0), beta_bernoulli)])
    views = [numpy_dataview(graph)]
    prng = rng()

    nchains = cpu_count()
    latents = [model.initialize(defn, views, r=prng, cluster_hps=[{'alpha':1e-3}]) for _ in xrange(nchains)]
    kc = runner.default_assign_kernel_config(defn)
    runners = [runner.runner(defn, views, latent, kc) for latent in latents]
    r = parallel.runner(runners)

    start = time.time()
    # r.run(r=prng, niters=1000)
    r.run(r=prng, niters=100)
    print "inference took {} seconds".format(time.time() - start)

    infers = r.get_latents()
    clusters = groups(infers[0].assignments(0), sort=True)
    ordering = list(it.chain.from_iterable(clusters))

    z = graph.copy()
    z = z[ordering]
    z = z[:,ordering]
    sizes = map(len, clusters)
    boundaries = np.cumsum(sizes)[:-1]

    # plt.imshow(z, cmap=plt.cm.binary, interpolation='nearest')
    # plt.show()

    # write graph
    f = open('./data/' + output_file_name + '_graph_sorted.json', "w")
    saveJSON = {
        "data": z.tolist(),
        "n_cluster_list": [len(cluster) for cluster in clusters],
        "ordering": ordering,
        "not_isolated_list": not_isolated_list,
        "threshold": threshold
    }
    json.dump(saveJSON, f)
    f.close()