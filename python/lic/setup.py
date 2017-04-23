# to run build
# $ python setup.py build_ext --inplace
# after running this command,
# $ python lic_demo.py is running

from distutils.core import setup
from distutils.extension import Extension
from Cython.Distutils import build_ext
import numpy

setup(
    cmdclass = {'build_ext': build_ext},
    ext_modules = [Extension("lic_internal", ["lic_internal.pyx"])],
    include_dirs = [numpy.get_include()]
)
