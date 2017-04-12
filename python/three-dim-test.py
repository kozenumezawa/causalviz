# coding: utf-8
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt
import numpy as np

x = np.arange(0, 128, 1)
y = np.arange(0, 96, 1)

X, Y = np.meshgrid(x, y)

Z = np.sin(X) + np.cos(Y)

fig = plt.figure()
ax = Axes3D(fig)
ax.plot_surface(X, Y, Z, color='blue')

print(X.shape)
print(Z.shape)
plt.show()
