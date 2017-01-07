#!/usr/bin/python2
# coding: U8

'''
Get valid names, titles and urls. Clean dups. Sort. Produce json ready for streams.js
'''


import sys
import json


def read_orig(in_name):
    with open(in_name, 'r') as f:
        save = False
        data = ''
        for x in f:
            if save:
                if x.startswith('streams.map'):
                    save = False
                else:
                    data += x
            if x.startswith('streams.list'):
                save = True
    # hacks
    s = ('[' + data.strip()[:-1]).decode('U8')
    s = s.replace("'", '"')
    for x in 'url', 'title', 'hidden_by_default':
        s = s.replace(x, '"' + x + '"')
    # /hacks
    return json.loads(s)


def key(x):
    a = x[0].split('-')
    if len(a) == 2:
        s, b = a
        l = 'z'  # bigest in sort
    else:
        s, b, l = a
    b = '0' * (5 - len(b)) + b
    return '-'.join((s, b, l))


def save_js(data):
    s = json.dumps(data, indent=2, sort_keys=True, separators=(',', ': '))
    for x in 'url', 'title', 'hidden_by_default':
        s = s.replace('"' + x + '"', x)
    s = s.replace('"', "'")
    print s


def main():
    orig = read_orig('../radio-paradise-extension/js/streams.js')
    orig_data = dict(orig)
    assert len(orig) == len(orig_data)
    data = []
    urls = set()
    for x in sys.stdin:
        name, title, url = x.strip().split('\t')
        hidden = True
        if name in orig_data:
            hidden = orig_data[name]['hidden_by_default']
            del orig_data[name]
        if url in urls:
            print >>sys.stderr, 'Dup url %r' % url
            continue
        urls.add(url)
        data.append([
            name, {
                'url': url,
                'title': title,
                'hidden_by_default': hidden
            }
        ])
    assert len(orig_data) == 0
    data.sort(key=key, reverse=True)
    save_js(data)


if __name__ == '__main__':
    main()
