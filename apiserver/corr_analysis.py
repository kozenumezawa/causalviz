def get_lag_maximizing_corr(frame, center_pixel, all_time_series, win_pixels, win_frames, max_lag, width, height):
    import numpy as np
    import math

    if np.sum(all_time_series[center_pixel]) == 0:
        return False
    n_frames = all_time_series.shape[1]
    n_pixels = width * height

    win_pixels = int(win_pixels)
    win_frames = int(2 * math.floor(win_frames / 2))
    start_frame = max(0, frame - win_frames / 2)
    stop_frame = min(n_frames - 1, frame + win_frames / 2)
    if start_frame == 0:
        stop_frame = win_frames
    elif stop_frame == width * height - 1:
        start_frame = n_frames - win_frames

    max_corr = -1
    causal_pixel = -1
    causal_lag = 0

    for x in [win_pixels, 0, win_pixels]:
        for y in [win_pixels, 0, win_pixels]:
            if x == 0 and y == 0:
                continue
            pixel = center_pixel + x + y * width
            if pixel < 0 or pixel >= n_pixels:
                continue
            y_time_series = all_time_series[pixel][start_frame:stop_frame]
            if np.sum(y_time_series) == 0:
                return False

            lag_range = int(math.floor(max_lag / 2))
            for lag in xrange(-lag_range, lag_range):
            # for lag in range(0, lag_range):
                if start_frame + lag < 0 or stop_frame + lag >= n_frames:
                    continue
                center_time_series = all_time_series[center_pixel][start_frame + lag : stop_frame + lag]

                corr = np.corrcoef(center_time_series, y_time_series)[0][1]
                # Nan check
                if math.isnan(corr):
                    continue

                minimum_corr = 0.7
                if corr < minimum_corr or corr < max_corr:
                    continue
                max_corr = corr
                causal_pixel = pixel
                causal_lag = lag

    if causal_pixel == -1:
        return False

    vector = {
        "center_pixel": center_pixel,
        "causal_pixel": causal_pixel,
        "causal_lag": causal_lag,
        "corr": max_corr
    }
    return vector

def cross_corr_analysis(all_time_series, max_lag, win_pixels, win_frames, width, height):
    import numpy as np
    import json

    all_time_series = np.array(all_time_series)
    all_time_series = all_time_series.astype(np.float64)
    # print(all_time_series.shape)  #-> (number of pixels, length of time)

    data = []

    # for frame in xrange(0, all_time_series.shape[1], win_frames):
    for frame in xrange(0, all_time_series.shape[1]):
        print frame
        vectors = []
        for (center_pixel, time_series) in enumerate(all_time_series):
            vector = get_lag_maximizing_corr(frame, center_pixel, all_time_series, win_pixels, win_frames, max_lag, width, height)
            if vector == False:
                continue
            vectors.append(vector)

        if len(vectors) == 0:
            continue
        one_frame = {
            "n_frame": frame,
            "vectors": vectors
        }
        data.append(one_frame)
    responseMsg = {
        "data": data
    }
    f = open("apiserver/dummy.json", "w")
    json.dump(responseMsg, f)
    f.close()

    return responseMsg
