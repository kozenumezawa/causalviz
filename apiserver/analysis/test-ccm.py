# To test Convergent Cross Mapping to original data

if __name__ == "__main__":
    from mpl_toolkits.mplot3d import Axes3D
    import numpy as np
    import matplotlib.pyplot as plt
    from CausalCalculator import CausalCalculator
    import skccm.data as data
    import skccm as ccm
    from skccm.utilities import train_test_split

    mean_step = 3

    input_file_name = "trp3data_mean.npy"
    output_file_name = "trp3_corr.json"
    width = 128

    # input_file_name = "wilddata_mean.npy"
    # output_file_name = "wild_corr.json"
    # width = 285
    # mean_step = 5

    # input_file_name = "gaussian_wave_sub.npy"
    # output_file_name = "gaussian_corr.json"
    # width = 128


    all_time_series = np.load("./data/" + input_file_name)
    all_time_series = np.array(all_time_series, dtype=np.float)

    # x = all_time_series[7000]
    # y = all_time_series[6990]

    # x = all_time_series[3500]
    # y = all_time_series[3510]

    x = all_time_series[3500]
    y = all_time_series[7000]
    print x.shape

    x = x.tolist()
    y = y.tolist()
    for i in range(0):
        x.extend(x)
        y.extend(y)
    x = np.array(x)
    y = np.array(y)

    # visualize original data
    fig = plt.figure()
    ax = fig.add_subplot(1,1,1)
    ax.plot(x)
    ax.plot(y)
    plt.legend(labels=['X', 'Y'])
    plt.show()

    x1 = x
    x2 = y

    lag = 10
    embed = 2
    e1 = ccm.Embed(x1)
    e2 = ccm.Embed(x2)
    X1 = e1.embed_vectors_1d(lag,embed)
    X2 = e2.embed_vectors_1d(lag,embed)

    # scatter plot of embedding dimension
    fig = plt.figure()
    ax1 = fig.add_subplot(2,1,1)
    ax2 = fig.add_subplot(2,1,2, sharex=ax1, sharey=ax1)

    X1_t = X1.T
    ax1.scatter(X1_t[0], X1_t[1], label="X")

    X2_t = X2.T
    ax2.scatter(X2_t[0], X2_t[1], label="Y", color="orange")

    ax1.set_xlabel("X(t)")
    ax1.set_ylabel("X(t-1)")
    ax2.set_xlabel("Y(t)")
    ax2.set_ylabel("Y(t-1)")

    plt.tight_layout()
    plt.show()


    #split the embedded time series
    x1tr, x1te, x2tr, x2te = train_test_split(X1,X2, percent=.90)
    CCM = ccm.CCM() #initiate the class

    #library lengths to test
    len_tr = len(x1tr)
    lib_lens = np.arange(10, len_tr, len_tr/20, dtype='int')

    #test causation
    CCM.fit(x1tr,x2tr)
    x1p, x2p = CCM.predict(x1te, x2te,lib_lengths=lib_lens)

    sc1,sc2 = CCM.score()

    fig = plt.figure()
    ax = fig.add_subplot(1,1,1)
    ax.plot(sc1)
    ax.plot(sc2)
    plt.legend(labels=['sc1', 'sc2'])
    plt.show()