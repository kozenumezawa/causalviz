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

    # visualize original data
    fig = plt.figure()
    ax = fig.add_subplot(1,1,1)
    ax.plot(x)
    ax.plot(y)
    plt.legend(labels=['X', 'Y'])
    plt.show()


    rx1 = 3.72 #determines chaotic behavior of the x1 series
    rx2 = 3.72 #determines chaotic behavior of the x2 series
    b12 = 0.2 #Influence of x1 on x2
    b21 = 0.01 #Influence of x2 on x1
    ts_length = 1000
    x1,x2 = data.coupled_logistic(rx1,rx2,b12,b21,ts_length)

    x1 = x
    x2 = y

    lag = 1
    embed = 5
    e1 = ccm.Embed(x1)
    e2 = ccm.Embed(x2)
    X1 = e1.embed_vectors_1d(lag,embed)
    X2 = e2.embed_vectors_1d(lag,embed)

    # scatter
    fig = plt.figure()
    ax1 = fig.add_subplot(2,1,1)
    ax2 = fig.add_subplot(2,1,2, sharey=ax1)

    X1_t = X1.T
    ax1.scatter(X1_t[0], X1_t[1], label="X")

    X2_t = X2.T
    ax2.scatter(X2_t[0], X2_t[1], label="Y", color="orange")

    ax1.set_xlabel("X(t)")
    ax1.set_ylabel("X(t-1)")
    ax2.set_xlabel("Y(t)")
    ax2.set_ylabel("Y(t-1)")

    # plt.legend(labels=['X1(t)', 'X1(t-1)'])
    plt.show()



    #split the embedded time series
    x1tr, x1te, x2tr, x2te = train_test_split(X1,X2, percent=.75)

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