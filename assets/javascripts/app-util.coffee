# Interaction Flags
$ = jQuery;

$body = $("body")

#Helper to return unique values through a filter
$.fn.onlyUnique = (value, index, array) ->
  return array.indexOf(value) == index

#Helper to format dates
$.fn.formatDate = (dateStr) ->
  return (dateStr.getMonth() + 1) + '/' + dateStr.getDate() + '/' + dateStr.getFullYear()

#Helper to validate URLs
$.fn.isURL = (str) ->
  if str == '' || str == undefined
    return false

  urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);

#Helper for slugging
$.fn.toSlug = (str) ->
  slug = slugify(str, {lower : true})
  slug = slug.replace("(","")
  slug = slug.replace(")","")
  return slug


# show terms/defintions based on search result; hide all others  
$.fn.showTermsFromSearch = (matches) ->
  
  $('.term-wrapper').hide().parent().hide();
  $.each(matches, (index, term) -> 
    $('.term-wrapper.' + term.value).show().parent().show()
  );
  

# Initialize Search Box with term list
$.fn.initSearchBox = (terms) ->
  
  $search = $(@)
  $search.autocomplete({
    source: terms,
    response: ( event, ui ) ->
      $('#term-results').showTermsFromSearch(ui.content)

    select: ( event, ui ) ->
      $('#term-results').showTermsFromSearch([{value:$(window).toSlug(ui.item.label)}])
  });

  #clear button
  $('.tag-clear').on 'click', ->
    $search.autocomplete( "search", "" );
    $('.project-cat').show();
    $('.term-wrapper').show();
    $('#tags').val('')

  $("#az-filter").initLetterSelector()


# Initialize Letter Selector
$.fn.initLetterSelector = ->
  $div = $(@)
  az = Array.from('ABCDEFGHIJKLMNOPRSTUVWXYZ')
  $.each(az, (index, letter) ->
    l = $("<span>" + letter + "</span>").appendTo($div)
    l.addClass('az-filter').data('value' : letter)
  );

  $("<span class='az-filter selected' data-value='term-wrapper'>All</span>").appendTo($div)

  $('.az-filter').on 'click', ->
    $('.az-filter').removeClass('selected')
    $('.term-results-container').showTermsFromSearch([{'value' : $(@).data('value')}])
    $(@).addClass('selected')



  