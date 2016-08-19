// Generated by CoffeeScript 1.10.0

/*
Author: Jason Gwartz
2016
 */
var ForLoop, IfConditional, SoundNode, Wrapper,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Wrapper = (function() {
  Wrapper.instances = [];

  function Wrapper(name1, extra_html) {
    this.name = name1;
    Wrapper.instances.push(this);
    this.html = "<div class=\"node node-wrapper panel panel-default\" id=\"" + this.name + "\">\n  <div class=\"panel-body sn-node-title\">" + this.name + "</div>\n  " + extra_html + "\n</div>";
  }

  Wrapper.parse_input = function(str) {
    var TypeError, error1, i, re;
    re = /(\d+(\.\d+)?)/g;
    try {
      return (function() {
        var j, len, ref, results;
        ref = str.match(re);
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          if (parseFloat(i) < 5) {
            results.push(parseFloat(i));
          }
        }
        return results;
      })();
    } catch (error1) {
      TypeError = error1;
      return [];
    }
  };

  Wrapper.prototype.eval_input = function(jq) {
    return this.check(jq.find("select").val(), jq.find("input").val(), jq);
  };

  return Wrapper;

})();

IfConditional = (function(superClass) {
  var extra_html, name;

  extend(IfConditional, superClass);

  name = "If";

  extra_html = "<select class=\"form-control input-xs\" id=\"if-select\">\n    <option value=\"beat\">Beat</option>\n    <option value=\"bar\">Bar</option>\n    <option value=\"phrase\">Phrase</option>\n  </select>\n  <div class=\"sn-node-title\">is</div>\n<input type=\"text\" id=\"if-input\" class=\"form-control input-xs\">";

  function IfConditional() {
    IfConditional.__super__.constructor.call(this, name, extra_html);
  }

  return IfConditional;

})(Wrapper);

ForLoop = (function(superClass) {
  var extra_html, name, registered;

  extend(ForLoop, superClass);

  name = "For";

  registered = false;

  extra_html = "<input type=\"text\" id=\"for-input\" class=\"form-control input-xs\">\n<select class=\"form-control input-xs\" id=\"for-select\">\n    <option value=\"beat\">Beats</option>\n    <option value=\"bar\">Bars</option>\n    <option value=\"phrase\">Phrases</option>\n  </select>";

  function ForLoop() {
    ForLoop.__super__.constructor.call(this, name, extra_html);
  }

  ForLoop.prototype.for_loop = function(loop_block, number_loops) {
    if (loop_block === "phrases") {
      return pass();
    } else if (loop_block === "bars") {
      return pass();
    } else if (loop_block === "beats") {
      return pass();
    }
  };

  return ForLoop;

})(Wrapper);

