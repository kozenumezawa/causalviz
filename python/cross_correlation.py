def clustering(all_time_series):
    # calculate cross correlation
    ## cut first 15 time steps because they are meaningless
    cut_time_series = []
    for time_series in all_time_series:
        cut_time_series.append(time_series[15:80])
    print(len(cut_time_series))    
    print(len(cut_time_series[0]))
