/**
 * Created by abraham on 15/4/25.
 */

function $(id) {
  return document.getElementById(id);
}

function rotate($ele, deg) {
  $ele.style.transform = 'rotate(' + (deg * 360 - 90) + 'deg)';
}
function initClock() {
  var $h = $('hour');
  var $m = $('minute');
  var $s = $('second');

  function run() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    rotate($h, (h >= 12 ? h - 12 : h) / 12);
    rotate($m, m / 60);
    rotate($s, s / 60);
  }

  run();

  setTimeout(function() {
    $('clock').className = 'clock';
    setInterval(run, 1000);
  }, 1000);

}