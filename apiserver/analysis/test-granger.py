# To test Granger Causality to original data
def normalization(x):
    """ normalized x into mean 0 and variance 1, max(x) <= 1"""
    max_x = np.max(x)
    x = x / max_x
    x = x - np.mean(x)  # mean of x becomes 0
    x = x / np.std(x)   # variance of x becomes 1
    return x

if __name__ == "__main__":
    from mpl_toolkits.mplot3d import Axes3D
    import numpy as np
    import matplotlib.pyplot as plt
    from CausalCalculator import CausalCalculator

    mean_step = 3

    # input_file_name = "trp3data_mean.npy"
    # output_file_name = "trp3_corr.json"
    # width = 128

    # input_file_name = "wilddata_mean.npy"
    # output_file_name = "wild_corr.json"
    # width = 285
    # mean_step = 5

    input_file_name = "gaussian_wave_sub.npy"
    output_file_name = "gaussian_corr.json"
    width = 128


    all_time_series = np.load("./data/" + input_file_name)
    all_time_series = np.array(all_time_series, dtype=np.float)

    x = all_time_series[7000]
    y = all_time_series[6990]

    # x = all_time_series[3500]
    # y = all_time_series[3510]

    # x = normalization(x)
    # y = normalization(y)

    calc_xy = CausalCalculator(X=x[:, np.newaxis], Y_cause=y[:, np.newaxis])
    calc_yx = CausalCalculator(X=y[:, np.newaxis], Y_cause=x[:, np.newaxis])

    # visualize original data
    fig = plt.figure()
    ax = fig.add_subplot(1,1,1)
    ax.plot(x)
    ax.plot(y)
    plt.legend(labels=['X', 'Y'])
    # plt.show()

    k = [2 * i + 1 for i in range(10)]
    m = [2 * i + 1 for i in range(10)]

    # for i in range(k):

    # x = np.arange(-3, 3, 0.25)
    # y = np.arange(-3, 3, 0.25)
    K, M = np.meshgrid(k, m)

    Gyx_list = []
    Gxy_list = []
    for idx, i in enumerate(k):
        Gyx_list.append([])
        Gxy_list.append([])
        for j in m:
            Gyx_list[idx].append(calc_xy.calcGrangerCausality(k=i, m=j))
            Gxy_list[idx].append(calc_yx.calcGrangerCausality(k=i, m=j))


    fig = plt.figure()
    ax = Axes3D(fig)
    ax.plot_wireframe(K, M, Gyx_list, color="orange")
    ax.plot_wireframe(K, M, Gxy_list)
    ax.set_xlabel('k')
    ax.set_ylabel('m')
    ax.set_zlabel('G(y->x)')
    ax.legend(labels=['G(y->x)', 'G(x->y)'])
    plt.show()

    # print "Granger Causality Y -> X :", Gyx_list[0]
    # print "Granger Causality X -> Y :", Gxy_list[0]