/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */

'use strict';

(function () {

  window.document.getElementById('reload').onclick = function () {
    if (window.confirm('Are you sure you want to reload extension?')) {
      chrome.runtime.reload();
    }
  };

}());
