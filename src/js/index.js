import $ from 'jquery';

global.jQuery = $;
global.$ = $;

$(document).ready(function() {
  $('.aside-nav__toggle').on('click', function(evt) {
    evt.preventDefault();
    $('.aside').toggleClass('aside--opened');
  })
});
