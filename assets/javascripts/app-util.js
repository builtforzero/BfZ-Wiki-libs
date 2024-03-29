(function() {
  var $, $body;

  $ = jQuery;

  $body = $("body");

  $.fn.onlyUnique = function(value, index, array) {
    return array.indexOf(value) === index;
  };

  $.fn.formatDate = function(dateStr) {
    return (dateStr.getMonth() + 1) + '/' + dateStr.getDate() + '/' + dateStr.getFullYear();
  };

  $.fn.isURL = function(str) {
    var url, urlRegex;
    if (str === '' || str === void 0) {
      return false;
    }
    urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    url = new RegExp(urlRegex, 'i');
    return str.length < 2083 && url.test(str);
  };

  $.fn.toSlug = function(str) {
    var slug;
    slug = slugify(str, {
      lower: true
    });
    slug = slug.replace("(", "");
    slug = slug.replace(")", "");
    return slug;
  };

  $.fn.showTermsFromSearch = function(matches) {
    $('.term-wrapper').hide().parent().hide();
    return $.each(matches, function(index, term) {
      return $('.term-wrapper.' + term.value).show().parent().show();
    });
  };

  $.fn.initSearchBox = function(terms) {
    var $search;
    $search = $(this);
    $search.autocomplete({
      source: terms,
      response: function(event, ui) {
        $('#term-results').showTermsFromSearch(ui.content);
        return $('.no-result').hide();
      },
      select: function(event, ui) {
        $('#term-results').showTermsFromSearch([
          {
            value: $(window).toSlug(ui.item.label)
          }
        ]);
        return $('.no-result').hide();
      }
    });
    $('#search-term').on('blur', function() {
      if ($(this).val() === '') {
        $('.project-cat').show();
        $('.term-wrapper').show();
        return $('.no-result').hide();
      } else {
        if ($('.term-wrapper:visible').length === 0) {
          return $('.no-result').show();
        } else {
          return $('.no-result').hide();
        }
      }
    });
    $('.tag-clear').on('click', function() {
      $search.autocomplete("search", "");
      $('.project-cat').show();
      $('.term-wrapper').show();
      $('.no-result').hide();
      return $('#search-term').val('');
    });
    return $("#az-filter").initLetterSelector();
  };

  $.fn.initLetterSelector = function() {
    var $div, az;
    $div = $(this);
    az = Array.from('ABCDEFGHIJKLMNOPRSTUVWXYZ');
    $.each(az, function(index, letter) {
      var l;
      l = $("<span>" + letter + "</span>").appendTo($div);
      return l.addClass('az-filter').data({
        'value': letter
      });
    });
    $("<span class='az-filter selected' data-value='term-wrapper'>All</span>").appendTo($div);
    return $('.az-filter').on('click', function() {
      $('.az-filter').removeClass('selected');
      $('.term-results-container').showTermsFromSearch([
        {
          'value': $(this).data('value')
        }
      ]);
      return $(this).addClass('selected');
    });
  };

  $.fn.loadContent = function(div) {
    if (div == null) {
      div = null;
    }
    return this.each(function() {
      var $content, $depId, $div, $target;
      $div = $(this);
      $content = $div;
      if (div !== null) {
        $content = div;
      }
      $depId = $div.data('key');
      $target = $div.data('init');
      $content.html('<span class="loading">Loading content&hellip;</span>');
      return $.getJSON('https://script.google.com/macros/s/' + $depId + '/exec', function(data) {
        var fn;
        $content.html('');
        fn = jQuery('selector')[$target];
        if (jQuery.isFunction(fn)) {
          return $content[$target](data.date);
        } else {
          return $content.html('<div class="no-result">Sorry! I encountered an error</div>');
        }
      }).fail(function() {
        return $content.html('<div class="no-result">Sorry! I encountered an error</div>');
      });
    });
  };

}).call(this);
