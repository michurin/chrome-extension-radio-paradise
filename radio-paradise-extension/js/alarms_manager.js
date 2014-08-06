/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global opacity_animator_generator */

'use strict';

(function () {

  var root = window.document.getElementById('alarms-root');

  function two(x) {
    if (x > 9) {
      return x;
    }
    return '0' + x;
  }

  var confirmation = opacity_animator_generator('dialog-remove-alarm');
  window.document.getElementById('dialog-remove-alarm-cancel').onclick = confirmation.close;
  var confirmation_delete = window.document.getElementById('dialog-remove-alarm-delete');

  function update() {
    chrome.alarms.getAll(function (aa) {
      if (aa.length === 0) {
        root.innerText = '(no alarms)';
      } else {
        root.innerText = '';
        var table = window.document.createElement('table');
        var tr = window.document.createElement('tr');
        ['Alarm', 'Action', 'Next', ''].forEach(function (v) {
          var th = window.document.createElement('th');
          th.innerText = v;
          tr.appendChild(th);
        });
        table.appendChild(tr);
        aa.sort(function (a, b) {
          return a.scheduledTime - b.scheduledTime;
        });
        aa.forEach(function (v) {
          var name = v.name;
          if (name.substr(0, 6) === 'alarm_') {
            var tr = window.document.createElement('tr');
            var h = name.substr(6, 2);
            var m = name.substr(9, 2);
            var a = name.substr(12);
            var d = new Date(v.scheduledTime);
            var fmt_d = d.getFullYear() + '-' +
              two(d.getMonth()) + '-' +
              two(d.getDate()) + ' ' +
              two(d.getHours()) + ':' +
              two(d.getMinutes());
            [h + ':' + m, a, fmt_d].forEach(function (v) {
              var td = window.document.createElement('td');
              td.innerText = v;
              tr.appendChild(td);
            });
            var x = window.document.createElement('div');
            x.innerText = '☒';
            x.onclick = function () {
              confirmation_delete.onclick = function () {
                confirmation.close();
                chrome.alarms.clear(name, update);
              }
              confirmation.open();
            };
            var td = window.document.createElement('td');
            td.appendChild(x);
            tr.appendChild(td);
            table.appendChild(tr);
          }
        });
        root.appendChild(table);
      }
    });
  }

  var controls = [3, 10, 6, 10].map(function (v, n) {
    var r = {
      up: window.document.getElementById('alarms-digit-' + n + '-up'),
      down: window.document.getElementById('alarms-digit-' + n + '-down'),
      digit: window.document.getElementById('alarms-digit-' + n),
      set: function (v) {
        r.digit.innerText = v;
      },
      get: function () {
        return parseInt(r.digit.innerText, 10);
      },
      incr: function () {
        r.set((r.get() + 1) % v);
      },
      decr: function () {
        r.set((r.get() + v - 1) % v);
      }
    };
    r.up.onclick = r.digit.onclick = r.incr;
    r.down.onclick = r.decr;
    return r;
  });

  var dialog = opacity_animator_generator('dialog-create-new-alarm');
  window.document.getElementById('dialog-create-new-alarm-cancel').onclick = dialog.close;
  window.document.getElementById('dialog-create-new-alarm-create').onclick = function () {
    var h = controls[0].get() * 10 + controls[1].get();
    var m = controls[2].get() * 10 + controls[3].get();
    if (h > 24) {
      h %= 24;
      controls[0].set(Math.floor(h / 10) % 10);
      controls[1].set(h % 10);
      return;
    }
    dialog.close();
    var checked = window.document.getElementById('alarm-action-on').checked;
    var action = checked ? 'on' : 'off';
    var antiaction = checked ? 'off' : 'on';
    var base_name = 'alarm_' + controls[0].get() + controls[1].get() + '_' + controls[2].get() + controls[3].get() + '_';
    var name = base_name + action;
    var antiname = base_name + antiaction;
    var delta = (h * 60 + m) * 60 * 1000;
    var now = new Date();
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var when = midnight.getTime() + delta;
    if (when < now.getTime() + 60000) {
      when += 24 * 60 * 60 * 1000;
    }
    chrome.alarms.create(name, {
      when: when,
      periodInMinutes: 24 * 60
    });
    chrome.alarms.clear(antiname, update);
  };

  window.document.getElementById('alarms-add-button').onclick = function () {
    controls.forEach(function (v) {
      v.set(0);
    });
    dialog.open();
  };

  chrome.alarms.onAlarm.addListener(update);

  update();

}());
