def cross_corr_analysis(all_time_series):
    import numpy as np

    all_time_series = np.array(all_time_series)

    print all_time_series.shape
    responseMsg = {
        "labels": "test"
    }
    return responseMsg
