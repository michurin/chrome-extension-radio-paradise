/*
 * Radio Paradise player
 * Copyright (c) 2014-2018 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global open_url_in_new_tab, $ */

'use strict';

$.id('rp-link').onclick = function () {
  open_url_in_new_tab('http://www.radioparadise.com/');
};
