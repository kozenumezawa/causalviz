# coding: utf-8
import csv
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt
import numpy as np

all_time_series = []
for i in range(15):
    file_name = './timeseries_data/timeseries_' + str(i) + '.csv'
    f = open(file_name, 'r')
    dataReader = csv.reader(f)
    for row in dataReader:
        all_time_series.append(row[0:80])
all_time_series = np.array(all_time_series)

x = np.arange(0, 285, 1)
y = np.arange(0, 130, 1)

X, Y = np.meshgrid(x, y)
Z = []
for i in range(130):
    Z.append([])
    for j in range(285):
        Z[i].append(float(all_time_series[285 * i + j][0]))
Z = np.array(Z)

fig = plt.figure()
ax = Axes3D(fig)
ax.plot_surface(X, Y, Z, color='blue')

print(X.shape)
print(Z.shape)
plt.show()
