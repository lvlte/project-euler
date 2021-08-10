from ctypes import CDLL
import matplotlib.pyplot as plt
import numpy as np
from shapely.geometry import Point
from shapely.geometry import Polygon
from pprint import pprint
from mpl_toolkits import mplot3d

# Euler 070 - Plotting n/a(n,k) and n/b(n,gap)

font = {'fontsize': 10, 'fontweight': 100}
plt.style.use('dracula')

def a(n, k=2):
    return (n**(1/k) - 1)**k

def p1p2(rt, k):
    """ Returns (p1, p2) such that p1*p2=rt², given rt the square root of n and
        k an arbitrary gap that must lie bewteen p1 and p2.
    """
    b = 2*rt-k
    x = (-b + np.sqrt(b*b+4*k*rt))/2
    y = k-x
    return (rt-y, rt+x)

def b(rt, gap):
  (p1, p2) = p1p2(rt, gap)
  return (p1-1)*(p2-1)

# Plotting n/a(n)
title = 'n/φ(n) aproximated minimums (n product of 2 distinct prime factors)'

n = 100
plt.figure()
x = [ n for n in range(3, 100, 1) ]
y = list(map(lambda n: n/a(n), x))
plt.plot(x, y)
plt.xlabel('n')
plt.ylabel('n/a(n,2)')
plt.title(title, fontdict=font, pad=20.0)

n = 10**7
plt.figure()
x = [n for n in range(3, n, 2)]
y = list(map(lambda n: n/a(n), x))
plt.plot(x, y)
plt.xlim(1, n)
plt.ylim(1, 1.01)
plt.xlabel('n')
plt.ylabel('n/a(n,2)')
plt.title(title, fontdict=font, pad=20.0)


# Plotting n/b(n)

plt.figure()
x = [gap for gap in range(0, 8000, 4)]

for n in [10**7, 7500000, 5000000]:
    rt = np.sqrt(n)
    y = list(map(lambda k: n/b(rt, k), x))
    plt.plot(x, y, label=f'n = {n}')

plt.legend(loc="upper left")
plt.xlabel('gap')
plt.ylabel('n/b(n,gap)')

# The minimum ratio of n/b(n,0) (no gap)
r75min = 7500000/b(np.sqrt(7500000), 0)
r50min = 5000000/b(np.sqrt(5000000), 0)

# Finding the maximum gap k that yields an inferior ratio n/b(n,k) for n=10^7
# when compared to r75min and r50min.
n = 10**7
rt = np.sqrt(n)
gap = None

for k in x:
    r = n/b(rt, k)
    if r > r75min:
        while r > r75min:
            k-= 2
            r = n/b(rt, k)
        gap = k
        break
plt.plot([0, gap], [r75min, r75min], ':w', linewidth=1)
plt.plot([gap, gap], [plt.ylim()[0], r75min], ':w', linewidth=1)

for k in x[gap//4:]:
    r = n/b(rt, k)
    if r > r50min:
        while r > r50min:
            k-= 2
            r = n/b(rt, k)
        gap = k
        break
plt.plot([0, gap], [r50min, r50min], ':w', linewidth=1)
plt.plot([gap, gap], [plt.ylim()[0], r50min], ':w', linewidth=1)

plt.title('n/b(n,gap) ratios (n product of 2 distinct prime factors)', fontdict=font, pad=20.0)

plt.show()

