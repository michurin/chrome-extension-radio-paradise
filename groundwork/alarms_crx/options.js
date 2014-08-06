(function () {
  console.log('run?');
  document.getElementById('create').onclick = function () {
    var tt =  prompt('Enter time in format NN:NN', '12:30');
    if (tt) {
      var hm = tt.split(':').map(function (x) {return parseInt(x, 10)});
      var delta = (hm[0] * 60 + hm[1]) * 60 * 1000;
      var now = new Date();
      var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      console.log(hm, delta);
      console.log(now);
      console.log(midnight);
    }
  };
  root = document.getElementById('root');
  chrome.alarms.getAll(function (aa) {
    root.innerText = '';
    if (aa.length === 0) {
      root.innerText = 'no events';
    } else {
      aa.forEach(function (v) {
        var x = document.createElement('div');
        x.innerText = JSON.stringify(v);
        root.appendChild(x);
      });
    }
  });
}());