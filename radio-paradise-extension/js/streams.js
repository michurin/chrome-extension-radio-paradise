/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

'use strict';

var streams = {};

streams.list = [
  ['ogg-32k', {
    title: 'ogg 32k',
    url: 'http://stream-tx3.radioparadise.com/rp_32.ogg'
  }],
  ['ogg-96k', {
    title: 'ogg 96k',
    url: 'http://stream-tx3.radioparadise.com/rp_96.ogg'
  }],
  ['ogg-96k-uk', {
    title: 'ogg 96k (uk)',
    url: 'http://stream-uk1.radioparadise.com/rp-96.ogg'
  }],
  ['ogg-96k-ru', {
    title: 'ogg 96k (ru)',
    url: 'http://stream-ru1.radioparadise.com:9000/rp_96.ogg'
  }],
  ['ogg-192k', {
    title: 'ogg 192k',
    url: 'http://stream-tx3.radioparadise.com/rp_192.ogg'
  }],
  ['mp3-32k-us', {
    title: 'mp3 32k (us)',
    url: 'http://stream-dc1.radioparadise.com/mp3-32'
  }],
  ['mp3-32k-eu', {
    title: 'mp3 32k (eu)',
    url: 'http://stream-uk1.radioparadise.com/mp3-32'
  }],
  ['mp3-128k-us-tx', {
    title: 'mp3 128k (us-tx)',
    url: 'http://stream-tx1.radioparadise.com/mp3-128'
  }],
  ['mp3-128k-us-dc', {
    title: 'mp3 128k (us-dc)',
    url: 'http://stream-dc1.radioparadise.com/mp3-128'
  }],
  ['mp3-128k-eu', {
    title: 'mp3 128k (eu)',
    url: 'http://stream-uk1.radioparadise.com/mp3-128'
  }],
  ['mp3-128k-ru', {
    title: 'mp3 128k (ru)',
    url: 'http://stream-ru1.radioparadise.com:9000/mp3-128'
  }],
  ['mp3-192k-us-tx', {
    title: 'mp3 192k (us-tx)',
    url: 'http://stream-tx3.radioparadise.com/mp3-192'
  }],
  ['mp3-192k-us-dc', {
    title: 'mp3 192k (us-dc)',
    url: 'http://stream-dc1.radioparadise.com/mp3-192'
  }],
  ['mp3-192k-eu', {
    title: 'mp3 192k (eu)',
    url: 'http://stream-uk1.radioparadise.com/mp3-192'
  }]
];

streams.map = (function (x) {
  var i, v, d = {};
  for (i = 0; i < x.length; ++i) {
    v = x[i];
    d[v[0]] = v[1];
  }
  return d;
}(streams.list));

streams.def = {
  stream: 'ogg-96k'
};
