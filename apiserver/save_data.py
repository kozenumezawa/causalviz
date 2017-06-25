def save_data(all_time_series, file_name):
    import numpy as np
    import json

    all_time_series = np.array(all_time_series)

    np.save("./apiserver/analysis/data/" + file_name, all_time_series)
    responseMsg = {
        "msg": "ok"
    }
    return responseMsg