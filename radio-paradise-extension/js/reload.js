/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global opacity_animator_generator */

'use strict';

(function () {

  var dialog = opacity_animator_generator('dialog-reload');
  window.document.getElementById('dialog-reload-cancel').onclick = dialog.close;
  window.document.getElementById('dialog-reload-reload').onclick = function () {
    dialog.close();
    chrome.runtime.reload();
  };

  window.document.getElementById('reload').onclick = dialog.open;

}());
