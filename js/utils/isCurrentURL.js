var base = document.querySelector('base').href;

var hashless = url => url.split('#')[ 0 ];
var resolve = url => new URL( url, base ).href;
module.exports = url => hashless( resolve( url ) ) === hashless( window.location.href );
