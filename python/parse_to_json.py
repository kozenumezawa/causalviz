import json
import numpy

def split(item):
    reshaped = item.reshape((2, len(item) // 2))
    return {
        'x': [str(v) for v in reshaped[0]],
        'y': [str(v) for v in reshaped[1]],
    }

def main():
    data = numpy.load('./ocean.npy')
    data_list = []

    shape = data.shape
    h = shape[0]

    # for height in range(h):
    for height in range(1):
        each_data_list = []
        for i, item in enumerate(data[height]):
            each_data_list.append({
                's': list(item[0]),
                't': list(item[1])
            })
        data_list.append(each_data_list)
    obj = {
        'data_list': data_list
    }
    json.dump(obj, open('../front/dist/ocean.json', 'w'), sort_keys=False)

if __name__ == '__main__':
    main()
