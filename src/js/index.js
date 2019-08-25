import $ from 'jquery';

global.jQuery = $;
global.$ = $;

$(document).ready(function() {
  // burger
  $('.aside-nav__toggle').on('click', function(evt) {
    evt.preventDefault();
    $('.aside').toggleClass('aside--opened');
  });

  // работа с формой
  var cardNumber = $('.card-block__input--card-number');
  var cardCode = $('#card_code');
  var cardHolder = $('#card_holder');
  const cardHolderMinLenght = 4;
  const cardCodeLenght = 3;
  const cardNumberLenght = 4;

  function checkEnteredData (pattern, evt) {
    var val = String.fromCharCode(evt.which);
    var test = pattern.test(val);
    return test;
  };

  // автофокус и ограничивание число водимых символов в поля номера карты
  cardNumber.on('keydown', function(e) {
    var pattern = /^[0-9]+$/;
    // проверяем паттерн так как в number можно вводить е и знаки +-
    if(!checkEnteredData (pattern, e)) return false;
  });
  cardNumber.on('keyup change', function(e) {
    // автофокус
    if ($(this).val().length > 3) {
			$(this).parent().next().children('.card-block__input--card-number').focus();
    };
    if ($(this).val().length < 1 && $(this).parent().index() != 0) {
			$(this).parent().prev().children('.card-block__input--card-number').focus();
    };
     if ($(this).val().length > 3 && $(this).parent().index() == 3) {
			cardHolder.focus();
		};
  });
  // проверяем паттерн
  cardCode.on('keypress change', function(e) {
    var pattern = /^[0-9]+$/;
    // проверяем паттерн так как в number можно вводить е и знаки +-
    if(!checkEnteredData (pattern, e)) return false;
    // ограничивание число водимых символов в поле
  });
   // только латинские буквы в поле кард-холдер
  cardHolder.on('keypress', function(e)  {
    var pattern = /^[a-zA-Z]+$/;
    if(!checkEnteredData (pattern, e)) return false;
   });
   //валидация
   $('#payment_form').on('submit', function(event) {
    event.preventDefault();
    if ( !validateForm() ) {
      event.preventDefault();
    }
  });
  //функция валидации полей
function validateField (field, isFormValidity, fieldLength) {
  if(field.val().length < fieldLength) {
    isFormValidity = false;
    field.addClass('input--error');
  }
  else {
    field.removeClass('input--error');
  }
  return isFormValidity;
};
//функция валидации формы
function validateForm () {
  var isFormValidity = true;
  isFormValidity = validateField (cardHolder, isFormValidity, cardHolderMinLenght);
  cardNumber.each(function() {
    isFormValidity = validateField ($(this), isFormValidity, cardNumberLenght);
  });
  isFormValidity = validateField(cardCode, isFormValidity, cardCodeLenght);
  $('.input--error').first().focus();


  return isFormValidity;
};
});
