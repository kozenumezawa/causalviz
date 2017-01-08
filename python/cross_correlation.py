def clustering(all_time_series):
    # calculate cross correlation
    ## cut first 15 time steps because they are meaningless

    # convert from string to int
    cut_time_series = []
    for (i, time_series) in enumerate(all_time_series):
        cut_time_series.append(time_series[15:80])
        for (j, scalar) in enumerate(cut_time_series[i]):
            cut_time_series[i][j] = int(scalar)

    width = 285
    height = 130

    for (i, time_series) in enumerate(cut_time_series):
        if time_series[0] > 150:
            print(i)
