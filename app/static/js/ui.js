// Generated by CoffeeScript 1.10.0

/*
Author: Jason Gwartz
2016
 */
var canvas_init, ui_init, update_beat_labels, xy_compute;

$(document).ready(function() {
  var ios;
  ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (ios) {
    return $("#ios-start").modal().on("hidden.bs.modal", function() {
      return main();
    });
  } else {
    return main();
  }
});

canvas_init = function() {
  var glob;
  glob = this;
  $("#node-canvas").droppable({
    hoverClass: "node-canvas-hover",
    tolerance: "pointer",
    drop: function(evt, ui) {
      var new_sn, sn;
      if (ui.draggable.hasClass("on-canvas")) {
        return;
      }
      if (ui.draggable.hasClass("node-wrapper")) {
        ui.draggable.clone().appendTo("#node-canvas").addClass("on-canvas").draggable().data("Wrapper", ui.draggable.data("Wrapper")).position({
          of: evt
        });
      } else {
        sn = ui.draggable.data("SoundNode");
        new_sn = new SoundNode(sn.instrument);
        SoundNode.canvas_instances.push(new_sn);
        $(new_sn.html).appendTo($("#node-canvas")).addClass("on-canvas").data("SoundNode", new_sn).data("live", true).position({
          of: evt
        }).each(function() {
          return xy_compute(this);
        }).draggable({
          helper: "original",
          scope: "canvas",
          distance: 15,
          drag: function(evt, ui) {
            return xy_compute(this);
          },
          start: function(evt, ui) {},
          stop: function(evt, ui) {}
        }).droppable({
          accept: ".node-wrapper",
          greedy: true,
          tolerance: "pointer",
          drop: function(evt, ui) {
            var w;
            if (ui.draggable.hasClass("on-canvas")) {
              w = ui.draggable;
            } else {
              w = ui.draggable.clone();
            }
            return w.appendTo($(this).find(".wrappers")).position({
              of: $(this).find(".node-sample"),
              my: "bottom",
              at: "top"
            }).css("top", "0px").data("Wrapper", ui.draggable.data("Wrapper")).data({
              "live": true
            }).on("click", "*:not(input,select)", function() {
              if ($(this).parent().data("live")) {
                return $(this).parent().addClass("node-disabled").data("live", false);
              } else {
                return $(this).parent().removeClass("node-disabled").data("live", true);
              }
            });
          }
        }).find(".wrappers").sortable({
          stop: function(evt, ui) {}
        }).parent().find(".node-sample").on("click", function(e) {
          if ($(this).hasClass(".ui-draggable-dragging")) {
            return;
          }
          if ($(this).parent().data("live")) {
            return $(this).addClass("node-disabled").parent().data("live", false);
          } else {
            return $(this).removeClass("node-disabled").parent().data("live", true);
          }
        });
      }
      if (!glob.playing) {
        glob.playing = true;
        return startPlayback();
      }
    }
  });
  return $("#node-tray").droppable({
    scope: "canvas",
    drop: function(evt, ui) {
      var sn;
      sn = ui.draggable.find(".node-sample").data("SoundNode");
      return ui.draggable.remove();
    }
  });
};

ui_init = function() {
  var j, k, len, len1, n, ref, ref1, results, w;
  canvas_init();
  ref = SoundNode.tray_instances;
  for (j = 0, len = ref.length; j < len; j++) {
    n = ref[j];
    $(n.html).appendTo($("#sn-tray")).draggable({
      helper: "clone"
    }).data("SoundNode", n).on("click", function() {
      return $(this).data("SoundNode").instrument.tryout(context.currentTime);
    });
  }
  ref1 = [new IfConditional(), new ForLoop()];
  results = [];
  for (k = 0, len1 = ref1.length; k < len1; k++) {
    w = ref1[k];
    results.push($(w.html).appendTo($("#wrapper-tray")).draggable({
      helper: "clone"
    }).data("Wrapper", w));
  }
  return results;
};

xy_compute = function(t) {
  var canvas, gain, lpf, sn;
  canvas = $("#node-canvas");
  sn = $(t).find(".node-sample");
  gain = 1 - (sn.offset().top - canvas.offset().top) / canvas.height();
  lpf = Instrument.compute_filter(sn.offset().left / canvas.width());
  $(t).data().SoundNode.instrument.gain.gain.value = gain;
  return $(t).data().SoundNode.instrument.filter.frequency.value = lpf;
};

update_beat_labels = function() {
  var i, n, ref, results;
  ref = {
    "phrase": phrase,
    "beat": beat,
    "bar": bar
  };
  results = [];
  for (n in ref) {
    i = ref[n];
    results.push($("#" + n + "_label").text(i));
  }
  return results;
};
