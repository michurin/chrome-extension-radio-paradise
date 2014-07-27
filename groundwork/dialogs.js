// cosmetics

(function() {
  document.getElementById('content').innerText = new Array(100).join('space ');
}());

// demo

(function() {
  var idea = opacity_animator_generator('idea_box');
  document.getElementById('call_dialog').onclick = idea.open;
  document.getElementById('idea_ok').onclick = idea.close;
  document.getElementById('idea_hmm').onclick = function () {
    console.log('hmm…');
    idea.close();
  }
  var ok = opacity_animator_generator('ok_box');
  document.getElementById('call_ok_dialog').onclick = ok.open;
  document.getElementById('ok_ok').onclick = ok.close;
}());
