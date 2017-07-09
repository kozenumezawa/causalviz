# To test Granger Causality to original data
def normalization(x):
    """ normalized x into mean 0 and variance 1, max(x) <= 1"""
    max_x = np.max(x)
    x = x / max_x
    x = x - np.mean(x)  # mean of x becomes 0
    x = x / np.std(x)   # variance of x becomes 1
    return x

if __name__ == "__main__":
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

    # x = normalization(x)
    # y = normalization(y)

    calc_xy = CausalCalculator(X=x[:, np.newaxis], Y_cause=y[:, np.newaxis])
    calc_yx = CausalCalculator(X=y[:, np.newaxis], Y_cause=x[:, np.newaxis])

    k, m = 1, 5
    Gy_to_x = calc_xy.calcGrangerCausality(k=k, m=m)
    Gx_to_y = calc_yx.calcGrangerCausality(k=k, m=m)

    print "Granger Causality Y -> X :", Gy_to_x
    print "Granger Causality X -> Y :", Gx_to_y

    # visualize original data
    fig = plt.figure()
    ax = fig.add_subplot(1,1,1)
    ax.plot(x)
    ax.plot(y)
    plt.legend(labels=['X', 'Y'])
    plt.show()