(function() {
  var $body, $vidStage;

  $body = $("body");

  $vidStage = 'none';

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
        var vid;
        $('.tutorial').show();
        vid = document.getElementById("tutorial-video");
        vid.muted = false;
        if (window.$vidStage === 'playing') {
          window.$vidStage = 'paused';
          vid.pause();
          $('.show-tutorial').text('Play Video');
        } else {
          window.$vidStage = 'playing';
          $('.show-tutorial').text('Pause Video');
          vid.play();
        }
        return vid.addEventListener("ended", function() {
          window.$vidStage = 'none';
          vid.muted = true;
          vid.pause();
          $('.tutorial').hide();
          $('.show-tutorial').text('Play Video');
          $('.show-tutorial').removeAttr('disabled');
          return console.log('end');
        });
      });
    });
  };

  $('.dashboard-wrapper.tutorial-video').initVideo();

}).call(this);
