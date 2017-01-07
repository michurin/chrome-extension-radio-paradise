/*
 * Radio Paradise player
 * Copyright (c) 2014-2017 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*global $ */

'use strict';

$.id('rate-it').onclick = function () {
  chrome.tabs.update({
    url: 'https://chrome.google.com/webstore/detail/radio-paradise-player/' + chrome.runtime.id + '/reviews'
  });
};
