# To test Granger Causality to original data
def normalization(x):
    """ normalized x into mean 0 and variance 1, max(x) <= 1"""
    max_x = np.max(x)
    x = x / max_x
    x = x - np.mean(x)  # mean of x becomes 0
    x = x / np.std(x)   # variance of x becomes 1
    return x

def isOutside(idx, N):
    if idx < 0 or idx >= N:
        return True
    return False

def getBlock(all_time_series, block_center, block_idx, N):
    block = []
    for y_idx in block_idx:
        for x_idx in block_idx:
            if isOutside(block_center + x_idx + (width * y_idx), N):
                continue
            block.append(all_time_series[block_center + x_idx + (width * y_idx)])
    block = np.array(block)
    block = block.T
    return block

if __name__ == "__main__":
    from mpl_toolkits.mplot3d import Axes3D
    import numpy as np
    import matplotlib.pyplot as plt
    from CausalCalculator import CausalCalculator

    mean_step = 3
    k, m = 1, 20
    block_r = 1     # radius of each block
    block_idx = [i for i in range(-block_r, block_r + 1)]

    # input_file_name = "trp3data_mean.npy"
    # output_file_name = "trp3_corr.json"
    # width = 128

    # input_file_name = "wilddata_mean.npy"
    # output_file_name = "wild_corr.json"
    # width = 285
    # mean_step = 5

    input_file_name = "gaussian_wave_sub.npy"
    output_file_name = "gaussian_corr.json"
    width = 128

    all_time_series = np.load("./data/" + input_file_name)
    all_time_series = np.array(all_time_series, dtype=np.float)
    N = all_time_series.shape[0]

    x_block_center = 7000
    # x_block_center = 3500

    x_block = getBlock(all_time_series=all_time_series, block_center=x_block_center, block_idx=block_idx, N=N)

    lat = [i for i in range(width)]
    lng = [i for i in range(all_time_series.shape[0] / width)]

    LAT, LNG = np.meshgrid(lat, lng)

    Gxy_list = []
    for y_idx in lng:
        Gxy_list.append([])
        for x_idx in lat:
            y_block_center = x_idx + (width * y_idx)

            if y_block_center == x_block_center:
                Gxy_list[y_idx].append(10)
                continue
            if (isOutside(y_block_center, N) or sum(all_time_series[y_block_center]) == 0):
                Gxy_list[y_idx].append(0)
                continue

            y_block = getBlock(all_time_series=all_time_series, block_center=y_block_center, block_idx=block_idx, N=N)

            calc_yx = CausalCalculator(X=y_block, Y_cause=x_block)
            Gxy_list[y_idx].append(calc_yx.calcGrangerCausality(k=k, m=m))


    # visualize original data
    # fig = plt.figure()
    # ax = fig.add_subplot(1,1,1)
    # ax.plot(x)
    # plt.legend(labels=['X', 'Y'])
    # plt.show()

    fig = plt.figure()
    ax = Axes3D(fig)
    ax.plot_wireframe(LAT, LNG, Gxy_list)
    ax.set_xlabel('x')
    ax.set_ylabel('y')
    ax.set_zlabel('G')
    ax.legend(labels=['G(x->y)'])
    plt.show()
