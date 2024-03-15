(function() {
  var $body, addEventInCorrectOrder, enableRelevantFilterOptions, end_date, formatCalEvent, resetFilterOptions, showAllEventDates, substituteDate, updateCalEventTopPosition, updateDateFields, view;

  $body = $("body");

  window.startDate = new Date().getTime();

  window.first_date = new Date();

  window.newYear = parseInt(new Date().getFullYear()) + 1;

  end_date = new Date();

  end_date.setDate(end_date.getDate(end_date.setMonth(end_date.getMonth() + 1)) - 1);

  window.endDate = new Date(end_date).getTime();

  window.last_date = end_date;

  window.selected = '.event-listing';

  window.filterSelection = 'all-';

  addEventInCorrectOrder = function(evt) {
    var spliced;
    spliced = false;
    $.each(window.CS_events_sorted, function(index, CS_event) {
      if ((evt.start_datetime < CS_event.start_datetime) && (spliced === false)) {
        window.CS_events_sorted.splice(index, 0, evt);
        spliced = true;
        return true;
      }
    });
    if (spliced === false) {
      return window.CS_events_sorted.push(evt);
    }
  };

  substituteDate = function(date, dir) {
    var newDate, start_date;
    start_date = new Date(Date.parse(date));
    newDate = start_date;
    if (isNaN(start_date)) {
      if (dir === 'end') {
        newDate.setDate(newDate.getDate() + 30);
      }
      return newDate;
    } else {
      return new Date(Date.parse(date));
    }
  };

  window.CS_events_sorted = [];

  $.fn.initEvents = function(data) {
    window.CS_events = data;
    return this.each(function() {
      var $CS_filters, $classes;
      window.event_list = $(this);
      $('#date-start').val($(window).formatDate(window.first_date));
      window.first_date.setDate(1);
      window.start_date = window.first_date;
      $CS_filters = [];
      $classes = ' event-listing';
      $('.filter').each(function() {
        $CS_filters[$(this).attr('name')] = [];
        return $classes += ' all-' + $(this).attr('name') + 's';
      });
      $CS_filters['impact'] = ['All Communities', 'Most Communities', 'Some Communities', 'Few Communities'];
      $.each(window.CS_events, function(index, CS_event) {
        var i, len, link, ref;
        CS_event.start_date = substituteDate(CS_event.start, 'start');
        CS_event.start_date.setHours(8);
        CS_event.start_datetime = CS_event.start_date.getTime();
        CS_event.start_label = isNaN(new Date(Date.parse(CS_event.start))) ? CS_event.start : $(window).formatDate(CS_event.start_date);
        CS_event.end_date = substituteDate(CS_event.end, 'end');
        CS_event.end_date.setHours(18);
        CS_event.end_datetime = CS_event.end_date.getTime();
        CS_event.end_label = isNaN(new Date(Date.parse(CS_event.end))) ? CS_event.end : $(window).formatDate(CS_event.end_date);
        CS_event.classes = $classes;
        if (CS_event.end_label === CS_event.start_label) {
          CS_event.end_label = '';
        } else if (CS_event.start_label.substr(CS_event.start_label.length - 4) === CS_event.end_label.substr(CS_event.end_label.length - 4)) {
          CS_event.start_label = CS_event.start_label.substr(0, CS_event.start_label.length - 5);
          if (CS_event.tbd === 'Yes') {
            CS_event.end_label += '*';
          }
        }
        if (CS_event.tbd === 'Yes') {
          CS_event.classes += " tbd ";
        }
        if (window.first_date.getTime() > CS_event.start_date.getTime()) {
          window.first_date = CS_event.start_date;
        }
        if (window.last_date.getTime() < CS_event.end_datetime) {
          window.last_date = CS_event.end_date;
        }
        $('.filter').not('.topic').each(function() {
          return CS_event.classes += " " + slugify(CS_event[$(this).attr('name')], {
            lower: true
          });
        });
        CS_event.classes += " " + slugify(CS_event.intext, {
          lower: true
        });
        $('#filter-topic').each(function() {
          var $term, $terms, i, len, results;
          $terms = CS_event[$(this).attr('name')].split(',');
          results = [];
          for (i = 0, len = $terms.length; i < len; i++) {
            $term = $terms[i];
            results.push(CS_event.classes += " " + slugify($term.trim(), {
              lower: true
            }));
          }
          return results;
        });
        ref = CS_event.links.split('');
        for (i = 0, len = ref.length; i < len; i++) {
          link = ref[i];
          if ($(window).isURL(link)) {
            CS_event.links.replace(link, "<a href='" + link + "'>link</a>");
          }
        }
        return addEventInCorrectOrder(CS_event);
      });
      window.first_date.setDate(1);
      $.each(window.CS_events_sorted, function(index, CS_event) {
        var $dateDiv, $details, $link, $row, i, len, link, ref;
        $row = $("<article data-start=\"" + CS_event.start_datetime + "\" data-end=\"" + CS_event.end_datetime + "\" class=\"" + CS_event.classes + "\" />").appendTo(window.event_list);
        $row.data();
        $dateDiv = $("<div class=\"event-listing-date\"></div>").appendTo($row);
        $("<time class=\"event-start\" datetime=\"" + CS_event.start + "\">" + CS_event.start_label + "</time>").appendTo($dateDiv);
        if (CS_event.end_label !== '' && CS_event.end_label !== '*') {
          $("<span>&ndash;</span><time class=\"event-end\" datetime=\"" + CS_event.end + "\">" + CS_event.end_label + "</time>").appendTo($dateDiv);
        }
        $details = $("<div class=\"event-listing-details\" />").appendTo($row);
        $("<h3 class=\"event-listing-title\">" + CS_event.name + "</h3>").appendTo($details);
        $("<div class=\"clear event-listing-copy left event-type\"><span class=\"label\">Type:</span> " + CS_event.type + "</div>").appendTo($details);
        $("<div class=\"event-listing-copy right event-team\"><span class=\"label\">Team:</span> " + CS_event.team + "</div>").appendTo($details);
        $("<div class=\"event-listing-copy left event-location\"><span class=\"label\">Where:</span> " + CS_event.location + "</div>").appendTo($details);
        $("<div class=\"event-listing-copy right event-num_attendees\"><span class=\"label\"># BFZ Attendees:</span> " + CS_event.num_attendees + "</div>").appendTo($details);
        $("<div class=\"event-listing-copy left event-poc\"><span class=\"label\">Organizer:</span> " + CS_event.org + "</div>").appendTo($details);
        $("<div class=\"event-listing-copy right event-attendees\"><span class=\"label\">Attendees:</span> " + CS_event.attendees + "</div>").appendTo($details);
        $("<div class=\"event-listing-copy left event-poc\"><span class=\"label\">POC:</span> " + CS_event.poc + "</div>").appendTo($details);
        $("<div class=\"event-listing-copy right event-se-si\"><span class=\"label\">Requested SE/SI Attendance:</span> " + CS_event.se_si + "</div>").appendTo($details);
        if (CS_event.notes !== '') {
          $("<div class=\"event-listing-copy clear event-notes\"><span class=\"label\">Notes:</span> " + CS_event.notes + "</div>").appendTo($details);
        }
        if (CS_event.links !== '') {
          $link = $("<div class=\"event-listing-copy clear event-links\"></div>").appendTo($details);
          $("<span class=\"label\">Links:</span>").appendTo($link);
          ref = CS_event.links.split(',');
          for (i = 0, len = ref.length; i < len; i++) {
            link = ref[i];
            if ($(window).isURL(link)) {
              $("<a href='" + link + "'>" + link + "</a>").appendTo($link);
            }
          }
        }
        $("<div clear=\"both\" class=\"clear\" />").appendTo($row);
        return $('.filter').each(function() {
          var $term, $terms, j, len1, results;
          if ($(this).attr('name') === 'topic') {
            $terms = CS_event[$(this).attr('name')].split(',');
            results = [];
            for (j = 0, len1 = $terms.length; j < len1; j++) {
              $term = $terms[j];
              $CS_filters[$(this).attr('name')].push(String($term).trim());
              results.push($row.data($(this).attr('name'), CS_event[$(this).attr('name')]));
            }
            return results;
          } else {
            $CS_filters[$(this).attr('name')].push(String(CS_event[$(this).attr('name')]).trim());
            return $row.data($(this).attr('name'), slugify(CS_event[$(this).attr('name')], {
              lower: true
            }));
          }
        });
      });
      $('.loading').remove();
      window.end_date = window.last_date;
      $('#date-end').val($(window).formatDate(window.last_date));
      $('#event-cal-view').initCalView();
      $('.filter').each(function() {
        return $('#filter-' + $(this).attr('name')).initFilters($CS_filters[$(this).attr('name')]);
      });
      $('.datepicker').initDatePick();
      $('.filter').not('#filter-topic').select2();
      $('#filter-topic').select2({
        multiple: false
      });
      $('#date-end').trigger('change');
      $("#filter-date-all").on("click", function(e) {
        return showAllEventDates();
      });
      return $("#show-tbd input").on("change", function(e) {
        if ($(this).is(':checked')) {
          return $('.filter').filterEvents('.tbd');
        } else {
          return $('.tbd').hide();
        }
      });
    });
  };

  formatCalEvent = function(date, CS_event, day) {
    var $classes, $day, $event_name, $evt_date, $month, desc, i, len, link, ref;
    desc = "<div class='dt'><label>Location:</label><span>" + CS_event.location + "</span></div>";
    if (CS_event.poc !== '') {
      if (CS_event.email !== '') {
        desc += "<div class='dt'><label>POC:</label><span><a href='mailto:" + CS_event.email + "'>" + CS_event.poc + "</a></span></div>";
      } else {
        desc += "<div class='dt'><label>POC:</label><span>" + CS_event.poc + "</span></div>";
      }
    }
    if (CS_event.type !== '' && CS_event.type !== void 0) {
      desc += "<div class='dt'><label>Type:</label><span>" + CS_event.type + "</span></div>";
    }
    if (CS_event.topic !== '' && CS_event.topic !== void 0) {
      desc += "<div class='dt'><label>Topic:</label><span>" + CS_event.topic + "</span></div>";
    }
    if (CS_event.impact !== '' && CS_event.impact !== void 0) {
      desc += "<div class='dt'><label>Impact:</label><span>" + CS_event.impact + "</span></div>";
    }
    if (CS_event.org !== '' && CS_event.org !== void 0) {
      desc += "<div class='dt'><label>Organization:</label><span>" + CS_event.org + "</span></div>";
    }
    if (CS_event.team !== '' && CS_event.team !== void 0) {
      desc += "<div class='dt'><label>Department/Team:</label><span>" + CS_event.team + "</span></div>";
    }
    if (CS_event.num_attendees !== '' && CS_event.num_attendees !== void 0) {
      desc += "<div class='dt'><label>Number of BFZ Attendees:</label><span>" + CS_event.num_attendees + "</span></div>";
    }
    if (CS_event.attendees !== '' && CS_event.attendees !== void 0) {
      desc += "<div class='dt'><label>Attendees:</label><span>" + CS_event.attendees + "</span></div>";
    }
    if (CS_event.se_si !== '' && CS_event.se_si !== void 0) {
      desc += "<div class='dt'><label>Requested SE/SI Attendance:</label><span>" + CS_event.se_si + "</span></div>";
    }
    if (CS_event.notes !== '') {
      desc += "<div class='dt notes'><label>Notes:</label><span>" + CS_event.notes + "</span></div>";
    }
    if (CS_event.links !== '') {
      desc += "<div class='dt'><label>Links:</label><span>";
      ref = CS_event.links.split(',');
      for (i = 0, len = ref.length; i < len; i++) {
        link = ref[i];
        if ($(window).isURL(link)) {
          desc += "<a href='" + link + "'>link</a>";
        }
      }
      desc += "</span></div>";
    }
    $event_name = CS_event.name;
    $month = date.getMonth() + 1;
    if ($month < 10) {
      $month = "0" + $month;
    }
    $day = date.getDate();
    if ($day < 10) {
      $day = "0" + date.getDate();
    }
    $evt_date = new Date(date.getFullYear() + "-" + $month + "-" + $day + 'T10:00:00');
    $classes = CS_event.classes + ' day' + day + ' ' + slugify(CS_event.name, {
      lower: true
    });
    if (day !== 1) {
      $classes += ' dayofweek' + $evt_date.getDay();
    }
    if (CS_event.start_label !== CS_event.end_label) {
      $classes += ' multiday';
    }
    return {
      date: $evt_date,
      startdate: CS_event.start_label,
      enddate: CS_event.end_label,
      eventName: $event_name,
      description: desc,
      className: $classes,
      dateColor: "#a50a51",
      onclick: function(e, CS_event) {
        var $details, range;
        if (CS_event.startdate !== CS_event.enddate) {
          range = new String(CS_event.startdate + "–" + CS_event.enddate);
        } else {
          range = new String(CS_event.startdate);
        }
        $('.gc-calendar .gc-event').removeClass('selected');
        $('.event-detail').remove();
        $details = $("<div class='event-detail'><div class='close'/></div>").appendTo($('#event-cal-view'));
        $("<div class='event-name'>" + CS_event.eventName + "</div>").appendTo($details);
        $("<div class='event-date'>" + range + "</div>").appendTo($details);
        $("<div class='event-description'>" + CS_event.description + "</div>").appendTo($details);
        $('.close').on("click", function(e) {
          $('.event-detail').remove();
          return $('.gc-calendar .gc-event').removeClass('selected');
        });
        return $('.gc-calendar .gc-event.' + slugify(CS_event.eventName, {
          lower: true
        })).addClass('selected');
      }
    };
  };

  $.fn.initCalView = function() {
    return this.each(function() {
      var $start_date, calendar, events;
      calendar = $(this).calendarGC({
        dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        onNextMonth: function(date) {
          return updateDateFields(date);
        },
        onPrevMonth: function(date) {
          return updateDateFields(date);
        }
      });
      $start_date = new Date();
      $start_date.setMonth($start_date.getMonth() - 1);
      calendar.setDate($start_date);
      events = [];
      $.each(window.CS_events_sorted, function(index, CS_event) {
        var currentDate, day, results;
        if (CS_event.tbd === 'No') {
          currentDate = CS_event.start_date;
          currentDate.setHours(8);
          day = 1;
          results = [];
          while (currentDate.getTime() <= CS_event.end_date.getTime()) {
            events.push(formatCalEvent(currentDate, CS_event, day));
            currentDate.setDate(currentDate.getDate() + 1);
            currentDate.setHours(8);
            results.push(day++);
          }
          return results;
        }
      });
      return calendar.setEvents(events);
    });
  };

  updateCalEventTopPosition = function() {
    return $('.gc-calendar .gc-event.day1').each(function() {
      var $classes, $index, $title, $top;
      $title = slugify($(this).text(), {
        lower: true
      });
      $classes = $(this).attr('class').replace('day1', '');
      $top = $(this).position().top;
      $index = $(".gc-event", $(this).parent()).index($(this));
      return $('.gc-calendar ' + '.gc-event.' + $title).not('.day1').each(function() {
        var $newtop;
        $newtop = $(this).position().top !== 0 ? $top - $(this).position().top : 0;
        if ($index > 1) {
          $newtop += ($index - 1) * 10;
        }
        return $(this).css({
          'margin-top': $newtop,
          'height': $(this).height
        });
      });
    });
  };

  updateDateFields = function(date) {
    if (date == null) {
      date = null;
    }
    if (date === null) {
      date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() + 1);
    }
    window.startDate = new Date(date).getTime();
    end_date = new Date(date);
    end_date.setDate(end_date.getDate(end_date.setMonth(end_date.getMonth() + 1)) - 1);
    window.endDate = new Date(end_date).getTime();
    $('#date-start').val($(window).formatDate(new Date(date)));
    $('#date-end').val($(window).formatDate(new Date(end_date)));
    $('#date-start').trigger("change");
    resetFilterOptions();
    return window.setTimeout(updateCalEventTopPosition, 200);
  };

  showAllEventDates = function() {
    window.first_date = new Date();
    window.first_date.setDate(1);
    $('#date-start').val($(window).formatDate(new Date(window.first_date)));
    $('#date-end').val($(window).formatDate(new Date(window.last_date)));
    window.startDate = window.first_date;
    window.endDate = window.last_dat;
    $('.filter').filterEvents($('#date-start'));
    return resetFilterOptions();
  };

  $.fn.initFilters = function(values_arr) {
    if (values_arr.length > 0) {
      values_arr.sort();
    }
    return this.each(function() {
      var filter;
      filter = $(this);
      if (values_arr.length > 0) {
        $.each(values_arr.filter($(window).onlyUnique), function(x, val) {
          if (val !== '') {
            return filter.append("<option class=\"option-" + slugify(val, {
              lower: true
            }) + "\" value=\"" + slugify(val, {
              lower: true
            }) + "\">" + val + "</option>");
          }
        });
      }
      return filter.on('change', function(e) {
        $('.event-listing').hide().removeClass('show');
        return $('.filter').filterEvents($(this));
      });
    });
  };

  $.fn.initDatePick = function() {
    $(this).datepicker().on('change', function(e) {
      var value;
      value = new Date(Date.parse($(this).val())).getTime();
      if ($(this).attr('name') === 'date-start') {
        window.startDate = value;
      } else {
        window.endDate = value;
      }
      return $('.filter').filterEvents($(this));
    });
    $("#filter-date-next-month").on('click', function(e) {
      return $('.gc-calendar .gc-calendar-header button.next').trigger('click');
    });
    return $("#filter-date-prev-month").on('click', function(e) {
      return $('.gc-calendar .gc-calendar-header button.prev').trigger('click');
    });
  };

  $.fn.filterEvents = function($current) {
    window.selected = '.event-listing';
    this.each(function() {
      window.filterSelection = $('option:selected', $(this)).val();
      if ($(this).attr('id') === 'filter-topicZZ') {
        return window.selected += '.' + String($(this).val()).replace(',', '.');
      } else {
        return window.selected += '.' + window.filterSelection;
      }
    });
    if (($current !== '.tbd') && ($current !== '.nottbd')) {
      $('option', $('.filter').not($current)).attr({
        'disabled': 'disabled'
      });
    } else if ($current === '.tbd') {
      window.selected += '.tbd';
    }
    return $(window.selected, $('#event-cal-view')).calFilterEvents();
  };

  $.fn.calFilterEvents = function() {
    $('.gc-event').hide().removeClass('show');
    this.each(function() {
      return $(this).show().addClass('show');
    });
    return $(window.selected, window.event_list).filterEventByDate();
  };

  $.fn.filterEventByDate = function() {
    return this.each(function() {
      var $end_date, $event;
      $event = $(this);
      $end_date = new Date(window.endDate);
      $end_date.setDate($end_date.getDate() + 1);
      if ($event.data('start') >= window.startDate && $event.data('end') < $end_date) {
        $event.show().addClass('show');
      } else if ($event.data('start') >= window.startDate && $event.data('start') < $end_date) {
        $event.show().addClass('show');
      } else {
        $event.hide().removeClass('show');
      }
      return $('.filter').each(function() {
        return enableRelevantFilterOptions($event, $(this));
      });
    });
  };

  resetFilterOptions = function() {
    var $all;
    $all = '';
    $('.filter').each(function() {
      $all = 'all-' + $(this).attr('name') + 's';
      return $(this).val($all);
    });
    return $('#date-end').change();
  };

  enableRelevantFilterOptions = function($event, $selector) {
    var $all, $end_date, $term, $terms, $type, i, len, results;
    $all = 'all-' + $selector.attr('name') + 's';
    $end_date = new Date(window.endDate);
    $end_date.setDate($end_date.getDate() + 1);
    if ($selector.attr('name') === 'topic') {
      $terms = String($event.data($selector.attr('name'))).split(", ");
      results = [];
      for (i = 0, len = $terms.length; i < len; i++) {
        $term = $terms[i];
        $type = slugify($term, {
          lower: true
        });
        results.push($('option', $selector).each(function() {
          if (($(this).val() === $type && $event.data('start') >= window.startDate && $event.data('end') <= $end_date) || $(this).val() === $all) {
            return $(this).attr({
              'disabled': null
            });
          } else if (($(this).val() === $type && $event.data('start') >= window.startDate && $event.data('start') <= $end_date) || $(this).val() === $all) {
            return $(this).attr({
              'disabled': null
            });
          }
        }));
      }
      return results;
    } else {
      $type = $event.data($selector.attr('name'));
      return $('option', $selector).each(function() {
        if (($(this).val() === $type && $event.data('start') >= window.startDate && $event.data('end') <= $end_date) || $(this).val() === $all) {
          return $(this).attr({
            'disabled': null
          });
        } else if (($(this).val() === $type && $event.data('start') >= window.startDate && $event.data('start') <= $end_date) || $(this).val() === $all) {
          return $(this).attr({
            'disabled': null
          });
        }
      });
    }
  };

  view = 'list';

  $('#view-toggle').on('click', function(e) {
    if (view === 'cal') {
      $('.list', $(this)).show();
      $('.cal', $(this)).hide();
      $(this).addClass('calendar');
      $(window.event_list).show();
      $('.event-cal-view').hide();
      view = 'list';
      return showAllEventDates();
    } else {
      $('.list', $(this)).hide();
      $('.cal', $(this)).show();
      $(window.event_list).hide();
      $('.event-cal-view').show();
      $(this).removeClass('calendar');
      return view = 'cal';
    }
  });

  $('.load-from-sheets').loadContent($('#event-list-view'));

}).call(this);
