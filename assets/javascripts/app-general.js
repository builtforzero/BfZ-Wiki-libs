(function() {
  var $, $body, terms,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  $body = $("body");

  terms = ["cat", "subcat", "datapoints", "tech"];

  $.fn.initDictionary = function(data) {
    return this.each(function() {
      var $div, allterms;
      $div = $(this);
      allterms = [];
      $.each(data, function(index, def) {
        var $link, $row, classes, slug, term;
        slug = $(window).toSlug(def.term);
        term = {
          label: def.term,
          value: slug
        };
        allterms.push(term);
        classes = 'term-wrapper ' + def.term.substr(0, 1) + ' ' + slug;
        $row = $("<article class=\"" + classes + "\" />").appendTo($div);
        $("<div class=\"term\"><span class=\"label\">Terms:</span> " + def.term + "</div>").appendTo($row);
        $("<div class=\"definition\"><span class=\"label\">Definition:</span> " + def.definition + "</div>").appendTo($row);
        $link = $("<div class=\"term-links\"></div>");
        if ($(window).isURL($row.link1)) {
          $("<a href='" + $row.link1 + "'>" + $row.link1 + "</a>").appendTo($link);
        }
        if ($(window).isURL($row.link2)) {
          return $("<a href='" + $row.link2 + "'>" + $row.link2 + "</a>").appendTo($link);
        }
      });
      $("#search-term").initSearchBox(allterms);
      return $("#az-filter").initLetterSelector();
    });
  };

  $.fn.initAMContent = function(data) {
    return this.each(function() {
      var $div, allcats, allslugs, allterms;
      $div = $(this);
      allterms = [];
      allslugs = [];
      allcats = [];
      $.each(data, function(index, proj) {
        var $row, $title, classes, i, j, keywords, len, len1, r, ref, ref1, s, slug;
        classes = 'project term-wrapper';
        keywords = '';
        ref = ["cat", "subcat", "datapoints", "tech"];
        for (i = 0, len = ref.length; i < len; i++) {
          r = ref[i];
          if (r === "cat") {
            allcats.push(proj[r]);
          }
          ref1 = proj[r].split(',');
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            s = ref1[j];
            if (s !== '') {
              slug = $(window).toSlug(s);
              classes += ' ' + slug;
              keywords += s + ', ';
              if (!(indexOf.call(allslugs, slug) >= 0)) {
                allslugs.push(slug);
                allterms.push({
                  label: s,
                  value: slug
                });
              }
            }
          }
        }
        keywords = String(keywords).substring(0, String(keywords).length - 2);
        $row = $("<article class=\"" + classes + "\" />").appendTo($div);
        if (!$(window).isURL(proj.link)) {
          proj.link = '#';
        }
        $title = $("<div class=\"project-title title\"></div>").appendTo($row);
        $("<a href='" + proj.link + "' target='_blank'>" + proj.title + "</a>").appendTo($title);
        $("<p class=\"project-description description\">" + proj.description + "</p>").appendTo($row);
        $("<small class=\"keywords\">Tags: " + String(keywords) + "</small>").appendTo($row);
        if ($(window).isURL(proj.img)) {
          $title.data('thumb', proj.img);
          return $title.on('mouseenter', function(e) {
            var $img, $imgURL, $preview, $thumb;
            $(this).unbind('mouseenter').unbind('mouseleave');
            $thumb = $(this).data('thumb');
            $preview = $("<div class=\"project-preview\"><div class=\"left-arrow\"></div></div>");
            $preview.appendTo($(this));
            if ($thumb.match('https://drive.google.com/')) {
              $imgURL = $thumb.replace('https://drive.google.com/open?id=', 'https://drive.google.com/file/d/');
              $imgURL = $imgURL.replace('&usp=drive_fs', '/preview');
              return $img = $('<iframe src="' + $imgURL + '" width="360" height="220" border="0" allow="autoplay"></iframe>').appendTo($preview);
            } else {
              return $img = $("<img class='preview-thumb' src='" + $thumb + "' />").appendTo($preview);
            }
          });
        }
      });
      allcats.sort();
      $.each(allcats.filter($(window).onlyUnique), function(x, val) {
        var $cat, slug;
        if (val !== '') {
          slug = $(window).toSlug(val);
          $cat = $("<section class=\"project-cat " + slug + "-wraper\" />").appendTo($div);
          $("<h3>" + val + "</h3>").appendTo($cat);
          return $('.project.term-wrapper.' + slug).appendTo($cat);
        }
      });
      $('.project', $div).each(function() {
        if (($div.outerHeight() - $(this).offset().top) < 250) {
          return $('.project-preview', $(this)).addClass('align-bottom');
        }
      });
      return $("#search-term").initSearchBox(allterms);
    });
  };

  $.fn.loadContent = function() {
    return this.each(function() {
      var $depId, $div, $target;
      $div = $(this);
      $depId = $div.data('key');
      $target = $div.data('init');
      return $.getJSON('https://script.google.com/macros/s/' + $depId + '/exec', function(data) {
        var fn;
        $div.html('');
        fn = jQuery('selector')[$target];
        if (jQuery.isFunction(fn)) {
          return $div[$target](data.date);
        }
      });
    });
  };

  $('.load-from-sheets').loadContent();

}).call(this);
