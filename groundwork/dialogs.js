// cosmetics

(function() {
  document.getElementById('content').innerText = new Array(100).join('space ');
}());

// dialoger

var dialogs_generator = (function () {
  var dialogs = document.getElementById('dialogs');
  return function (name) {
    var e = document.getElementById(name);
    return {
      open: function () {
        dialogs.style.display = 'block';
        e.style.display = 'block';
      },
      close: function () {
        dialogs.style.display = 'none';
        e.style.display = 'none';
      }
    }
  }
}());

// demo

(function() {
  var idea = dialogs_generator('idea_box');
  document.getElementById('call_dialog').onclick = idea.open;
  document.getElementById('idea_ok').onclick = idea.close;
  document.getElementById('idea_hmm').onclick = function () {
    console.log('hmm…');
    idea.close();
  }
  var ok = dialogs_generator('ok_box');
  document.getElementById('call_ok_dialog').onclick = ok.open;
  document.getElementById('ok_ok').onclick = ok.close;
}());
