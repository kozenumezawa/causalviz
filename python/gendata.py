from __future__ import print_function

import httplib2

import numpy

from pydap.client import open_url
import pydap.lib
from pydap.util import socks

files = [
    'm4dv20101231.nc',
    'm4dv20101230.nc',
    'm4dv20101229.nc',
    'm4dv20101228.nc',
    'm4dv20101227.nc',
    'm4dv20101226.nc',
    'm4dv20101225.nc',
    'm4dv20101224.nc',
    'm4dv20101223.nc',
    'm4dv20101222.nc',
    'm4dv20101221.nc',
    'm4dv20101220.nc',
    'm4dv20101219.nc',
    'm4dv20101218.nc',
    'm4dv20101217.nc',
    'm4dv20101216.nc',
    'm4dv20101215.nc',
    'm4dv20101214.nc',
    'm4dv20101213.nc',
    'm4dv20101212.nc',
    'm4dv20101211.nc',
    'm4dv20101210.nc',
    'm4dv20101209.nc',
    'm4dv20101208.nc',
    'm4dv20101207.nc',
    'm4dv20101206.nc',
    'm4dv20101205.nc',
    'm4dv20101204.nc',
    'm4dv20101203.nc',
    'm4dv20101202.nc',
    'm4dv20101201.nc',
    'm4dv20101130.nc',
    'm4dv20101129.nc',
    'm4dv20101128.nc',
    'm4dv20101127.nc',
    'm4dv20101126.nc',
    'm4dv20101125.nc',
    'm4dv20101124.nc',
    'm4dv20101123.nc',
    'm4dv20101122.nc',
    'm4dv20101121.nc',
    'm4dv20101120.nc',
    'm4dv20101119.nc',
    'm4dv20101118.nc',
    'm4dv20101117.nc',
    'm4dv20101116.nc',
    'm4dv20101115.nc',
    'm4dv20101114.nc',
    'm4dv20101113.nc',
    'm4dv20101112.nc',
    'm4dv20101111.nc',
    'm4dv20101110.nc',
    'm4dv20101109.nc',
    'm4dv20101108.nc',
    'm4dv20101107.nc',
    'm4dv20101106.nc',
    'm4dv20101105.nc',
    'm4dv20101104.nc',
    'm4dv20101103.nc',
    'm4dv20101102.nc',
    'm4dv20101101.nc',
    'm4dv20101031.nc',
    'm4dv20101030.nc',
    'm4dv20101029.nc',
    'm4dv20101028.nc',
    'm4dv20101027.nc',
    'm4dv20101026.nc',
    'm4dv20101025.nc',
    'm4dv20101024.nc',
    'm4dv20101023.nc',
    'm4dv20101022.nc',
    'm4dv20101021.nc',
    'm4dv20101020.nc',
    'm4dv20101019.nc',
    'm4dv20101018.nc',
    'm4dv20101017.nc',
    'm4dv20101016.nc',
    'm4dv20101015.nc',
    'm4dv20101014.nc',
    'm4dv20101013.nc',
    'm4dv20101012.nc',
    'm4dv20101011.nc',
    'm4dv20101010.nc',
    'm4dv20101009.nc',
    'm4dv20101008.nc',
    'm4dv20101007.nc',
    'm4dv20101006.nc',
    'm4dv20101005.nc',
    'm4dv20101004.nc',
    'm4dv20101003.nc',
    'm4dv20101002.nc',
    'm4dv20101001.nc',
    'm4dv20100930.nc',
    'm4dv20100929.nc',
    'm4dv20100928.nc',
    'm4dv20100927.nc',
    'm4dv20100926.nc',
    'm4dv20100925.nc',
    'm4dv20100924.nc',
    'm4dv20100923.nc',
    'm4dv20100922.nc',
    'm4dv20100921.nc',
    'm4dv20100920.nc',
    'm4dv20100919.nc',
    'm4dv20100918.nc',
    'm4dv20100917.nc',
    'm4dv20100916.nc',
    'm4dv20100915.nc',
    'm4dv20100914.nc',
    'm4dv20100913.nc',
    'm4dv20100912.nc',
    'm4dv20100911.nc',
    'm4dv20100910.nc',
    'm4dv20100909.nc',
    'm4dv20100908.nc',
    'm4dv20100907.nc',
    'm4dv20100906.nc',
    'm4dv20100905.nc',
    'm4dv20100904.nc',
    'm4dv20100903.nc',
    'm4dv20100902.nc',
    'm4dv20100901.nc',
]

files.sort()

pydap.lib.CACHE = '/tmp/pydap-cache/'
# pydap.lib.PROXY = httplib2.ProxyInfo(socks.PROXY_TYPE_HTTP,
#                                      'proxy.kuins.net', 8080)
url = 'http://vizlab:sicat@133.3.250.177/thredds/dodsC/fora/' + files[0]
dataset = open_url(url)
h = dataset.so.shape[0]  # Z = 54

shape = dataset.so.array[0, 152:253, 332:432].shape # (1, 101, 100)
n = shape[1] * shape[2] # 101 * 100
m = 122    #  timestep
result = numpy.zeros((h, n, 3, m)) # h = height, n = area, m = timestep

for height in range(h):
    S = numpy.zeros((len(files), 1, 101, 100))
    T = numpy.zeros((len(files), 1, 101, 100))
    U = numpy.zeros((len(files), 1, 101, 100))
    V = numpy.zeros((len(files), 1, 101, 100))
    for i, name in enumerate(files):
        url = 'http://vizlab:sicat@133.3.250.177/thredds/dodsC/fora/' + name
        dataset = open_url(url)
        S[i, :, :, :] = dataset.so.array[0, 152:253, 332:432]
        T[i, :, :, :] = dataset.to.array[0, 152:253, 332:432]
        U[i, :, :, :] = dataset.uo.array[0, 152:253, 332:432]
        V[i, :, :, :] = dataset.vo.array[0, 152:253, 332:432]
    X = numpy.sqrt(U ** 2 + V ** 2)

    shape = S.shape
    for i in range(shape[2]):
        for j in range(shape[3]):
            index = i * shape[3] + j
            result[height, index, 0, :] = S[:, 0, i, j]
            result[height, index, 1, :] = T[:, 0, i, j]
            result[height, index, 2, :] = X[:, 0, i, j]
numpy.save('./ocean.npy', result)

# minS = numpy.min(S)
# maxS = numpy.max(S)
# minT = numpy.min(T)
# maxT = numpy.max(T)
# minX = numpy.min(X)
# maxX = numpy.max(X)
# S = (S - minS) / (maxS - minS)
# T = (T - minT) / (maxT - minT)
# X = (X - minX) / (maxX - minX)
#
# for i in range(shape[2]):
#     for j in range(shape[3]):
#         index = i * shape[3] + j
#         result[index, 0, :] = S[:, 0, i, j]
#         result[index, 1, :] = T[:, 0, i, j]
#         result[index, 2, :] = X[:, 0, i, j]
# numpy.save('ocean.normalized.npy', result)
