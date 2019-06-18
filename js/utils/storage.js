var Cookies = require('js-cookie');

var throws = fn => {
    try {
        fn();
        return false;
    } catch ( e ) {
        return true;
    }
}

if ( throws( () => {
    window.localStorage.setItem( 'test', 1 );
    window.localStorage.removeItem( 'test' );
}) ) {
    module.exports = {
        setItem: Cookies.set,
        getItem: Cookies.get,
        removeItem: Cookies.remove
    };
} else {
    module.exports = window.localStorage;
}