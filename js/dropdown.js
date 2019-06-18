var nav = document.querySelector('.nav');
var dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach( dropdown => {
    // var title = dropdown.querySelector('.dropdown__title');
    var items = dropdown.querySelector('.dropdown__items');
    if ( !items ) return;
    dropdown.addEventListener('mouseenter', () => {
        nav.style.height = dropdown.offsetHeight + items.offsetHeight + 'px';
        dropdown.classList.add('dropdown--open');
    })
    dropdown.addEventListener('mouseleave', () => {
        nav.style.height = '';
        dropdown.classList.remove('dropdown--open');
    })
})

// var $ = require('jquery');

// var $nav = $('.nav');
// var $dropdowns = $('.dropdown');
// var measureNav = () => {
//     $dropdowns.each( ( i, el ) => $( el ).css('height', 0 ) );
//     return $nav.height();
// }

// $('.dropdown').each( ( i, el ) => {
//     // var $title = $( '.dropdown__title', el );
//     var $items = $( '.dropdown__items', el );
//     var height;
//     var measure = () => {
//         $items.css( 'height', 'auto' );
//     }
    
//     // $items.slideUp( 0 )
//     // $items.slideDown( 0 )
//     // $( el ).hover( () => $items.slideDown(), () => $items.slideUp() );
// })