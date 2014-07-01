/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global storage */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

'use strict';

(function () {

  window.document.getElementById('clear-storage').onclick = function () {
    if (window.confirm('Are you sure you want to clear local storage of this extension? Extensions data will be lost: sound volume, media source etc.')) {
      storage.clear(function () {
        window.alert('OK. Extension local storage cleaned.');
      });
    }
  };

}());