SoundNode = (function() {
  SoundNode.tray_instances = [];

  SoundNode.canvas_instances = [];

  function SoundNode(instrument) {
    var i, node_number;
    this.instrument = instrument;
    node_number = ((function() {
      var j, len, ref, results;
      ref = SoundNode.canvas_instances;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        if (i.instrument === this.instrument) {
          results.push(i);
        }
      }
      return results;
    }).call(this)).length + 1;
    this.id = (function() {
      switch (node_number) {
        case 1:
          return this.instrument.name;
        default:
          return this.instrument.name + node_number;
      }
    }).call(this);
    this.wrappers = {
      conditionals: {},
      forloops: {}
    };
    this.playing_phrases = [];
    this.playing_bars = [];
    this.playing_beats = [];
    this.html = "<div class=\"node-sample-container\n  panel panel-default\" id=\"" + this.id + "-container\">\n<div class=\"wrappers\">\n</div>\n<div class=\"node node-sample panel-footer\" id=\"" + this.id + "\">\n  <div class=\" sn-node-title\">" + this.id + "</div>\n</div>\n</div>\n";
  }

  SoundNode.prototype.phrase_eval = function() {
    var j, len, ref, w;
    if (!$("#" + this.id + "-container").data("live")) {
      return;
    }
    this.wrappers = [];
    this.playing_bars = [];
    this.playing_beats = [];
    ref = $("#" + this.id + "-container").find(".wrappers").children();
    for (j = 0, len = ref.length; j < len; j++) {
      w = ref[j];
      this.wrappers.push({
        wrapper: w.id.toLowerCase(),
        range: $(w).find("select").val(),
        input: Wrapper.parse_input($(w).find("input").val()),
        data: $(w).data("Wrapper"),
        live: $(w).data("live"),
        jq: $(w)
      });
    }
    return this.node_eval();
  };

  SoundNode.prototype.node_eval = function(index) {
    var error, error1;
    if (index == null) {
      index = 0;
    }
    if (index >= this.wrappers.length) {
      this.play();
      return;
    } else if (!this.wrappers[index].live) {
      this.node_eval(index + 1);
      return;
    }
    try {
      switch (this.wrappers[index].range) {
        case "phrase" || "phrases":
          return this.eval_phrase_node(this.wrappers[index], index);
        case "bar" || "bars" || "bar":
          return this.eval_bar_node(this.wrappers[index], index);
        case "beat" || "beats":
          return this.eval_beat_node(this.wrappers[index], index);
      }
    } catch (error1) {
      error = error1;
      console.log(error);
    }
  };

  SoundNode.prototype.eval_bar_node = function(node, index, offset) {
    var i, j, k, len, ref, ref1, ref2;
    if (offset == null) {
      offset = 1;
    }
    switch (node.wrapper) {
      case "if":
        if (this.playing_bars.length !== 0) {
          this.playing_bars = (function() {
            var j, len, ref, results;
            ref = this.playing_bars;
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
              i = ref[j];
              if (indexOf.call(node.input, i) >= 0) {
                results.push(i);
              }
            }
            return results;
          }).call(this);
        } else {
          ref = node.input;
          for (j = 0, len = ref.length; j < len; j++) {
            i = ref[j];
            if (indexOf.call(this.playing_bars, i) < 0) {
              this.playing_bars.push(i);
            }
          }
        }
        break;
      case "for":
        for (i = k = ref1 = offset, ref2 = offset + node.input[0]; ref1 <= ref2 ? k < ref2 : k > ref2; i = ref1 <= ref2 ? ++k : --k) {
          if (indexOf.call(this.playing_bars, i) < 0) {
            this.playing_bars.push(i);
          }
        }
    }
    return this.node_eval(index + 1);
  };

  SoundNode.prototype.eval_beat_node = function(node, index, start_beat) {
    var bar, beat, corrected_beat, i, j, k, l, len, len1, len2, len3, len4, m, n, new_beats, o, q, r, ref, ref1, ref10, ref11, ref12, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, s, t;
    if (start_beat == null) {
      start_beat = 1;
    }
    switch (node.wrapper) {
      case "if":
        if (this.playing_beats.length !== 0) {
          new_beats = [];
          ref = node.input;
          for (j = 0, len = ref.length; j < len; j++) {
            i = ref[j];
            corrected_beat = (function(i) {
              if (i % 4 > 0) {
                return i % 4;
              } else {
                return 4;
              }
              if (indexOf.call(node.input, corrected_beat) >= 0) {
                new_beats.push(i);
              }
              return this.playing_beats = new_beats;
            })(i);
          }
        } else {
          for (bar = k = 1; k <= 4; bar = ++k) {
            ref1 = node.input;
            for (l = 0, len1 = ref1.length; l < len1; l++) {
              beat = ref1[l];
              this.playing_beats.push(beat + (bar - 1) * 4);
            }
          }
        }
        break;
      case "for":
        if (this.playing_beats.length !== 0) {
          ref2 = this.playing_beats;
          for (m = 0, len2 = ref2.length; m < len2; m++) {
            start_beat = ref2[m];
            if (this.playing_bars.length !== 0) {
              ref3 = this.playing_bars;
              for (n = 0, len3 = ref3.length; n < len3; n++) {
                bar = ref3[n];
                for (beat = o = ref4 = start_beat, ref5 = start_beat + node.input[0]; ref4 <= ref5 ? o < ref5 : o > ref5; beat = ref4 <= ref5 ? ++o : --o) {
                  this.playing_beats.push(beat + (bar - 1) * 4);
                }
              }
            } else {
              for (i = q = ref6 = start_beat, ref7 = start_beat + node.input[0]; ref6 <= ref7 ? q < ref7 : q > ref7; i = ref6 <= ref7 ? ++q : --q) {
                this.playing_beats.push(i);
              }
            }
          }
        } else {
          if (this.playing_bars.length !== 0) {
            ref8 = this.playing_bars;
            for (r = 0, len4 = ref8.length; r < len4; r++) {
              bar = ref8[r];
              for (beat = s = ref9 = start_beat, ref10 = start_beat + node.input[0]; ref9 <= ref10 ? s < ref10 : s > ref10; beat = ref9 <= ref10 ? ++s : --s) {
                this.playing_beats.push(beat + (bar - 1) * 4);
              }
            }
          } else {
            for (i = t = ref11 = start_beat, ref12 = start_beat + node.input[0]; ref11 <= ref12 ? t < ref12 : t > ref12; i = ref11 <= ref12 ? ++t : --t) {
              this.playing_beats.push(i);
            }
          }
        }
    }
    return this.node_eval(index + 1);
  };

  SoundNode.prototype.eval_phrase_node = function(node, index) {
    var i, j, k, len, ref, ref1, ref2;
    switch (node.wrapper) {
      case "if":
        ref = node.input;
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          if (indexOf.call(this.playing_phrases, i) < 0) {
            this.playing_phrases.push(i);
          }
        }
        break;
      case "for":
        if (!node.data.registered) {
          node.data.registered = true;
          for (i = k = ref1 = phrase, ref2 = phrase + node.input[0]; ref1 <= ref2 ? k < ref2 : k > ref2; i = ref1 <= ref2 ? ++k : --k) {
            if (indexOf.call(this.playing_phrases, i) < 0) {
              this.playing_phrases.push(i);
            }
          }
        }
    }
    return this.node_eval(index + 1);
  };

  SoundNode.prototype.play = function() {
    var j, k, l, len, len1, p, phrases_expired, ref, ref1, ref2, ref3, results, results1, results2;
    phrases_expired = this.playing_phrases.every(function(i) {
      return i < phrase;
    });
    if (indexOf.call(this.playing_phrases, phrase) < 0 && this.playing_phrases.length !== 0) {

    } else {
      if (this.playing_bars.length !== 0) {
        if (this.playing_beats.length !== 0) {
          ref = this.playing_beats;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            p = ref[j];
            if (ref1 = Math.ceil(p / 4), indexOf.call(this.playing_bars, ref1) >= 0) {
              results.push(this.instrument.add(p));
            } else {
              results.push(void 0);
            }
          }
          return results;
        } else {
          results1 = [];
          for (p = k = 1; k <= 16; p = k += 4) {
            if (ref2 = Math.floor(p / 4) + 1, indexOf.call(this.playing_bars, ref2) >= 0) {
              results1.push(this.instrument.add(p));
            }
          }
          return results1;
        }
      } else {
        ref3 = this.playing_beats;
        results2 = [];
        for (l = 0, len1 = ref3.length; l < len1; l++) {
          p = ref3[l];
          results2.push(this.instrument.add(p));
        }
        return results2;
      }
    }
  };

  return SoundNode;

})();
