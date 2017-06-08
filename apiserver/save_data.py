def save_data(all_time_series):
    import numpy as np
    import json

    all_time_series = np.array(all_time_series)

    np.save("./apiserver/data/trp3data.npy", all_time_series)
    responseMsg = {
        "msg": "ok"
    }
    return responseMsg
