var $ = require('jquery');
var breakpoints = require('./breakpoints');

var $window = $( window );
var $html = $( 'html' );
var $left = $( '.sidebar--left' );
var $right = $( '.sidebar--right' );
var $main = $( '.main' );
var $nav = $( '.nav' );
var $blur = $('.blur');
var $navTrigger = $( '.nav-trigger' );
var isOpen = $el => $el.hasClass( 'sidebar--open' );
var doBlur = () => {
    var blurry = isOpen( $left ) || isOpen( $right );
    $main.toggleClass( 'main--blurry', blurry );
    $nav.toggleClass( 'nav--blurry', blurry );
    $navTrigger.toggleClass( 'nav-trigger--disabled', blurry );
    $html.css('overflow', blurry ? 'hidden' : '' );
    $blur.toggleClass( 'blur--on', blurry );
}

var openLeft = () => {
    $left.addClass( 'sidebar--open' );
    if ( $window.data( 'breakpoint' ) === 'small' ) $right.removeClass( 'sidebar--open' );
    doBlur();
}

var closeLeft = () => {
    $left.removeClass( 'sidebar--open' );
    doBlur();
}

var openRight = () => {
    $right.addClass( 'sidebar--open' );
    if ( $window.data( 'breakpoint' ) === 'small' ) $left.removeClass( 'sidebar--open' );
    doBlur();
}

var closeRight = () => {
    $right.removeClass( 'sidebar--open' );
    doBlur();
}

$main.on('click', () => {
    closeLeft();
    closeRight();
})

var stopPropagation = fn => e => {
    e.stopPropagation();
    fn( e );
}

$( '[data-open-left-sidebar]' ).on('click', stopPropagation( openLeft ) )
$( '[data-close-left-sidebar]' ).on('click', stopPropagation( closeLeft ) )
$( '[data-open-right-sidebar]' ).on('click', stopPropagation( openRight ) )
$( '[data-close-right-sidebar]' ).on('click', stopPropagation( closeRight ) )

breakpoints({ medium: { on: closeLeft } })

module.exports = { openLeft, openRight, closeLeft, closeRight }