/*
 * Radio Paradise player
 * Copyright (c) 2014-2018 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome, window, $ */

'use strict';

$.id('rp-link').onclick = function () {
  chrome.extension.sendMessage({ action: 'modern_player' });
  window.close();
};
