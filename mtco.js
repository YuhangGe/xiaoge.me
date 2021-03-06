(function() {
  'use strict';
  function log() {
    console.log.apply(console, arguments);
  }

  function $on(ele, eventName, eventHandler) {
    ele.addEventListener(eventName, eventHandler);
  }

  function $isString(obj) {
    return typeof obj === 'string';
  }
  function $isFunction(obj) {
    return typeof obj === 'function';
  }
  function $isUndefined(obj) {
    return typeof obj === 'undefined';
  }
  function $load(func) {
    $on(document, 'DOMContentLoaded', func);
  }
  function $(val) {
    if ($isFunction(val)) {
      return $load(val);
    }
    if ($isString(val)) {
      val = document.querySelector(val);
    }
    return new MTCOElement(val);
  }
  function $ce(tag) {
    return new MTCOElement(document.createElement(tag));
  }
  function MTCOElement(ele) {
    this.ele = ele;
  }
  MTCOElement.prototype = {
    css: function(name, value) {
      if ($isString(name)) {
        this.ele.style[name] = value;
      } else {
        for (var n in name) {
          this.ele.style[n] = name[n]
        }
      }
      return this;
    },
    attr: function(name, value) {
      if ($isUndefined(value)) {
        return this.ele.getAttribute(name);
      } else {
        this.ele.setAttribute(name, value);
        return this;
      }
    },
    appendTo: function(parent) {
      parent.ele.appendChild(this.ele);
      return this;
    },
    width: function() {
      return this.ele.offsetWidth;
    },
    height: function() {
      return this.ele.offsetHeight;
    },
    hasC: function(className) {
      return (' ' + this.ele.className + ' ').indexOf(' ' + className + ' ') >= 0;
    },
    addC: function(className) {
      if (this.hasC(className)) {
        this.ele.className = (this.ele.className + ' ' + className).trim();
      }
      return this;
    },
    rmC: function(className) {
      this.ele.className = (' ' + this.ele.className + ' ').replace(' ' + className + ' ', '').trim();
      return this;
    },
    remove: function() {
      this.ele.parentElement.removeChild(this.ele);
      return this;
    },
    text: function(val) {
      if ($isUndefined(val)) {
        return this.ele.textContent;
      } else {
        this.ele.textContent = val;
        return this;
      }
    }
  };

  function $all(selector) {
    return document.querySelectorAll(selector);
  }
  function $css(ele, name, value) {
    ele.style[name] = value;
  }

  var $$body, $$main;
  var $$song, $$author;
  var $$me, $$slogan;
  var lrc = '原来我非不快乐,只我一人未发觉,再见二丁目'.split(',');

  (function loadLRC() {
    var http = new XMLHttpRequest();
    http.open('GET', 'lrc/' + Math.floor(Math.random() * MTCO.lrcCount) + '.txt', true);
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200) {
        //log(http.responseText);
        //log(http.responseText.split(/\s+/));
        var lrcs = http.responseText.split(/\s+/);
        if (lrcs.length === 3) {
          lrc = lrcs;
        }
      }
    };
    http.send();
  })();

  $load(function checkMTCOFont() {
    var ele1 = $ce('span');
    var ele2 = $ce('span');
    var txt = 'MORETHANcode';
    $$song = $('#song');
    $$author = $('#author');
    $$me = $('#me');
    $$slogan = $('#slogan');
    $$body = $(document.body);
    $$main = $('#main');

    var p = {
      position: 'absolute',
      left: '-1000px',
      visibility: 'hidden',
      margin: 0,
      padding: 0,
      fontFamily: 'mtco, Arial',
      fontSize: '60px'
    };
    ele1.css(p).text(txt).appendTo($$body);
    p.fontFamily = 'Arial';
    ele2.css(p).text(txt).appendTo($$body);
    var ts = Date.now();
    function check() {
      if (ele1.width() !== ele2.width()) {
        ele1.remove();
        ele2.remove();
        afterLoad(Date.now() - ts);
      } else {
        setTimeout(check, 0);
      }
    }
    check();
  });

  function afterLoad(delay) {
    $$main.css('display', '');

    setTimeout(function() {
      initClock();
      $$main.rmC('hide');
      setTimeout(function() {
        $('#song-line-a').text(lrc[0]);
        $('#song-line-b').text(lrc[1]);
        $('#song-author-name').text(lrc[2]);
        $$me.rmC('center');
        $$slogan.rmC('center');
        $$song.rmC('hide');
        $$author.rmC('hide');
      }, 1500);

    }, delay < 80 ? 80 : 10);

  }

  function initClock() {
    var $h = $('#hour');
    var $m = $('#minute');
    var $s = $('#second');

    function run() {
      var now = new Date();
      var h = now.getHours();
      var m = now.getMinutes();
      var s = now.getSeconds();
      rotate($h, (h >= 12 ? h - 12 : h) / 12);
      rotate($m, m / 60);
      rotate($s, s / 60);
    }

    function rotate($ele, deg) {
      $ele.css('transform', 'rotate(' + (deg * 360 - 90) + 'deg)');
      $ele.css('webkitTransform', 'rotate(' + (deg * 360 - 90) + 'deg)');
    }

    run();

    setTimeout(function() {
      $('#clock').rmC('init');
      setInterval(run, 1000);
    }, 1000);

  }
})();