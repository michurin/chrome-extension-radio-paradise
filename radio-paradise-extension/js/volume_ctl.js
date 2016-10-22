/*
 * Radio Paradise player
 * Copyright (c) 2014-2016 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global storage */
/*exported volume_change */

'use strict';

function volume_change(levels) {
  storage.get(['volume'], function (x) {
    var v = x.volume;
    v += 1 / levels;
    v = Math.round(v * levels) / levels;
    v = v > 1 ? 1 : v;
    v = v < 0 ? 0 : v;
    storage.set({volume: v});
  });
}
