// Generated by CoffeeScript 1.10.0

/*
Author: Jason Gwartz
2016
 */
var LoadedSample, PlaySound, SoundContainer, context, main, play, play_patterns, sample_urls, samples, t;

sample_urls = ["../samples/drum_bass_hard.wav", "../samples/drum_cymbal_closed.wav", "../samples/drum_snare_hard.wav"];

context = null;

samples = null;

t = null;

LoadedSample = (function() {
  function LoadedSample(file) {
    var request, self;
    this.file = file;
    request = new XMLHttpRequest();
    request.open('GET', this.file, true);
    request.responseType = 'arraybuffer';
    self = this;
    request.onload = function() {
      return self.data = request.response;
    };
    request.send();
  }

  LoadedSample.prototype.play = function(n) {
    return context.decodeAudioData(this.data, function(decoded) {
      this.source = context.createBufferSource();
      this.source.buffer = decoded;
      this.source.connect(context.destination);
      console.log("n = " + n);
      return this.source.start(n);
    }, null);
  };

  return LoadedSample;

})();

PlaySound = (function() {
  function PlaySound(sample, beat) {
    this.sample = sample;
    this.beat = beat;
  }

  return PlaySound;

})();

SoundContainer = (function() {
  function SoundContainer() {
    this.buffer = [];
  }

  return SoundContainer;

})();

play = function() {
  var bd_beats, cym_beats, i, l, len, len1, len2, loaded, m, n, o, sd_beats;
  t = context.currentTime;
  loaded = true;
  [
    (function() {
      var l, len, results;
      results = [];
      for (l = 0, len = samples.length; l < len; l++) {
        i = samples[l];
        results.push(i.data === void 0 ? loaded = false : void 0);
      }
      return results;
    })()
  ];
  if (!loaded) {
    return alert("Samples still loading, please wait.");
  } else {
    bd_beats = (function() {
      var l, len, ref, results;
      ref = document.getElementById('bd').value.split(' ');
      results = [];
      for (l = 0, len = ref.length; l < len; l++) {
        n = ref[l];
        if (function(n) {
          if (n === NaN) {
            return false;
          }
        }) {
          results.push(t + parseFloat(n));
        }
      }
      return results;
    })();
    sd_beats = (function() {
      var l, len, ref, results;
      ref = document.getElementById('sd').value.split(' ');
      results = [];
      for (l = 0, len = ref.length; l < len; l++) {
        n = ref[l];
        if (function(n) {
          if (n === NaN) {
            return false;
          }
        }) {
          results.push(t + parseFloat(n));
        }
      }
      return results;
    })();
    cym_beats = (function() {
      var l, len, ref, results;
      ref = document.getElementById('cym').value.split(' ');
      results = [];
      for (l = 0, len = ref.length; l < len; l++) {
        n = ref[l];
        if (function(n) {
          if (n === NaN) {
            return false;
          }
        }) {
          results.push(t + parseFloat(n));
        }
      }
      return results;
    })();
    console.log(sd_beats);
    for (l = 0, len = bd_beats.length; l < len; l++) {
      i = bd_beats[l];
      samples[0].play(i);
    }
    for (m = 0, len1 = cym_beats.length; m < len1; m++) {
      i = cym_beats[m];
      samples[1].play(i);
    }
    for (o = 0, len2 = sd_beats.length; o < len2; o++) {
      i = sd_beats[o];
      samples[2].play(i);
    }
    return play_patterns;
  }
};

play_patterns = {
  drumbeat: function() {
    var i, j, k, l, m, o, ref, ref1, ref2, ref3, ref4, ref5, results;
    for (i = l = ref = t, ref1 = t + 8; ref <= ref1 ? l <= ref1 : l >= ref1; i = ref <= ref1 ? ++l : --l) {
      samples[0].play(i);
    }
    for (j = m = ref2 = t, ref3 = t + 8; m <= ref3; j = m += 0.25) {
      samples[1].play(j);
    }
    results = [];
    for (k = o = ref4 = t + 0.5, ref5 = t + 8; ref4 <= ref5 ? o <= ref5 : o >= ref5; k = ref4 <= ref5 ? ++o : --o) {
      results.push(samples[2].play(k));
    }
    return results;
  },
  bass_drum: function() {
    var i, l, ref, ref1, results;
    results = [];
    for (i = l = ref = t, ref1 = t + 8; ref <= ref1 ? l <= ref1 : l >= ref1; i = ref <= ref1 ? ++l : --l) {
      results.push(samples[0].play(i));
    }
    return results;
  }
};

main = function() {
  var i;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  return samples = (function() {
    var l, len, results;
    results = [];
    for (l = 0, len = sample_urls.length; l < len; l++) {
      i = sample_urls[l];
      results.push(new LoadedSample(i));
    }
    return results;
  })();
};

main();
