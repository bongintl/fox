var $ = require('jquery');

$('.currency-select').each( ( i, select ) => {
    var $select = $( select );
    var $title = $select.find('.currency-select__title');
    var $list = $select.find('.currency-select__items');
    var $items = $select.find('.currency-select__item');
    $list.slideUp( 0 );
    $title.click( e => {
        e.stopPropagation();
        $list.slideToggle( 200 )
    });
    $items.click( () => $list.slideUp( 200 ) );
    $('body').click( () => $list.slideUp( 200 ) );
});