(function() {
  var $body;

  $body = $("body");

  $.fn.initRaceContent = function(data) {
    return this.each(function() {
      var $div, $table;
      $div = $(this);
      $table = $("<table />").appendTo($div);
      $("<thead><tr><th>CoC</th><th>Name</th><th>Geographic Taxonomy</th>th>Quadrant</th><th>Share of BfZ Cmty Population</th><th>Share of Homelessness</th><th>Over-representation</th><th>Point Difference</th></tr></thead>").appendTo($table);
      return $.each(data, function(index, cmty) {
        var $row, classes, slug;
        slug = $(window).toSlug(cmty['BFZ Community Name']);
        classes = 'term-wrapper ' + slug;
        $row = $("<tr class=\"" + classes + "\" />").appendTo($table);
        $("<td> " + cmty['CoC Number'] + "</td>").appendTo($row);
        $("<td> " + cmty['BFZ Community Name'] + "</td>").appendTo($row);
        $("<td> " + "</td>").appendTo($row);
        $("<td> " + cmty['%Diff BfZPop - Asian'] + "</td>").appendTo($row);
        $("<td> " + cmty['%Diff Hmls - Asian'] + "</td>").appendTo($row);
        $("<td> " + "</td>").appendTo($row);
        $("<td> " + "</td>").appendTo($row);
        return console.log(cmty);
      });
    });
  };

  $('.load-from-sheets').loadContent();

  $.fn.initVideo = function() {
    return this.each(function() {
      $('.tutorial').hide();
      return $('.show-tutorial').on('click', function() {
        $('.show-tutorial').attr('disabled', 'disabled');
        $('.tutorial').show();
        document.getElementById("tutorial-video").play();
        return setTimeout(function() {
          $('.tutorial').hide();
          return $('.show-tutorial').removeAttr('disabled');
        }, 25000);
      });
    });
  };

  $('.dashboard-wrapper.tutorial-video').initVideo();

}).call(this);
