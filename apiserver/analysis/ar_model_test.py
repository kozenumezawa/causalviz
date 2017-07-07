# -*- coding: utf-8 -*-

# To test AR model fitting of Calcium wave data

def create_ar_modex(data):
    model = ar_model.AR(data)
    aic_list = []
    for i in range(20):
        results = model.fit(maxlag = i + 1)
        aic_list.append(results.aic)
    min_aic_lag = aic_list.index(min(aic_list)) + 1

    data_fit = model.fit(min_aic_lag)
    # print data_fit.params

    fit = [80] * min_aic_lag
    for t in range(min_aic_lag, len(data)):
        value = data_fit.params[0]
        for i in range(2, min_aic_lag + 2):
            value += data_fit.params[i - 1] * data[t - i + 1]
        fit.append(value)
    return [fit, data_fit.resid]

#
def normalization(x):
    """ normalized x into mean 0 and variance 1, max(x) <= 1"""
    max_x = np.max(x)
    x = x / max_x
    x = x - np.mean(x)  # mean of x becomes 0
    x = x / np.std(x)   # variance of x becomes 1
    return x

def getDiffTimeSeries(x, diff):
    x_diff = []
    for i in range(len(x) - diff):
        x_diff.append(x[i + diff] - x[i])
    return np.array(x_diff)

if __name__ == "__main__":
    import numpy as np
    import matplotlib.pyplot as plt
    from scikits.statsmodels.tsa import stattools
    from scikits.statsmodels.tsa import ar_model
    from scikits.statsmodels.tsa.stattools import grangercausalitytests as granger
    from scikits.statsmodels.tsa.stattools import adfuller as adfuller
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

    x = all_time_series[3000]
    y = all_time_series[7000]

    x = normalization(x)
    y = normalization(y)

    # create difference time series to create stationary time series
    x_diff_1 = getDiffTimeSeries(x, 1)
    y_diff_1 = getDiffTimeSeries(y, 1)

    # visualize original data
    fig = plt.figure()
    ax = fig.add_subplot(1,1,1)
    ax.plot(x)
    ax.plot(y)
    plt.legend(labels=['X', 'Y'])
    plt.show()

    # visualize original data
    fig = plt.figure()
    ax = fig.add_subplot(1,1,1)
    ax.plot(x_diff_1)
    ax.plot(y_diff_1)
    plt.legend(labels=['X_diff_1', 'Y_diff_1'])
    plt.show()
    # print adfuller(x_diff_1, regression="c")   The Augmented Dickey-Fuller test

    # x_fit, res = create_ar_modex(x)

    # fig = plt.figure()
    # ax = fig.add_subplot(1,1,1)
    # ax.plot(x)
    # ax.plot(x_fit)
    # plt.legend(labels=['X', 'AR model'])
    # plt.show()
    # plt.bar(range(len(res)), res)
    # plt.show()
    # acf = stattools.acf(res, nlags=100)
    # plt.bar(range(len(acf)), acf)

    # y_fit, res = create_ar_modex(y)
    # fig = plt.figure()
    # ax = fig.add_subplot(1,1,1)
    # ax.plot(y)
    # ax.plot(y_fit)
    # plt.legend(labels=['Y', 'AR model'])
    # plt.show()
    # plt.bar(range(len(res)), res)
    # plt.show()

    input_list = []
    for a, b in zip(x_diff_1, y_diff_1):
        input_list.append([a, b])
    results = granger(np.array(input_list), maxlag=2)

    input_list = []
    for a, b in zip(x_diff_1, y_diff_1):
        input_list.append([b, a])
    results = granger(np.array(input_list), maxlag=2)

