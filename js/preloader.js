var $ = require('jquery');
require('./vendor/visible');
var FontFaceObserver = require('fontfaceobserver');

var wait = delay => new Promise( resolve => setTimeout( resolve, delay ) );

var $preloader = $('.preloader');
var $progress = $('.preloader__progress');
var $logo = $('.logo');

var loadImage = $el => new Promise( resolve => {
    /* global Image */
    var img = new Image();
    img.onload = resolve;
    img.src = $el.attr( 'src' );
})

var visibleImages = [];
var invisibleImages = [];

$('img').each( ( i, el ) => {
    var $el = $( el );
    ( $el.visible( true ) ? visibleImages : invisibleImages ).push( $el );
})

var fonts = [
    new FontFaceObserver('mabry-light-pro'),
    new FontFaceObserver('orpheus-pro'),
    new FontFaceObserver('orpheus-pro', { style: 'italic' } )
];

var tasks = visibleImages.length + fonts.length;
var complete = 0;
var onComplete = () => {
    complete++;
    $progress.css('transform', `scale( ${ complete / tasks }, 1 )`)
}

var load = () => Promise.all([
    Promise.all( fonts.map( f => f.load().then( onComplete ) ) ).then( () => {
        $( window ).trigger( 'fontsLoaded' );
    }),
    ...visibleImages.map( img => loadImage( img ).then( onComplete ) )
].map( p => p.then( onComplete ).catch( onComplete ) ) )

var dismiss = () => {
    $( window ).trigger( 'loaded' );
    $preloader.addClass('preloader--done');
    $logo.one('animationiteration webkitAnimationIteration', () => {
        $logo.removeClass('logo--animating');
    })
}

wait( 500 )
    .then( load )
    .then( () => wait( 500 ) )
    .then( dismiss )

invisibleImages.forEach( loadImage )