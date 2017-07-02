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

    fit = []
    for t in range(min_aic_lag, len(data)):
        value = data_fit.params[0]
        for i in range(2, min_aic_lag + 2):
            value += data_fit.params[i - 1] * data[t - i + 1]
        fit.append(value)
    return fit

if __name__ == "__main__":
    import numpy as np
    import matplotlib.pyplot as plt

    from scikits.statsmodels.tsa import ar_model

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
    all_time_series = np.array(all_time_series)

    x = all_time_series[3000]
    y = all_time_series[8000]

    x_fit = create_ar_modex(x)

    fig = plt.figure()
    ax = fig.add_subplot(1,1,1)
    ax.plot(x)
    ax.plot(x_fit)
    plt.legend(labels=['X', 'AR model'])
    plt.show()


    y_fit = create_ar_modex(y)
    fig = plt.figure()
    ax = fig.add_subplot(1,1,1)
    ax.plot(y)
    ax.plot(y_fit)
    plt.legend(labels=['Y', 'AR model'])
    plt.show()

