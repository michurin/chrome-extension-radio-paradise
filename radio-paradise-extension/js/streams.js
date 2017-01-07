/*
 * Radio Paradise player
 * Copyright (c) 2014-2017 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*exported streams */

'use strict';

var streams = {};

streams.list =   [
  [ 'ogg-192k', {
    url: 'http://stream-tx3.radioparadise.com:80/ogg-192',
    title: 'ogg 192k',
    hidden_by_default: false
  } ],
  [ 'ogg-192k-us', {
    url: 'http://stream-dc1.radioparadise.com:80/ogg-192',
    title: 'ogg 192k (us)',
    hidden_by_default: false
  } ],
  [ 'ogg-192k-uk', {
    url: 'http://stream-uk1.radioparadise.com:80/ogg-192',
    title: 'ogg 192k (uk)',
    hidden_by_default: false
  } ],
  [ 'ogg-192k-ru', {
    url: 'http://stream-ru1.radioparadise.com:9000/ogg-192',
    title: 'ogg 192k (ru)',
    hidden_by_default: true
  } ],
  [ 'ogg-96k', {
    url: 'http://stream-tx3.radioparadise.com:80/ogg-96',
    title: 'ogg 96k',
    hidden_by_default: false
  } ],
  [ 'ogg-96k-us', {
    url: 'http://stream-dc1.radioparadise.com:80/ogg-96',
    title: 'ogg 96k (us)',
    hidden_by_default: false
  } ],
  [ 'ogg-96k-uk', {
    url: 'http://stream-uk1.radioparadise.com:80/ogg-96',
    title: 'ogg 96k (uk)',
    hidden_by_default: false
  } ],
  [ 'ogg-96k-ru', {
    url: 'http://stream-ru1.radioparadise.com:9000/ogg-96',
    title: 'ogg 96k (ru)',
    hidden_by_default: true
  } ],
  [ 'ogg-32k', {
    url: 'http://stream-tx3.radioparadise.com:80/ogg-32',
    title: 'ogg 32k',
    hidden_by_default: false
  } ],
  [ 'ogg-32k-us', {
    url: 'http://stream-dc1.radioparadise.com:80/ogg-32',
    title: 'ogg 32k (us)',
    hidden_by_default: true
  } ],
  [ 'ogg-32k-uk', {
    url: 'http://stream-uk1.radioparadise.com:80/ogg-32',
    title: 'ogg 32k (uk)',
    hidden_by_default: true
  } ],
  [ 'mp3-192k', {
    url: 'http://stream-tx3.radioparadise.com:80/mp3-192',
    title: 'mp3 192k',
    hidden_by_default: true
  } ],
  [ 'mp3-192k-us', {
    url: 'http://stream-dc1.radioparadise.com:80/mp3-192',
    title: 'mp3 192k (us)',
    hidden_by_default: true
  } ],
  [ 'mp3-192k-uk', {
    url: 'http://stream-uk1.radioparadise.com:80/mp3-192',
    title: 'mp3 192k (uk)',
    hidden_by_default: true
  } ],
  [ 'mp3-192k-ru', {
    url: 'http://stream-ru1.radioparadise.com:9000/mp3-192',
    title: 'mp3 192k (ru)',
    hidden_by_default: true
  } ],
  [ 'mp3-128k', {
    url: 'http://stream-tx3.radioparadise.com:80/mp3-128',
    title: 'mp3 128k',
    hidden_by_default: true
  } ],
  [ 'mp3-128k-us', {
    url: 'http://stream-dc1.radioparadise.com:80/mp3-128',
    title: 'mp3 128k (us)',
    hidden_by_default: true
  } ],
  [ 'mp3-128k-uk', {
    url: 'http://stream-uk1.radioparadise.com:80/mp3-128',
    title: 'mp3 128k (uk)',
    hidden_by_default: true
  } ],
  [ 'mp3-128k-ru', {
    url: 'http://stream-ru1.radioparadise.com:9000/mp3-128',
    title: 'mp3 128k (ru)',
    hidden_by_default: true
  } ],
  [ 'mp3-32k', {
    url: 'http://stream-tx3.radioparadise.com:80/mp3-32',
    title: 'mp3 32k',
    hidden_by_default: true
  } ],
  [ 'mp3-32k-us', {
    url: 'http://stream-dc1.radioparadise.com:80/mp3-32',
    title: 'mp3 32k (us)',
    hidden_by_default: true
  } ],
  [ 'mp3-32k-uk', {
    url: 'http://stream-uk1.radioparadise.com:80/mp3-32',
    title: 'mp3 32k (uk)',
    hidden_by_default: true
  } ],

  [
    'aac-320k',
    {
      hidden_by_default: true,
      title: 'aac 320k (us-tx)',
      url: 'http://stream-tx3.radioparadise.com:80/aac-320'
    }
  ],
  [
    'aac-320k-us',
    {
      hidden_by_default: true,
      title: 'aac 320k (us-dc)',
      url: 'http://stream-dc1.radioparadise.com:80/aac-320'
    }
  ],
  [
    'aac-320k-uk',
    {
      hidden_by_default: true,
      title: 'aac 320k (uk)',
      url: 'http://stream-uk1.radioparadise.com:80/aac-320'
    }
  ],
  [
    'aac-320k-ru',
    {
      hidden_by_default: true,
      title: 'aac 320k (ru)',
      url: 'http://stream-ru1.radioparadise.com:9000/aac-320'
    }
  ],
  [
    'aac-128k',
    {
      hidden_by_default: true,
      title: 'aac 128k (us-tx)',
      url: 'http://stream-tx3.radioparadise.com:80/aac-128'
    }
  ],
  [
    'aac-128k-us',
    {
      hidden_by_default: true,
      title: 'aac 128k (us-dc)',
      url: 'http://stream-dc1.radioparadise.com:80/aac-128'
    }
  ],
  [
    'aac-128k-uk',
    {
      hidden_by_default: true,
      title: 'aac 128k (uk)',
      url: 'http://stream-uk1.radioparadise.com:80/aac-128'
    }
  ],
  [
    'aac-128k-ru',
    {
      hidden_by_default: true,
      title: 'aac 128k (ru)',
      url: 'http://stream-ru1.radioparadise.com:9000/aac-128'
    }
  ],
  [
    'aac-64k',
    {
      hidden_by_default: true,
      title: 'aac 64k (us-tx)',
      url: 'http://stream-tx3.radioparadise.com:80/aac-64'
    }
  ],
  [
    'aac-64k-us',
    {
      hidden_by_default: true,
      title: 'aac 64k (us-dc)',
      url: 'http://stream-dc1.radioparadise.com:80/aac-64'
    }
  ],
  [
    'aac-64k-uk',
    {
      hidden_by_default: true,
      title: 'aac 64k (uk)',
      url: 'http://stream-uk1.radioparadise.com:80/aac-64'
    }
  ],
  [
    'aac-64k-ru',
    {
      hidden_by_default: true,
      title: 'aac 64k (ru)',
      url: 'http://stream-ru1.radioparadise.com:9000/aac-64'
    }
  ],
  [
    'aac-32k',
    {
      hidden_by_default: true,
      title: 'aac 32k (us-tx)',
      url: 'http://stream-tx3.radioparadise.com:80/aac-32'
    }
  ],
  [
    'aac-32k-us',
    {
      hidden_by_default: true,
      title: 'aac 32k (us-dc)',
      url: 'http://stream-dc1.radioparadise.com:80/aac-32'
    }
  ],
  [
    'aac-32k-uk',
    {
      hidden_by_default: true,
      title: 'aac 32k (uk)',
      url: 'http://stream-uk1.radioparadise.com:80/aac-32'
    }
  ],
  [
    'aac-32k-ru',
    {
      hidden_by_default: true,
      title: 'aac 32k (ru)',
      url: 'http://stream-ru1.radioparadise.com:9000/aac-32'
    }
  ],
  [
    'aac-24k',
    {
      hidden_by_default: true,
      title: 'aac 24k (us-tx)',
      url: 'http://stream-tx3.radioparadise.com:80/aac-24'
    }
  ],
  [
    'aac-24k-us',
    {
      hidden_by_default: true,
      title: 'aac 24k (us-dc)',
      url: 'http://stream-dc1.radioparadise.com:80/aac-24'
    }
  ],
  [
    'aac-24k-uk',
    {
      hidden_by_default: true,
      title: 'aac 24k (uk)',
      url: 'http://stream-uk1.radioparadise.com:80/aac-24'
    }
  ],
  [
    'aac-24k-ru',
    {
      hidden_by_default: true,
      title: 'aac 24k (ru)',
      url: 'http://stream-ru1.radioparadise.com:9000/aac-24'
    }
  ]

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
  stream: 'ogg-96k',
  hidden: (function (x) {
    // used only as generator in storage.js
    return function () {
      var i, v, r = {};
      for (i = 0; i < x.length; ++i) {
        v = x[i];
        if (v[1].hidden_by_default) {
          r[v[0]] = true;
        }
      }
      return r;
    };
  }(streams.list))
};
